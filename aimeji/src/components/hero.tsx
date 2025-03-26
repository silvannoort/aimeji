"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export default function Hero() {
  const scrollToUploader = () => {
    const uploader = document.getElementById("image-uploader")
    if (uploader) {
      uploader.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative overflow-hidden py-16">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-blue-300/40 blur-xl animate-pulse" />
      <div
        className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-green-300/40 blur-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-10 h-10 rounded-full bg-amber-200/40 blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="container relative z-10 px-4 mx-auto max-w-md">
        <div className="text-center">
          <h1
            className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
            style={{ 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic Pro", "Noto Sans JP", sans-serif'
            }}
          >
            Aimeji
          </h1>
          <p className="mx-auto mb-6 text-lg text-white font-medium" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
            Transform your photos into anime characters with AI magic! ✨
          </p>
          <Button
            onClick={scrollToUploader}
            className="px-6 py-6 text-lg font-medium bg-white/90 hover:bg-white text-indigo-600 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm"
          >
            Create Your Anime Portrait
            <ArrowDown className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

