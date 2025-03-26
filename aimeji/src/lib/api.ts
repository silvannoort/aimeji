import axios from 'axios';
import { ImageTransformRequest, ImageTransformResponse } from '@/types';

export async function transformImage(data: ImageTransformRequest): Promise<ImageTransformResponse> {
  try {
    const response = await axios.post<ImageTransformResponse>('/api/transform/image', data);
    return response.data;
  } catch (error) {
    console.error('Error transforming image:', error);
    return {
      success: false,
      error: 'Failed to transform image'
    };
  }
}

export function buildGhibliStylePrompt(description: string): string {
  return `Transform this portrait into a Studio Ghibli-style anime character with these characteristics: ${description}. 
  Use soft, vibrant watercolor-like colors, delicate linework, and expressive eyes characteristic of Hayao Miyazaki's style. 
  Include detailed backgrounds with natural elements like foliage, clouds, or water. 
  Maintain the essence and emotion of the original portrait while giving it the whimsical, nostalgic feel of Studio Ghibli animations.`;
} 