export interface ImageTransformRequest {
  imageUrl?: string;
  imageBase64?: string;
  prompt?: string;
  options?: {
    style?: string;
    intensity?: number;
  };
}

export interface ImageTransformResponse {
  success: boolean;
  message?: string;
  resultImageUrl?: string;
  error?: string;
}

export interface UserPrompt {
  description: string;
  style: string;
}

export interface UploadResult {
  secure_url: string;
  public_id: string;
} 