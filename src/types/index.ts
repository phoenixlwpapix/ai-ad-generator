export interface AdStyle {
  id: string
  name: string
  description: string
  prompt: string
  preview?: string
}

export interface GenerationRequest {
  productImage: string // base64 encoded image
  style?: AdStyle
  customPrompt?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait'
}

export interface GenerationResponse {
  success: boolean
  imageUrl?: string
  error?: string
  requestId?: string
}

export interface UploadedFile {
  file: File
  preview: string
  name: string
  size: number
}

export const DEFAULT_AD_STYLES: AdStyle[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, modern design with plenty of white space',
    prompt: 'modern minimal clean design, white background, professional product photography, high-end luxury feel, simple typography'
  },
  {
    id: 'vibrant-colorful',
    name: 'Vibrant & Colorful',
    description: 'Bold, eye-catching colors and dynamic composition',
    prompt: 'vibrant colorful background, dynamic composition, bold colors, energetic feel, modern graphics, eye-catching design'
  },
  {
    id: 'elegant-luxury',
    name: 'Elegant Luxury',
    description: 'Sophisticated and premium aesthetic',
    prompt: 'luxury elegant design, premium feel, sophisticated lighting, gold accents, high-end product presentation, refined aesthetics'
  },
  {
    id: 'retro-vintage',
    name: 'Retro Vintage',
    description: 'Nostalgic vintage-inspired design',
    prompt: 'retro vintage style, nostalgic feel, classic typography, warm color palette, aged texture, timeless design'
  },
  {
    id: 'tech-futuristic',
    name: 'Tech Futuristic',
    description: 'Cutting-edge technology aesthetic',
    prompt: 'futuristic tech design, digital elements, neon accents, modern technology feel, sleek interface, innovative presentation'
  },
  {
    id: 'natural-organic',
    name: 'Natural Organic',
    description: 'Earth-friendly, natural, and organic feel',
    prompt: 'natural organic design, earth tones, sustainable feel, nature-inspired elements, eco-friendly aesthetic, green lifestyle'
  }
]