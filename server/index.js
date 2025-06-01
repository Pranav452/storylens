const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const generatedDir = path.join(__dirname, 'generated');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(generatedDir);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// In-memory storage for stories (in production, use a database)
const stories = new Map();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StoryLens API is running' });
});

// Upload image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageId = uuidv4();
    const imagePath = req.file.path;
    
    // Store image info
    const imageInfo = {
      id: imageId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: imagePath,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      image: imageInfo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Generate story from image
app.post('/api/generate-story', async (req, res) => {
  try {
    const { imageId, imagePath, storyType = 'story' } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Call Kosmos-2 model via Hugging Face API
    const storyResponse = await generateStoryWithKosmos2(base64Image, storyType);
    
    const storyId = uuidv4();
    const story = {
      id: storyId,
      imageId: imageId,
      imagePath: imagePath,
      content: storyResponse.story,
      type: storyType,
      generatedAt: new Date().toISOString(),
      audioPath: null
    };

    // Store the story
    stories.set(storyId, story);

    res.json({
      success: true,
      story: story
    });
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
});

// Generate audio from story
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { storyId, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for audio generation' });
    }

    // Generate audio using TTS
    const audioPath = await generateAudioWithTTS(text, storyId);
    
    // Update story with audio path
    if (storyId && stories.has(storyId)) {
      const story = stories.get(storyId);
      story.audioPath = audioPath;
      stories.set(storyId, story);
    }

    res.json({
      success: true,
      audioPath: audioPath,
      audioUrl: `/api/audio/${path.basename(audioPath)}`
    });
  } catch (error) {
    console.error('Audio generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate audio',
      details: error.message 
    });
  }
});

// Get story by ID
app.get('/api/story/:id', (req, res) => {
  try {
    const storyId = req.params.id;
    const story = stories.get(storyId);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({
      success: true,
      story: story
    });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: 'Failed to retrieve story' });
  }
});

// Serve uploaded images
app.get('/api/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Serve image error:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Serve generated audio
app.get('/api/audio/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const audioPath = path.join(generatedDir, filename);
    
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({ error: 'Audio not found' });
    }

    res.sendFile(audioPath);
  } catch (error) {
    console.error('Serve audio error:', error);
    res.status(500).json({ error: 'Failed to serve audio' });
  }
});

// Helper function to generate story using Kosmos-2
async function generateStoryWithKosmos2(base64Image, storyType) {
  try {
    const prompt = storyType === 'poem' 
      ? "Write a creative poem inspired by this image:"
      : "Write a creative short story inspired by this image:";

    // Using Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/kosmos-2-patch14-224',
      {
        inputs: {
          image: base64Image,
          text: prompt
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // If the model is still loading, provide a fallback
    if (response.data.error && response.data.error.includes('loading')) {
      return {
        story: generateFallbackStory(storyType)
      };
    }

    return {
      story: response.data.generated_text || generateFallbackStory(storyType)
    };
  } catch (error) {
    console.error('Kosmos-2 API error:', error.response?.data || error.message);
    return {
      story: generateFallbackStory(storyType)
    };
  }
}

// Helper function to generate audio using TTS
async function generateAudioWithTTS(text, storyId) {
  try {
    const audioFilename = `audio-${storyId || uuidv4()}-${Date.now()}.wav`;
    const audioPath = path.join(generatedDir, audioFilename);

    // For now, we'll create a placeholder audio file
    // In production, integrate with Coqui XTTS-v2 or similar TTS service
    const response = await axios.post(
      'https://api.coqui.ai/tts',
      {
        text: text,
        speaker_id: 'default',
        speed: 1.0
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COQUI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    await fs.writeFile(audioPath, response.data);
    return audioPath;
  } catch (error) {
    console.error('TTS API error:', error.response?.data || error.message);
    
    // Create a placeholder file for development
    const audioFilename = `audio-${storyId || uuidv4()}-${Date.now()}.txt`;
    const audioPath = path.join(generatedDir, audioFilename);
    await fs.writeFile(audioPath, `Audio for: ${text.substring(0, 100)}...`);
    return audioPath;
  }
}

// Fallback story generator
function generateFallbackStory(storyType) {
  const stories = [
    "In this captured moment, time seems to stand still. The image tells a story of beauty, wonder, and the magic found in everyday moments. Every detail speaks to the photographer's eye for capturing life's precious instances.",
    "Once upon a time, this scene unfolded before someone's eyes. They saw something special - a moment worth preserving, a memory worth keeping. The image holds secrets and stories waiting to be discovered.",
    "This photograph whispers tales of adventure, emotion, and human experience. In its pixels lie countless stories, each viewer bringing their own interpretation to the visual narrative presented here."
  ];
  
  const poems = [
    "A moment frozen in time's embrace,\nWhere light and shadow softly dance,\nThis image holds a special place,\nIn memory's vast expanse.",
    "Through the lens, a story told,\nOf beauty that will never fade,\nIn colors bright and shadows bold,\nA masterpiece nature made.",
    "Captured here for all to see,\nA slice of life's grand design,\nThis photograph will always be\nA treasure, pure and fine."
  ];

  const collection = storyType === 'poem' ? poems : stories;
  return collection[Math.floor(Math.random() * collection.length)];
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 StoryLens server running on port ${PORT}`);
  console.log(`📱 API Health: http://localhost:${PORT}/api/health`);
}); 