'use client'

import React, { useState } from 'react'
import { Sparkles, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/image-upload'
import { StyleSelector } from '@/components/style-selector'
import { UploadedFile, AdStyle, GenerationRequest, GenerationResponse } from '@/types'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<AdStyle | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'square' | 'landscape' | 'portrait'>('square')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canGenerate = selectedFile && (selectedStyle || customPrompt.trim())

  const handleGenerate = async () => {
    if (!canGenerate) return

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const request: GenerationRequest = {
        productImage: selectedFile!.preview,
        aspectRatio,
        ...(customPrompt.trim() ? { customPrompt } : { style: selectedStyle! })
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      const result: GenerationResponse = await response.json()

      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl)
      } else {
        setError(result.error || 'Failed to generate ad')
      }
    } catch (err) {
      console.error('Generation error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `generated-ad-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetGenerator = () => {
    setSelectedFile(null)
    setSelectedStyle(null)
    setCustomPrompt('')
    setGeneratedImage(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            AI Ad Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your product photos into stunning advertisements with AI. 
            Upload your image, choose a style, and let our AI create beautiful marketing content.
          </p>
        </div>

        {generatedImage ? (
          /* Results View */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Generated Ad</h2>
                <p className="text-gray-600">Here's your beautiful AI-generated advertisement!</p>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <h3 className="text-lg font-semibold mb-4">Original Product</h3>
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <img 
                      src={selectedFile?.preview} 
                      alt="Original product" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <h3 className="text-lg font-semibold mb-4">Generated Ad</h3>
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <img 
                      src={generatedImage} 
                      alt="Generated advertisement" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Ad
                </Button>
                <Button variant="outline" onClick={resetGenerator}>
                  Create Another
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Generator View */
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Image Upload */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Product</h2>
                  <p className="text-gray-600">Start by uploading a high-quality photo of your product</p>
                </div>
                
                <ImageUpload 
                  onFileSelect={setSelectedFile} 
                  selectedFile={selectedFile} 
                />
                
                {selectedFile && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aspect Ratio
                    </label>
                    <div className="flex gap-2">
                      {(['square', 'landscape', 'portrait'] as const).map((ratio) => (
                        <Button
                          key={ratio}
                          variant={aspectRatio === ratio ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAspectRatio(ratio)}
                          className="capitalize"
                        >
                          {ratio}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Style Selection */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <StyleSelector
                  selectedStyle={selectedStyle}
                  customPrompt={customPrompt}
                  onStyleSelect={setSelectedStyle}
                  onCustomPromptChange={setCustomPrompt}
                />
              </div>
            </div>
            
            {/* Generate Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                size="lg"
                className="text-lg px-8 py-4 h-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Your Ad...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Beautiful Ad
                  </>
                )}
              </Button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
