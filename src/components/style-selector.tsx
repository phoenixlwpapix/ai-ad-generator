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

      <div className="flex justify-center gap-1 bg-gray-100 p-1 rounded-2xl">
        <Button
          variant={!useCustomPrompt ? "default" : "ghost"}
          onClick={() => !useCustomPrompt || handleToggleMode()}
          className={`rounded-xl px-6 py-2 font-medium transition-all duration-200 ${
            !useCustomPrompt 
              ? 'bg-white shadow-sm text-gray-900' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          Preset Styles
        </Button>
        <Button
          variant={useCustomPrompt ? "default" : "ghost"}
          onClick={() => useCustomPrompt || handleToggleMode()}
          className={`rounded-xl px-6 py-2 font-medium transition-all duration-200 ${
            useCustomPrompt 
              ? 'bg-white shadow-sm text-gray-900' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
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
                "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
                selectedStyle?.id === style.id
                  ? "border-violet-400 bg-gradient-to-br from-violet-50 to-blue-50 shadow-md ring-2 ring-violet-200"
                  : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
              )}
              onClick={() => onStyleSelect(style)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">{style.name}</h3>
                  {selectedStyle?.id === style.id && (
                    <div className="w-3 h-3 bg-violet-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{style.description}</p>
                <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-xl border border-gray-200">
                  <div className="font-medium text-gray-700 mb-1">AI Prompt:</div>
                  <div className="italic">{style.prompt}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label htmlFor="custom-prompt" className="block text-sm font-semibold text-gray-700 mb-3">
              Custom Prompt
            </label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => onCustomPromptChange(e.target.value)}
              className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 resize-none text-sm leading-relaxed transition-all duration-200"
              placeholder="Describe the style and look you want for your ad. For example: 'minimalist design with soft pastels, elegant typography, and a dreamy atmosphere...'"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{customPrompt.length} characters</span>
              {customPrompt.trim() && (
                <span className="text-xs text-green-600 font-medium">✓ Prompt ready</span>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Pro Tip</p>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Be specific about colors, mood, typography, composition, and any elements you want included in your ad design.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}