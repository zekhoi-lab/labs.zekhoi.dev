'use client'

import { useState, useRef, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Compressor from 'compressorjs'
import { GlitchText } from '@/components/glitch-text'
import { cn } from '@/lib/utils'
import NextImage from 'next/image'

export default function ImageOptimizer() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [quality, setQuality] = useState(0.8)
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp')
  const [width, setWidth] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  
  const [previewOriginal, setPreviewOriginal] = useState<string>('')
  const [previewResult, setPreviewResult] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewOriginal) URL.revokeObjectURL(previewOriginal)
      if (previewResult) URL.revokeObjectURL(previewResult)
    }
  }, [previewOriginal, previewResult])

  const handleFileSelect = (uploadedFile: File) => {
    if (!uploadedFile.type.startsWith('image/')) return
    
    // Cleanup old previews
    if (previewOriginal) URL.revokeObjectURL(previewOriginal)
    if (previewResult) URL.revokeObjectURL(previewResult)
    
    setFile(uploadedFile)
    setPreviewOriginal(URL.createObjectURL(uploadedFile))
    setResult(null)
    setPreviewResult('')
    
    // Auto process with defaults
    processImage(uploadedFile)
  }

  const processImage = (targetFile: File = file!) => {
    if (!targetFile) return
    setIsProcessing(true)

    new Compressor(targetFile, {
      quality: quality,
      mimeType: format,
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      success(res) {
        if (previewResult) URL.revokeObjectURL(previewResult)
        setResult(res as File)
        setPreviewResult(URL.createObjectURL(res))
        setIsProcessing(false)
      },
      error(err) {
        console.error(err.message)
        setIsProcessing(false)
      },
    })
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        breadcrumbs={[
            { label: 'Image Optimizer', href: '/image' }
        ]}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="Image Optimizer" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed">
            Compress, resize, and convert images locally in your browser. No files are uploaded to any server.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0])
              }}
              className="group w-full aspect-video flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer rounded-lg bg-white dark:bg-black text-black dark:text-white"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform text-gray-400 group-hover:text-black dark:group-hover:text-white">photo_camera</span>
              <div className="text-center">
                <p className="text-sm font-bold">Drop Image Here</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">or click to browse</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-black dark:text-white">
                    <label className="text-[11px] font-bold uppercase tracking-wider">Quality</label>
                    <span className="text-xs">{Math.round(quality * 100)}%</span>
                  </div>
                  <input 
                    className="w-full accent-black dark:accent-white" 
                    max="100" 
                    min="1" 
                    type="range" 
                    value={quality * 100} 
                    onChange={(e) => setQuality(parseInt(e.target.value) / 100)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider block text-black dark:text-white">Format</label>
                  <div className="flex gap-2">
                    {[
                      { l: 'WebP', v: 'image/webp' }, 
                      { l: 'PNG', v: 'image/png' }, 
                      { l: 'JPEG', v: 'image/jpeg' }
                    ].map((opt) => (
                      <button 
                        key={opt.v}
                        onClick={() => setFormat(opt.v as 'image/jpeg' | 'image/png' | 'image/webp')}
                        className={cn(
                          "flex-1 border border-black dark:border-white px-3 py-2 text-xs font-bold transition-colors",
                          format === opt.v 
                            ? "bg-black text-white dark:bg-white dark:text-black" 
                            : "bg-white text-black dark:bg-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                        )}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider block text-black dark:text-white">Resize</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 uppercase">W</span>
                      <input 
                        className="w-full border border-black dark:border-white bg-transparent px-8 py-2 text-xs focus:ring-0 focus:outline-none text-black dark:text-white placeholder:text-gray-400" 
                        placeholder="Auto" 
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 uppercase">H</span>
                      <input 
                        className="w-full border border-black dark:border-white bg-transparent px-8 py-2 text-xs focus:ring-0 focus:outline-none text-black dark:text-white placeholder:text-gray-400" 
                        placeholder="Auto" 
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">Values in pixels. Leave empty for auto.</p>
                </div>
                <button 
                  onClick={() => processImage()}
                  disabled={!file || isProcessing}
                  className="w-full border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Process Image'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-black dark:text-white">Comparison</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Original */}
              <div className="border border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-black dark:text-white">
                  <span className="font-bold">Original</span>
                  <span className="text-gray-500">{file ? formatSize(file.size) : '-'}</span>
                </div>
                <div className="aspect-video bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden relative">
                  {previewOriginal ? (
                    <NextImage 
                      src={previewOriginal} 
                      alt="Original" 
                      fill
                      className="object-contain" 
                      unoptimized
                    />
                  ) : (
                    <span className="material-symbols-outlined text-gray-200 dark:text-gray-700 text-6xl">image</span>
                  )}
                </div>
              </div>

              {/* Optimized */}
              <div className="border border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-black dark:text-white">
                  <span className="font-bold">Optimized</span>
                  <div className="flex gap-3">
                    {result && file && (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {Math.round(((result.size - file.size) / file.size) * 100)}%
                      </span>
                    )}
                    <span className="text-gray-500">{result ? formatSize(result.size) : '-'}</span>
                  </div>
                </div>
                <div className="aspect-video bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden relative">
                   {previewResult ? (
                    <NextImage 
                      src={previewResult} 
                      alt="Optimized" 
                      fill
                      className="object-contain" 
                      unoptimized
                    />
                  ) : (
                    <span className="material-symbols-outlined text-gray-200 dark:text-gray-700 text-6xl">image</span>
                  )}
                </div>
                <button 
                  disabled={!result}
                  onClick={() => {
                     if (result) {
                       const a = document.createElement('a')
                       a.href = URL.createObjectURL(result)
                       a.download = `optimized.${format.split('/')[1]}`
                       a.click()
                     }
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-black dark:border-white py-2 text-xs font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-widest disabled:opacity-50 text-black dark:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
