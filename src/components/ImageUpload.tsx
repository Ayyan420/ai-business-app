import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, FileImage, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label: string;
  accept?: string;
  maxSize?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  label,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Convert file to base64 for demo purposes
      // In production, you'd upload to a cloud storage service
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onImageUpload(result);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple: false
  });

  const removeImage = () => {
    onImageUpload('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
        {label}
      </label>
      
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt={label}
            className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-gray-600"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button
              onClick={removeImage}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-slate-300 dark:border-gray-600 hover:border-slate-400 dark:hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-slate-600 dark:text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-500">
                  PNG, JPG, GIF up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {fileRejections.length > 0 && (
        <div className="text-red-600 text-sm">
          {fileRejections[0].errors[0].message}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;