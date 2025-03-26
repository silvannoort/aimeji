"use client"

import { useState, useEffect } from "react"
import { Download, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { transformImage } from "@/lib/api"

export default function ResultsDisplay() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Check for uploaded image in session storage
  useEffect(() => {
    const storedImage = sessionStorage.getItem('uploadedImage')
    if (storedImage) {
      setUploadedImage(storedImage)
    }
  }, [])

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError("Please upload an image first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call the API to transform the image
      const response = await transformImage({
        imageBase64: uploadedImage,
        prompt: "Create a Studio Ghibli style anime portrait with soft, dreamlike quality and expressive features"
      })

      if (response.success && response.resultImageUrl) {
        setResult(response.resultImageUrl)
      } else {
        setError(response.error || "Failed to generate image")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      setError("An error occurred while generating the image")
    } finally {
      setIsLoading(false)
    }
  }

  // Check for uploaded image changes
  useEffect(() => {
    const checkForNewUpload = () => {
      const storedImage = sessionStorage.getItem('uploadedImage')
      if (storedImage && storedImage !== uploadedImage) {
        setUploadedImage(storedImage)
        setResult(null) // Reset result when a new image is uploaded
      }
    }

    // Check immediately and set up interval to check periodically
    checkForNewUpload()
    const interval = setInterval(checkForNewUpload, 1000)
    
    return () => clearInterval(interval)
  }, [uploadedImage])

  const downloadImage = async () => {
    if (result) {
      try {
        const response = await fetch(result)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement("a")
        link.href = url
        link.download = "aimeji-portrait.png"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Error downloading image:", error)
        setError("Failed to download image")
      }
    }
  }

  return (
    <Card className="border-3 border-[#81c784] bg-white rounded-2xl shadow-md h-full flex flex-col overflow-hidden">
      <CardContent className="p-4 flex-grow flex flex-col items-center justify-center min-h-[250px] relative">
        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-[#ffb74d] opacity-40" />
        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#81c784] opacity-40" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#5c6bc0] animate-spin" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#ffb74d]" />
              </div>
            </div>
            <p className="text-[#546e7a] text-sm font-medium animate-pulse">Creating anime portrait...</p>
            <div className="w-full max-w-[180px] h-2 bg-[#e8eaf6] rounded-full overflow-hidden">
              <div className="h-full bg-[#5c6bc0] animate-[loading_2s_ease-in-out_infinite]" style={{ width: "60%" }} />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
            <div className="p-3 mb-3 rounded-full bg-[#ffebee]">
              <svg
                className="w-8 h-8 text-[#f44336]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-bold text-[#f44336]">Transformation Failed</h3>
            <p className="mb-4 text-sm text-[#546e7a]">{error}</p>
            <Button
              onClick={() => setError(null)}
              className="bg-[#5c6bc0] hover:bg-[#3f51b5] text-white rounded-lg px-4 py-2 text-sm"
            >
              Try Again
            </Button>
          </div>
        ) : result ? (
          <div className="relative w-full">
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, transparent 60%, rgba(121, 134, 203, 0.2) 100%)",
              }}
            />
            <img
              src={result}
              alt="Anime Portrait"
              className="object-contain w-full rounded-lg max-h-[300px]"
            />
            <div className="absolute top-2 right-2 bg-[#5c6bc0] text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
              Aimeji
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-[#e8eaf6] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#5c6bc0]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#81c784] flex items-center justify-center">
                <span className="text-white font-bold text-xs">✨</span>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#3f51b5]">Your Anime Portrait</h3>
            <p className="mb-4 text-sm text-[#546e7a]">{uploadedImage ? 'Click transform to generate your anime portrait!' : 'Upload a photo and transform it into anime!'}</p>
            <Button
              onClick={handleGenerate}
              disabled={!uploadedImage}
              className="px-5 py-5 text-base font-medium bg-[#5c6bc0] hover:bg-[#3f51b5] text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Transform to Anime
            </Button>
          </div>
        )}
      </CardContent>

      {result && (
        <CardFooter className="flex justify-center p-3 border-t-2 border-[#e8eaf6]">
          <Button
            onClick={downloadImage}
            className="bg-[#81c784] hover:bg-[#66bb6a] text-white font-medium rounded-lg px-4 py-2 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Save Portrait
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

