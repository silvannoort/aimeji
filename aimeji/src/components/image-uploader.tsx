"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fileToBase64 } from "@/lib/images"

export default function ImageUploader() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [base64Image, setBase64Image] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (file: File | null) => {
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Convert to base64 for API
      try {
        const base64 = await fileToBase64(file)
        setBase64Image(base64)
        
        // Store in sessionStorage for access by results component
        sessionStorage.setItem('uploadedImage', base64)
        sessionStorage.setItem('previewUrl', URL.createObjectURL(file))
      } catch (error) {
        console.error('Error converting to base64:', error)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const clearImage = () => {
    setImage(null)
    setPreview(null)
    setBase64Image(null)
    sessionStorage.removeItem('uploadedImage')
    sessionStorage.removeItem('previewUrl')
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card
      className="overflow-hidden border-3 border-dashed border-[#7986cb] bg-white rounded-2xl shadow-md"
      id="image-uploader"
    >
      <CardContent className="p-0">
        {!preview ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-6 transition-colors duration-200 cursor-pointer min-h-[250px]",
              isDragging ? "bg-[#e8eaf6]" : "bg-white hover:bg-[#f5f7ff]",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-4 mb-4 rounded-full bg-[#e8eaf6]">
              <Upload className="w-8 h-8 text-[#5c6bc0]" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#3f51b5]">Upload Your Photo</h3>
            <p className="mb-4 text-sm text-center text-[#546e7a]">Tap here or drop a photo to transform</p>
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#7986cb]" />
              ))}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0])
                }
              }}
            />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#e8eaf6] opacity-30 pointer-events-none" />
            <img src={preview || "/placeholder.svg"} alt="Preview" className="object-contain w-full max-h-[300px]" />
            <Button
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white border-2 border-[#7986cb] w-8 h-8"
              onClick={clearImage}
            >
              <X className="w-4 h-4 text-[#3f51b5]" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

