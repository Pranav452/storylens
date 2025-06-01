import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageUploader = ({ onImageUpload, uploadedImage, onClearImage, isLoading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  const dropzoneClass = `
    relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
    ${isDragActive ? 'dropzone-active' : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'}
    ${isDragAccept ? 'dropzone-accept' : ''}
    ${isDragReject ? 'dropzone-reject' : ''}
    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  if (uploadedImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-xl overflow-hidden bg-white shadow-lg"
      >
        <img
          src={uploadedImage.preview}
          alt="Uploaded"
          className="w-full max-h-96 object-cover"
        />
        <button
          onClick={onClearImage}
          className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-4">
          <p className="text-sm text-gray-600">
            {uploadedImage.name} ({(uploadedImage.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...getRootProps()}
      className={dropzoneClass}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"></div>
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
              {isDragActive ? (
                <Upload className="h-8 w-8 text-primary-600" />
              ) : (
                <ImageIcon className="h-8 w-8 text-primary-600" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive
                  ? 'Drop your image here'
                  : 'Upload a photo to begin'
                }
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop an image, or click to select
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPEG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
            
            <button className="btn-primary">
              Choose Image
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUploader; 