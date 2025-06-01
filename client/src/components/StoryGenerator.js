import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Feather, Wand2, Play, Pause, Volume2, Share2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const StoryGenerator = ({ 
  uploadedImage, 
  onGenerateStory, 
  generatedStory, 
  isGenerating, 
  onGenerateAudio,
  isGeneratingAudio,
  audioUrl 
}) => {
  const [storyType, setStoryType] = useState('story');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const handleGenerate = () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    onGenerateStory(storyType);
  };

  const handleGenerateAudio = () => {
    if (!generatedStory?.content) {
      toast.error('Please generate a story first');
      return;
    }
    onGenerateAudio(generatedStory.content, generatedStory.id);
  };

  const handlePlayAudio = () => {
    if (!audioUrl) {
      toast.error('No audio available');
      return;
    }

    if (!audio) {
      const newAudio = new Audio(audioUrl);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
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
    if (!generatedStory) {
      toast.error('No story to share');
      return;
    }

    const shareUrl = `${window.location.origin}/story/${generatedStory.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this AI-generated story!',
          text: generatedStory.content.substring(0, 100) + '...',
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
    if (!generatedStory?.content) {
      toast.error('No story to copy');
      return;
    }
    
    navigator.clipboard.writeText(generatedStory.content);
    toast.success('Story copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Story Type Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Story Type</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setStoryType('story')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              storyType === 'story'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-primary-300 text-gray-700'
            }`}
          >
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <span className="block font-medium">Story</span>
            <span className="text-sm opacity-75">Creative narrative</span>
          </button>
          
          <button
            onClick={() => setStoryType('poem')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              storyType === 'poem'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-primary-300 text-gray-700'
            }`}
          >
            <Feather className="h-6 w-6 mx-auto mb-2" />
            <span className="block font-medium">Poem</span>
            <span className="text-sm opacity-75">Poetic verses</span>
          </button>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={!uploadedImage || isGenerating}
          className="w-full mt-6 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Generating {storyType}...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              <span>Generate {storyType === 'story' ? 'Story' : 'Poem'}</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Story */}
      {generatedStory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated {generatedStory.type === 'story' ? 'Story' : 'Poem'}
            </h3>
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
          
          <div className="story-content text-gray-800 whitespace-pre-line mb-6">
            {generatedStory.content}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="btn-secondary flex items-center space-x-2"
            >
              {isGeneratingAudio ? (
                <>
                  <div className="loading-spinner w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  <span>Generating audio...</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  <span>Generate Audio</span>
                </>
              )}
            </button>
            
            {audioUrl && (
              <button
                onClick={handlePlayAudio}
                className="btn-primary flex items-center space-x-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Play Audio</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StoryGenerator; 