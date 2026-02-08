'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import * as ColorUtils from '@/lib/color'
import { cn } from '@/lib/utils'

export default function ColorConverter() {
  const [hex, setHex] = useState('#000000')
  const [rgb, setRgb] = useState('rgb(0, 0, 0)')
  const [hsl, setHsl] = useState('hsl(0, 0%, 0%)')
  
  // Internal numeric state for single source of truth when needed, 
  // but for input fields we need to allow partial edits.
  // We'll use hex as the "committed" color for preview.
  const [activeColor, setActiveColor] = useState({ r: 0, g: 0, b: 0 })



  const handleHexChange = (val: string) => {
    setHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const rgb = ColorUtils.hexToRgb(val)
      if (rgb) {
        setRgb(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
        const newHsl = ColorUtils.rgbToHsl(rgb.r, rgb.g, rgb.b)
        setHsl(`hsl(${newHsl.h}, ${newHsl.s}%, ${newHsl.l}%)`)
        setActiveColor(rgb)
      }
    }
  }

  const handleRgbChange = (val: string) => {
    setRgb(val)
    const parsed = ColorUtils.parseRgbString(val)
    if (parsed) {
      setHex(ColorUtils.rgbToHex(parsed.r, parsed.g, parsed.b))
      const newHsl = ColorUtils.rgbToHsl(parsed.r, parsed.g, parsed.b)
      setHsl(`hsl(${newHsl.h}, ${newHsl.s}%, ${newHsl.l}%)`)
      setActiveColor(parsed)
    }
  }

  const handleHslChange = (val: string) => {
    setHsl(val)
    const parsed = ColorUtils.parseHslString(val)
    if (parsed) {
      const newRgb = ColorUtils.hslToRgb(parsed.h, parsed.s, parsed.l)
      setRgb(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`)
      setHex(ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b))
      setActiveColor(newRgb)
    }
  }

  // Derived Values
  const luminance = ColorUtils.getLuminance(activeColor.r, activeColor.g, activeColor.b)
  const contrastWhite = ColorUtils.getContrastRatio(luminance, 1.0)
  const contrastBlack = ColorUtils.getContrastRatio(luminance, 0.0)
  
  const hslValues = ColorUtils.rgbToHsl(activeColor.r, activeColor.g, activeColor.b)

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar title="labs.zekhoi.dev" />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Color Converter</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed">
            Minimalist conversion utility for HEX, RGB, and HSL. 
            Conceptual monochrome preview for structural visualization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white">Hex Color</label>
                <div className="relative">
                  <input 
                    className="w-full bg-white dark:bg-gray-900 border border-black dark:border-gray-700 p-4 text-xl font-bold focus:ring-0 focus:border-black dark:focus:border-white outline-none placeholder:text-gray-200 text-black dark:text-white" 
                    type="text" 
                    value={hex}
                    onChange={(e) => handleHexChange(e.target.value)}
                    spellCheck={false}
                  />
                  <button 
                    onClick={() => navigator.clipboard.writeText(hex)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    <span className="material-symbols-outlined text-xl">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white">RGB Format</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-white dark:bg-gray-900 border border-black dark:border-gray-700 p-4 text-sm font-bold focus:ring-0 focus:border-black dark:focus:border-white outline-none text-black dark:text-white" 
                      type="text" 
                      value={rgb}
                      onChange={(e) => handleRgbChange(e.target.value)}
                      spellCheck={false}
                    />
                    <button 
                       onClick={() => navigator.clipboard.writeText(rgb)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      <span className="material-symbols-outlined text-xl">content_copy</span>
                    </button>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-gray-500 group-focus-within:text-black dark:group-focus-within:text-white">HSL Format</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-white dark:bg-gray-900 border border-black dark:border-gray-700 p-4 text-sm font-bold focus:ring-0 focus:border-black dark:focus:border-white outline-none text-black dark:text-white" 
                      type="text" 
                      value={hsl}
                      onChange={(e) => handleHslChange(e.target.value)}
                      spellCheck={false}
                    />
                    <button 
                       onClick={() => navigator.clipboard.writeText(hsl)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      <span className="material-symbols-outlined text-xl">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6">Components Breakdown</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-black dark:border-gray-700 p-4 space-y-2">
                  <span className="text-[10px] text-gray-400 uppercase">Red / Hue</span>
                  <div className="text-xl font-bold">{hslValues.h}°</div>
                  <div className="text-xs text-gray-400">R: {activeColor.r}</div>
                </div>
                <div className="border border-black dark:border-gray-700 p-4 space-y-2">
                  <span className="text-[10px] text-gray-400 uppercase">Green / Sat</span>
                  <div className="text-xl font-bold">{hslValues.s}%</div>
                  <div className="text-xs text-gray-400">G: {activeColor.g}</div>
                </div>
                <div className="border border-black dark:border-gray-700 p-4 space-y-2">
                  <span className="text-[10px] text-gray-400 uppercase">Blue / Light</span>
                  <div className="text-xl font-bold">{hslValues.l}%</div>
                  <div className="text-xs text-gray-400">B: {activeColor.b}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-8">
              <div className="fragment-border bg-white dark:bg-black p-2 border border-black dark:border-gray-700">
                <div className="preview-box aspect-square flex flex-col items-center justify-center border border-black dark:border-gray-700" style={{ backgroundColor: hex }}>
                  <div className="absolute inset-0 pattern-dots opacity-10 mix-blend-overlay"></div>
                  
                  {/* Contrast text check */}
                  <div className={cn(
                    "z-10 text-center flex flex-col items-center",
                    contrastWhite > contrastBlack ? "text-white" : "text-black"
                  )}>
                    <div className="text-xs tracking-[0.5em] uppercase opacity-70 mb-2">Preview</div>
                    <div className="text-4xl font-bold uppercase">{hex}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-black dark:border-gray-700 p-4 aspect-video flex flex-col justify-between" style={{ backgroundColor: hex }}>
                  <span className={cn("text-[10px] uppercase tracking-widest opacity-60", contrastWhite > contrastBlack ? "text-white" : "text-black")}>Pattern A</span>
                  <div className="w-full h-8 pattern-grid opacity-20 border-t border-black/20 pt-2 mt-2"></div>
                </div>
                <div className="border border-black dark:border-gray-700 p-4 aspect-video flex flex-col justify-between" style={{ backgroundColor: hex }}>
                  <span className={cn("text-[10px] uppercase tracking-widest opacity-60", contrastWhite > contrastBlack ? "text-white" : "text-black")}>Pattern B</span>
                  <div className="w-full h-8 pattern-dots opacity-20 border-t border-black/20 pt-2 mt-2"></div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border border-black dark:border-gray-700 p-6 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 uppercase">Luminance</span>
                  <span className="font-bold">{(luminance * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-800">
                  <div className="h-full bg-black dark:bg-white" style={{ width: `${luminance * 100}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 uppercase">Contrast (on White)</span>
                  <span className="font-bold">{contrastWhite.toFixed(2)}:1</span>
                </div>
                 <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 uppercase">Contrast (on Black)</span>
                  <span className="font-bold">{contrastBlack.toFixed(2)}:1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
