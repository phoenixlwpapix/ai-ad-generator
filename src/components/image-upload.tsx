'use client'

import React, { useCallback, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, validateImageFile, formatFileSize } from '@/lib/utils'
import { UploadedFile } from '@/types'

interface ImageUploadProps {
  onFileSelect: (file: UploadedFile | null) => void
  selectedFile: UploadedFile | null
}

export function ImageUpload({ onFileSelect, selectedFile }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    setError(null)
    
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const uploadedFile: UploadedFile = {
        file,
        preview: reader.result as string,
        name: file.name,
        size: file.size
      }
      onFileSelect(uploadedFile)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const removeFile = () => {
    onFileSelect(null)
    setError(null)
  }

  if (selectedFile) {
    return (
      <div className="relative">
        <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
          <img
            src={selectedFile.preview}
            alt={selectedFile.name}
            className="w-full h-full object-cover"
          />
          <Button
            onClick={removeFile}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">{selectedFile.name}</p>
          <p className="text-xs text-gray-400">{formatFileSize(selectedFile.size)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept="image/jpeg,image/png,image/webp"
        />
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            {dragActive ? (
              <Upload className="h-12 w-12" />
            ) : (
              <ImageIcon className="h-12 w-12" />
            )}
          </div>
          <div className="text-sm text-gray-600">
            {dragActive ? (
              <p>Drop your image here...</p>
            ) : (
              <>
                <p className="font-semibold">Upload your product photo</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click or drag and drop your image here
                </p>
                <p className="text-xs text-gray-400">
                  JPEG, PNG, or WebP • Max 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}