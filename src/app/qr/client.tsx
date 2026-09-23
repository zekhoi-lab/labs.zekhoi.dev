'use client'

import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GlitchText } from '@/components/glitch-text'
import { renderQr, type QrLevel, type QrResult } from '@/lib/qr'

const LEVELS: { value: QrLevel, label: string }[] = [
  { value: 'L', label: 'L · recovers ~7%' },
  { value: 'M', label: 'M · recovers ~15%' },
  { value: 'Q', label: 'Q · recovers ~25%' },
  { value: 'H', label: 'H · recovers ~30%' },
]

const SIZES = [128, 256, 512, 1024]

const fieldClass = "w-full bg-white dark:bg-black border border-black dark:border-white px-3 py-2 text-sm font-mono text-black dark:text-white focus:outline-none focus:ring-0"

export default function QrGenerator() {
  const [text, setText] = useState('https://labs.zekhoi.dev')
  const [level, setLevel] = useState<QrLevel>('M')
  const [size, setSize] = useState(256)
  const [margin, setMargin] = useState(2)
  const [result, setResult] = useState<QrResult | null>(null)

  // Rendering is async; a result for inputs that have since changed is dropped
  useEffect(() => {
    let cancelled = false
    renderQr(text, { level, size, margin }).then(next => {
      if (!cancelled) setResult(next)
    })
    return () => { cancelled = true }
  }, [text, level, size, margin])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar
        title="labs.zekhoi.dev"
        icon="terminal"
        breadcrumbs={[
            { label: 'QR Code Generator', href: '/qr' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="QR Code Generator" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed">
            Turn text or a URL into a QR code and download it as PNG or SVG. The code is generated in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="qr-text" className="text-xs font-bold uppercase tracking-widest text-gray-500">Text or URL</label>
              <textarea
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                spellCheck={false}
                className={`${fieldClass} resize-y`}
              />
              <p className="text-[10px] uppercase tracking-widest text-gray-400">{new Blob([text]).size} bytes</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="qr-level" className="text-xs font-bold uppercase tracking-widest text-gray-500">Error correction</label>
                <select id="qr-level" value={level} onChange={(e) => setLevel(e.target.value as QrLevel)} className={fieldClass}>
                  {LEVELS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="qr-size" className="text-xs font-bold uppercase tracking-widest text-gray-500">Size</label>
                <select id="qr-size" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className={fieldClass}>
                  {SIZES.map(value => <option key={value} value={value}>{value} px</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="qr-margin" className="text-xs font-bold uppercase tracking-widest text-gray-500">Margin</label>
                <select id="qr-margin" value={margin} onChange={(e) => setMargin(parseInt(e.target.value))} className={fieldClass}>
                  {[0, 1, 2, 4, 8].map(value => <option key={value} value={value}>{value} modules</option>)}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Higher error correction survives more damage or a logo on top, but fits less text.
            </p>
          </div>

          <div className="border border-black dark:border-white p-6 flex flex-col items-center gap-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            {result === null ? (
              <div className="h-64 flex items-center justify-center text-xs uppercase tracking-widest text-gray-400">Generating...</div>
            ) : result.ok ? (
              <>
                <div className="bg-white p-2 border border-gray-200">
                  <NextImage src={result.png} alt="QR code" width={size} height={size} unoptimized className="w-64 h-64 [image-rendering:pixelated]" />
                </div>
                <div className="flex gap-4 w-full">
                  <a href={result.png} download="qr-code.png" className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 text-xs font-bold uppercase tracking-widest hover:opacity-80">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download PNG
                  </a>
                  <a href={result.svg} download="qr-code.svg" className="flex-1 flex items-center justify-center gap-2 border border-black dark:border-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download SVG
                  </a>
                </div>
              </>
            ) : (
              <div role="alert" className="w-full border border-red-500 bg-red-50 dark:bg-red-900/10 p-4 text-sm text-red-600 dark:text-red-400">
                {result.error}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
