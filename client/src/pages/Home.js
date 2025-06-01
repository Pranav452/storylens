import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';
import StoryGenerator from '../components/StoryGenerator';
import { apiService } from '../utils/api';

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await apiService.healthCheck();
        console.log('API is healthy');
      } catch (error) {
        console.error('API health check failed:', error);
        toast.error('Unable to connect to the server. Please try again later.');
      }
    };

    checkApiHealth();
  }, []);

  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      const imageData = {
        file,
        preview,
        name: file.name,
        size: file.size,
      };
      
      setUploadedImage(imageData);
      
      // Upload to server
      const response = await apiService.uploadImage(file);
      
      if (response.success) {
        setUploadedImage(prev => ({
          ...prev,
          ...response.image
        }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload image');
      setUploadedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setGeneratedStory(null);
    setAudioUrl(null);
  };

  const handleGenerateStory = async (storyType) => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedStory(null);
      setAudioUrl(null);
      
      const response = await apiService.generateStory(
        uploadedImage.id,
        uploadedImage.path,
        storyType
      );
      
      if (response.success) {
        setGeneratedStory(response.story);
        toast.success(`${storyType === 'story' ? 'Story' : 'Poem'} generated successfully!`);
      } else {
        throw new Error(response.error || 'Story generation failed');
      }
    } catch (error) {
      console.error('Story generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async (text, storyId) => {
    try {
      setIsGeneratingAudio(true);
      
      const response = await apiService.generateAudio(storyId, text);
      
      if (response.success) {
        setAudioUrl(response.audioUrl);
        toast.success('Audio generated successfully!');
      } else {
        throw new Error(response.error || 'Audio generation failed');
      }
    } catch (error) {
      console.error('Audio generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Transform Photos into
          <span className="block gradient-bg bg-clip-text text-transparent">
            Magical Stories
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload any photo and watch as AI crafts unique stories and poems inspired by what it sees. 
          Then bring your stories to life with AI-generated voice narration.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            1. Upload Your Photo
          </h2>
          <ImageUploader
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
            onClearImage={handleClearImage}
            isLoading={isUploading}
          />
        </motion.div>

        {/* Right Column - Story Generation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            2. Generate Your Story
          </h2>
          <StoryGenerator
            uploadedImage={uploadedImage}
            onGenerateStory={handleGenerateStory}
            generatedStory={generatedStory}
            isGenerating={isGenerating}
            onGenerateAudio={handleGenerateAudio}
            isGeneratingAudio={isGeneratingAudio}
            audioUrl={audioUrl}
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
          <p className="text-gray-600">
            Uses advanced Microsoft Kosmos-2 model for intelligent image understanding and creative writing.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Narration</h3>
          <p className="text-gray-600">
            Bring stories to life with high-quality AI voice synthesis using Coqui XTTS-v2.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Sharing</h3>
          <p className="text-gray-600">
            Share your generated stories with friends and family with just one click.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 