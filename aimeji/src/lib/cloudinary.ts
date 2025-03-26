import { v2 as cloudinary } from 'cloudinary';
import { UploadResult } from '@/types';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function uploadImageToCloudinary(
  base64Image: string,
  folder = 'aimeji-uploads'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder,
      resource_type: 'image'
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
} 