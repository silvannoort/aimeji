import type { Metadata } from "next"
import Hero from "@/components/hero"
import ImageUploader from "@/components/image-uploader"
import ResultsDisplay from "@/components/results-display"

export const metadata: Metadata = {
  title: "Aimeji - AI Anime Portrait Generator",
  description: "Transform your photos into anime-style portraits with AI",
}

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: 'url("/images/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/30" />
      <div className="relative z-10 pt-6 pb-12">
        <Hero />
        <div className="container px-4 py-8 mx-auto max-w-md">
          <div className="grid gap-8 relative">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-lg">
              <ImageUploader />
            </div>
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-lg">
              <ResultsDisplay />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

