import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export interface ImageGenerationOptions {
  prompt: string;
  n?: number;
  size?: '1024x1024' | '512x512' | '256x256';
  style?: 'vivid' | 'natural';
}

export async function generateImage({
  prompt,
  n = 1,
  size = '1024x1024',
  style = 'vivid'
}: ImageGenerationOptions): Promise<string> {
  try {
    // Use DALL-E 3 to generate an image based on the prompt
    const response = await openai.images.generate({
      prompt: `Create a Studio Ghibli-style anime portrait with the following characteristics: ${prompt}. 
      Use soft, vibrant watercolor-like colors, delicate linework, and expressive eyes characteristic of Hayao Miyazaki's style. 
      Include detailed backgrounds with natural elements like foliage, clouds, or water.
      Create a whimsical, nostalgic feel similar to Studio Ghibli animations.`,
      n,
      size,
      style,
      model: 'dall-e-3',
      quality: 'hd',
      response_format: 'url'
    });

    // Return the first image URL
    if (response.data && response.data.length > 0 && response.data[0].url) {
      return response.data[0].url;
    }
    
    throw new Error('No image was generated');
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    throw error;
  }
} 