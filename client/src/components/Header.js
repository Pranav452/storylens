import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Sparkles } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Camera className="h-8 w-8 text-primary-500 group-hover:text-primary-600 transition-colors" />
              <Sparkles className="h-4 w-4 text-secondary-500 absolute -top-1 -right-1 group-hover:text-secondary-600 transition-colors" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              StoryLens
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                isActive('/') 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                isActive('/about') 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-600'
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 