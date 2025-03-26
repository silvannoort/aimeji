'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { PromptInput } from '@/components/ui/PromptInput';
import { Button } from '@/components/ui/Button';
import { ResultDisplay } from '@/components/ui/ResultDisplay';
import { buildGhibliStylePrompt } from '@/lib/api';
import { transformImage } from '@/lib/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = (file: File, base64: string) => {
    setSelectedFile(file);
    setBase64Image(base64);
    setResultImage(null);
  };

  const handlePromptChange = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  const handleTransform = async () => {
    if (!base64Image) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);

    try {
      // Generate a prompt if user didn't provide one
      const prompt = customPrompt 
        ? buildGhibliStylePrompt(customPrompt)
        : buildGhibliStylePrompt('a character with expressive features and detailed background');

      const response = await transformImage({
        imageBase64: base64Image,
        prompt,
      });

      if (response.success && response.resultImageUrl) {
        setResultImage(response.resultImageUrl);
        toast.success('Image transformation complete!');
      } else {
        toast.error(response.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error transforming image:', error);
      toast.error('Failed to transform image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewTransform = () => {
    setSelectedFile(null);
    setBase64Image(null);
    setResultImage(null);
    setCustomPrompt('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <ToastContainer position="bottom-right" theme="light" />
      
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 tracking-tight">AiMeji</h1>
          <p className="mt-3 text-xl text-gray-600">Transform your photos into Studio Ghibli-style anime portraits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resultImage ? (
            <ResultDisplay
              imageUrl={resultImage}
              onNewTransform={handleNewTransform}
              className="lg:col-span-2 mx-auto max-w-md"
            />
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Photo</h2>
                <ImageUploader onImageSelect={handleImageSelect} />
                
                <div className="mt-6">
                  <PromptInput onPromptChange={handlePromptChange} />
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={handleTransform}
                    isLoading={isProcessing}
                    disabled={!base64Image || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? 'Transforming...' : 'Transform to Ghibli Style'}
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ghibli Magic</h2>
                <p className="text-gray-600 mb-4">
                  Experience the enchanting world of Studio Ghibli with your own portrait. 
                  Our AI transforms your photos into the iconic artistic style of Hayao Miyazaki's animations.
                </p>
                
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="relative aspect-square rounded-md overflow-hidden">
                    <Image 
                      src="/sample1.jpg" 
                      alt="Sample original" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-md overflow-hidden">
                    <Image 
                      src="/sample1-ghibli.jpg" 
                      alt="Sample transformed" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
