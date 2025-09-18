import { NextRequest, NextResponse } from 'next/server'
import { GenerationRequest, GenerationResponse } from '@/types'

const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY
const NANO_BANANA_BASE_URL = 'https://api.nanobana.com/v1'

export async function POST(request: NextRequest) {
  try {
    if (!NANO_BANANA_API_KEY) {
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

    // Call Nano Banana API
    const nanoBananaResponse = await fetch(`${NANO_BANANA_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NANO_BANANA_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        image: body.productImage,
        model: 'stable-diffusion-xl',
        width: body.aspectRatio === 'landscape' ? 1024 : body.aspectRatio === 'portrait' ? 768 : 1024,
        height: body.aspectRatio === 'landscape' ? 768 : body.aspectRatio === 'portrait' ? 1024 : 1024,
        steps: 30,
        guidance_scale: 7.5,
        strength: 0.8 // How much to modify the original image
      })
    })

    if (!nanoBananaResponse.ok) {
      const errorData = await nanoBananaResponse.text()
      console.error('Nano Banana API error:', errorData)
      return NextResponse.json(
        { success: false, error: 'Failed to generate image' },
        { status: 500 }
      )
    }

    const result = await nanoBananaResponse.json()
    
    const response: GenerationResponse = {
      success: true,
      imageUrl: result.image_url || result.url || result.output,
      requestId: result.id || result.request_id
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