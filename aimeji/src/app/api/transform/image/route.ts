import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/openai';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { ImageTransformRequest, ImageTransformResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<ImageTransformResponse>> {
  try {
    const { imageBase64, prompt } = await req.json() as ImageTransformRequest;
    
    // We still require image upload for visual reference, but don't use it directly in generation
    if (!imageBase64) {
      return NextResponse.json({
        success: false,
        error: 'No image provided. Please provide a base64 encoded image.'
      }, { status: 400 });
    }

    // Upload image to Cloudinary for storage/reference
    let uploadedImageUrl: string | undefined;
    try {
      const uploadResult = await uploadImageToCloudinary(imageBase64);
      uploadedImageUrl = uploadResult.secure_url;
    } catch (error) {
      console.warn('Failed to upload to Cloudinary, continuing with generation anyway');
    }

    // Generate prompt if not provided
    const finalPrompt = prompt || 'Create a Studio Ghibli style anime portrait with soft, dreamlike quality and expressive features';

    // Generate image with OpenAI using text-to-image
    const resultImageUrl = await generateImage({
      prompt: finalPrompt
    });

    return NextResponse.json({
      success: true,
      resultImageUrl,
      message: 'Image transformed successfully'
    });
  } catch (error) {
    console.error('Error in image transformation API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
} 