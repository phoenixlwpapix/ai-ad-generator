'use client'

import React, { useState } from 'react'
import { Sparkles, Download, Loader2, Upload } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            AI Ad Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your product photos into stunning advertisements with AI. 
            Upload your image, choose a style, and let our AI create beautiful marketing content.
          </p>
        </div>

        {generatedImage ? (
          /* Results View */
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">Your Generated Ad</h2>
                <p className="text-gray-600 text-lg">Here's your beautiful AI-generated advertisement!</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-800">Original Product</h3>
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                    <img 
                      src={selectedFile?.preview} 
                      alt="Original product" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-gray-800">Generated Ad</h3>
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-violet-200 shadow-lg ring-4 ring-violet-100">
                    <img 
                      src={generatedImage} 
                      alt="Generated advertisement" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-6">
                <Button 
                  onClick={handleDownload} 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Ad
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetGenerator}
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 hover:bg-gray-50"
                >
                  Create Another
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Generator View */
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Left Column - Image Upload */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Product</h2>
                  <p className="text-gray-600">Start by uploading a high-quality photo of your product</p>
                </div>
                
                <ImageUpload 
                  onFileSelect={setSelectedFile} 
                  selectedFile={selectedFile} 
                />
                
                {selectedFile && (
                  <div className="mt-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Aspect Ratio
                    </label>
                    <div className="flex gap-2">
                      {(['square', 'landscape', 'portrait'] as const).map((ratio) => {
                        const icons = {
                          square: '□',
                          landscape: '⬜',
                          portrait: '▢'
                        };
                        return (
                          <Button
                            key={ratio}
                            variant={aspectRatio === ratio ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setAspectRatio(ratio)}
                            className={`capitalize font-medium px-4 py-2 rounded-xl transition-all duration-200 ${
                              aspectRatio === ratio 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' 
                                : 'border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <span className="mr-1">{icons[ratio]}</span>
                            {ratio}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Style Selection */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <StyleSelector
                  selectedStyle={selectedStyle}
                  customPrompt={customPrompt}
                  onStyleSelect={setSelectedStyle}
                  onCustomPromptChange={setCustomPrompt}
                />
              </div>
            </div>
            
            {/* Generate Button - Always visible with improved styling */}
            <div className="text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {!selectedFile ? 'Please upload an image to continue' : 
                     !selectedStyle && !customPrompt.trim() ? 'Please select a style or enter a custom prompt' :
                     'Ready to generate your ad!'}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${selectedFile ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Image uploaded</span>
                    <div className={`w-2 h-2 rounded-full ${(selectedStyle || customPrompt.trim()) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Style selected</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  size="lg"
                  className={`text-lg px-12 py-6 h-auto rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    canGenerate && !isGenerating 
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg hover:shadow-xl' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      <span>Generating Your Ad...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-3" />
                      <span>Generate Beautiful Ad</span>
                    </>
                  )}
                </Button>
                
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
