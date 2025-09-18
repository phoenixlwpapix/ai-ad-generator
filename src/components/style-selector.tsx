'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AdStyle, DEFAULT_AD_STYLES } from '@/types'

interface StyleSelectorProps {
  selectedStyle: AdStyle | null
  customPrompt: string
  onStyleSelect: (style: AdStyle | null) => void
  onCustomPromptChange: (prompt: string) => void
}

export function StyleSelector({
  selectedStyle,
  customPrompt,
  onStyleSelect,
  onCustomPromptChange
}: StyleSelectorProps) {
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)

  const handleToggleMode = () => {
    setUseCustomPrompt(!useCustomPrompt)
    if (!useCustomPrompt) {
      onStyleSelect(null)
    } else {
      onCustomPromptChange('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Style</h2>
        <p className="text-gray-600">Select a preset style or create your own custom prompt</p>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          variant={!useCustomPrompt ? "default" : "outline"}
          onClick={() => !useCustomPrompt || handleToggleMode()}
        >
          Preset Styles
        </Button>
        <Button
          variant={useCustomPrompt ? "default" : "outline"}
          onClick={() => useCustomPrompt || handleToggleMode()}
        >
          Custom Prompt
        </Button>
      </div>

      {!useCustomPrompt ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_AD_STYLES.map((style) => (
            <div
              key={style.id}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                selectedStyle?.id === style.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => onStyleSelect(style)}
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{style.name}</h3>
                <p className="text-sm text-gray-600">{style.description}</p>
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                  <strong>Prompt:</strong> {style.prompt}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Prompt
            </label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Describe the style and look you want for your ad. For example: 'minimalist design with soft pastels, elegant typography, and a dreamy atmosphere...'"
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Be specific about colors, mood, typography, composition, and any elements you want included in your ad design.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}