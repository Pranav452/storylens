import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Volume2, Share2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../utils/api';

const StoryView = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStory(id);
        
        if (response.success) {
          setStory(response.story);
        } else {
          setError(response.error || 'Story not found');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
        setError(error.response?.data?.error || 'Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  const handlePlayAudio = () => {
    if (!story?.audioPath) {
      toast.error('No audio available for this story');
      return;
    }

    const audioUrl = apiService.getAudioUrl(story.audioPath.split('/').pop());

    if (!audio) {
      const newAudio = new Audio(audioUrl);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      newAudio.addEventListener('error', () => {
        toast.error('Error playing audio');
        setIsPlaying(false);
      });
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this AI-generated story!',
          text: story.content.substring(0, 100) + '...',
          url: shareUrl
        });
      } catch (error) {
        // Fallback to copy
        navigator.clipboard.writeText(shareUrl);
        toast.success('Story link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Story link copied to clipboard!');
    }
  };

  const handleCopyStory = () => {
    navigator.clipboard.writeText(story.content);
    toast.success('Story copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Story Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/" className="btn-primary inline-flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyStory}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Copy story"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Share story"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image */}
        {story.imagePath && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card p-0 overflow-hidden">
              <img
                src={apiService.getImageUrl(story.imagePath.split('/').pop())}
                alt="Story inspiration"
                className="w-full h-64 lg:h-80 object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                AI-Generated {story.type === 'story' ? 'Story' : 'Poem'}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {new Date(story.generatedAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="story-content text-gray-800 whitespace-pre-line mb-8">
              {story.content}
            </div>
            
            {/* Audio Controls */}
            {story.audioPath && (
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                <button
                  onClick={handlePlayAudio}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause Narration</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Play Narration</span>
                    </>
                  )}
                </button>
                <div className="flex items-center text-sm text-gray-500">
                  <Volume2 className="h-4 w-4 mr-1" />
                  <span>AI Voice Narration Available</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Create Your Own Story
          </h3>
          <p className="text-gray-600 mb-4">
            Upload your photos and let AI transform them into magical stories with voice narration.
          </p>
          <Link to="/" className="btn-primary">
            Try StoryLens Now
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoryView; 