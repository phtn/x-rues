"use client";

import React, { useState, useRef } from "react";

interface ImageUploadProps {
  onImageSelect: (imageData: string, fileName: string) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        onImageSelect(base64Data, file.name);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || isProcessing) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          backgroundColor: isDragging ? '#1e40af' : (disabled || isProcessing) ? '#374151' : '#475569',
          border: isDragging ? '2px dashed #60a5fa' : '1px solid #6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: (disabled || isProcessing) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: (disabled || isProcessing) ? 0.5 : 1
        }}
        title={isProcessing ? 'Processing image...' : 'Click or drag to upload image'}
      >
        {isProcessing ? (
          <span style={{ fontSize: '16px' }}>⏳</span>
        ) : (
          <span style={{ fontSize: '16px', color: '#f1f5f9' }}>📷</span>
        )}
      </div>
    </>
  );
};

ImageUpload.displayName = 'ImageUpload';