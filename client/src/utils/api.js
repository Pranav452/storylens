import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Generate story from image
  generateStory: async (imageId, imagePath, storyType = 'story') => {
    const response = await api.post('/generate-story', {
      imageId,
      imagePath,
      storyType,
    });
    
    return response.data;
  },

  // Generate audio from text
  generateAudio: async (storyId, text) => {
    const response = await api.post('/generate-audio', {
      storyId,
      text,
    });
    
    return response.data;
  },

  // Get story by ID
  getStory: async (storyId) => {
    const response = await api.get(`/story/${storyId}`);
    return response.data;
  },

  // Get image URL
  getImageUrl: (filename) => {
    return `${API_BASE_URL}/image/${filename}`;
  },

  // Get audio URL
  getAudioUrl: (filename) => {
    return `${API_BASE_URL}/audio/${filename}`;
  },
};

export default api; 