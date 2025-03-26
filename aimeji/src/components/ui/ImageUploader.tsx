import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { fileToBase64, isValidImageFile } from '@/lib/images';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File, base64: string) => void;
  className?: string;
}

export function ImageUploader({ onImageSelect, className = '' }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];
      
      if (!isValidImageFile(file)) {
        setError('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        setError('Image size should be less than 4MB');
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setPreview(URL.createObjectURL(file));
        onImageSelect(file, base64);
      } catch (err) {
        setError('Failed to process image');
        console.error(err);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxFiles: 1,
    multiple: false,
  });

  const clearImage = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 h-64">
          <Image 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain" 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
            aria-label="Remove image"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer h-64 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-500">Drop your image here...</p>
          ) : (
            <div>
              <p className="text-gray-600">Drag and drop your photo here, or click to select</p>
              <p className="text-gray-400 text-sm mt-1">Supported formats: JPEG, PNG, WebP (max 4MB)</p>
            </div>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
} 