"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface BannerUploadProps {
  value: string
  onChange: (url: string) => void
  onFileSelect?: (file: File) => void
}

export default function BannerUpload({ value, onChange, onFileSelect }: BannerUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(value)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPreview(value)
  }, [value])

  const handleFile = useCallback((file: File) => {
    setError("")

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onChange(result)
    }
    reader.onerror = () => {
      setError("Failed to read file")
    }
    reader.readAsDataURL(file)

    // Pass file to parent if callback provided
    if (onFileSelect) {
      onFileSelect(file)
    }
  }, [onChange, onFileSelect])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile()
        if (file) {
          e.preventDefault()
          handleFile(file)
          break
        }
      }
    }
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    onChange(url)
    setPreview(url)
    setError("")
  }, [onChange])

  const handleRemove = useCallback(() => {
    setPreview("")
    onChange("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onChange])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Add paste listener to the drop zone
  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const pasteHandler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile()
          if (file) {
            e.preventDefault()
            handleFile(file)
            break
          }
        }
      }
    }

    dropZone.addEventListener("paste", pasteHandler as any)
    return () => {
      dropZone.removeEventListener("paste", pasteHandler as any)
    }
  }, [handleFile])

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        tabIndex={0}
        className={`
          relative border-2 border-dashed rounded-lg transition-all
          ${isDragging
            ? "border-white bg-zinc-800/50"
            : "border-zinc-700 hover:border-zinc-600"
          }
          ${preview ? "aspect-video" : "aspect-video md:aspect-[21/9]"}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Banner preview"
              className="w-full h-full object-cover rounded-lg"
              onError={() => {
                setError("Failed to load image")
                setPreview("")
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg">
              <button
                type="button"
                onClick={handleClick}
                className="px-4 py-2 bg-white text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors font-medium"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <div className="p-4 bg-zinc-800 rounded-full">
              {isDragging ? (
                <ImageIcon className="w-8 h-8" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-white mb-1">
                {isDragging ? "Drop image here" : "Drop, paste or click to upload"}
              </p>
              <p className="text-xs text-zinc-500">
                Supports JPG, PNG, WebP • Max 5MB • Focus to paste (Ctrl+V)
              </p>
            </div>
          </button>
        )}
      </div>

      {/* URL Input Alternative */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-500">or paste URL</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <input
        type="url"
        value={value}
        onChange={handleUrlChange}
        placeholder="https://example.com/banner.jpg"
        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500"
      />

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex items-center gap-2">
          <X className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-zinc-500">
        💡 Tip: Click the upload area and press Ctrl+V (Cmd+V on Mac) to paste copied images
      </p>
    </div>
  )
}
