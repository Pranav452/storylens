import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Mic, Camera, Sparkles, Github, ExternalLink } from 'lucide-react';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-6"
        >
          <Camera className="h-12 w-12 text-primary-500 mr-3" />
          <Sparkles className="h-8 w-8 text-secondary-500" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About StoryLens
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover how advanced AI transforms your photos into captivating stories and brings them to life with natural voice narration.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12">
        {/* What is StoryLens */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is StoryLens?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            StoryLens is a cutting-edge application that combines the power of artificial intelligence with creative storytelling. 
            Simply upload any photo, and our AI will analyze the image to generate unique, creative stories or poems inspired by what it sees.
          </p>
          <p className="text-gray-600 leading-relaxed">
            But we don't stop there – we also transform your generated stories into natural-sounding speech, 
            allowing you to listen to your tales and share them with others as complete multimedia experiences.
          </p>
        </motion.section>

        {/* AI Models */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Powered by Advanced AI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kosmos-2 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-primary-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Microsoft Kosmos-2</h3>
                  <p className="text-sm text-gray-500">Vision-Language Model</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                A state-of-the-art multimodal model that understands both images and text. 
                It analyzes your photos to comprehend scenes, objects, and emotions, then crafts creative narratives.
              </p>
              <a
                href="https://huggingface.co/microsoft/kosmos-2-patch14-224"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                Learn more <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>

            {/* XTTS-v2 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Mic className="h-8 w-8 text-secondary-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Coqui XTTS-v2</h3>
                  <p className="text-sm text-gray-500">Text-to-Speech Model</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                An advanced neural text-to-speech system that converts your generated stories into natural, 
                expressive speech with high-quality audio output.
              </p>
              <a
                href="https://github.com/coqui-ai/TTS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-secondary-600 hover:text-secondary-700"
              >
                Learn more <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Image Analysis</h3>
                <p className="text-gray-600">
                  Upload your photo and our AI analyzes the visual content, identifying objects, scenes, emotions, and artistic elements.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Creative Generation</h3>
                <p className="text-gray-600">
                  Based on the analysis, the AI crafts original stories or poems that capture the essence and mood of your image.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Voice Synthesis</h3>
                <p className="text-gray-600">
                  Transform your written story into natural speech using advanced text-to-speech technology for a complete experience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Share & Enjoy</h3>
                <p className="text-gray-600">
                  Share your AI-generated stories with friends and family, complete with audio narration for an immersive experience.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">⚛️</div>
              <h3 className="font-semibold text-gray-900 text-sm">React</h3>
              <p className="text-xs text-gray-500">Frontend</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🟢</div>
              <h3 className="font-semibold text-gray-900 text-sm">Node.js</h3>
              <p className="text-xs text-gray-500">Backend</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🐍</div>
              <h3 className="font-semibold text-gray-900 text-sm">Python</h3>
              <p className="text-xs text-gray-500">AI Models</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold text-gray-900 text-sm">Tailwind</h3>
              <p className="text-xs text-gray-500">Styling</p>
            </div>
          </div>
        </motion.section>

        {/* Open Source */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="card bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
        >
          <div className="text-center">
            <Github className="h-12 w-12 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Source</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              StoryLens is built with modern, open-source technologies. 
              The complete source code, setup instructions, and documentation are available on GitHub.
            </p>
            <a
              href="https://github.com/storylens/storylens"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default About; 