import Image from 'next/image';
import { Download } from 'lucide-react';
import { Button } from './Button';
import { useState } from 'react';

interface ResultDisplayProps {
  imageUrl: string;
  onDownload?: () => void;
  onNewTransform?: () => void;
  className?: string;
}

export function ResultDisplay({
  imageUrl,
  onDownload,
  onNewTransform,
  className = '',
}: ResultDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ghibli-portrait-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative rounded-md overflow-hidden shadow-md aspect-square">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        )}
        <Image
          src={imageUrl}
          alt="Ghibli-styled portrait"
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoaded ? 1 : 0 }}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoadingComplete={() => setIsLoaded(true)}
        />
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={handleDownload} className="flex-1" variant="primary">
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </Button>
        
        {onNewTransform && (
          <Button onClick={onNewTransform} className="flex-1" variant="outline">
            Create New
          </Button>
        )}
      </div>
    </div>
  );
} 