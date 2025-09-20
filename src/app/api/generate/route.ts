import { NextRequest, NextResponse } from 'next/server'
import { GenerationRequest, GenerationResponse } from '@/types'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GOOGLE_IMAGEN_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict'

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      )
    }

    const body: GenerationRequest = await request.json()
    
    if (!body.productImage) {
      return NextResponse.json(
        { success: false, error: 'Product image is required' },
        { status: 400 }
      )
    }

    // Construct the prompt for ad generation
    let prompt = 'Create a beautiful advertisement for this product. '
    
    if (body.customPrompt) {
      prompt += body.customPrompt
    } else if (body.style) {
      prompt += body.style.prompt
    } else {
      prompt += 'modern clean design, professional product presentation, marketing advertisement'
    }

    // Add aspect ratio to prompt if specified
    if (body.aspectRatio) {
      prompt += `, ${body.aspectRatio} aspect ratio`
    }

    // Call Google Imagen API
    const imagenResponse = await fetch(GOOGLE_IMAGEN_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: body.aspectRatio,
        },
      })
    })

    if (!imagenResponse.ok) {
      const errorData = await imagenResponse.text()
      console.error('Google Imagen API error:', errorData)
      return NextResponse.json(
        { success: false, error: 'Failed to generate image' },
        { status: 500 }
      )
    }

    const result = await imagenResponse.json()

    const image = result.predictions[0]
    const imageUrl = `data:${image.mimeType};base64,${image.bytesBase64Encoded}`

    const response: GenerationResponse = {
      success: true,
      imageUrl: imageUrl,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}