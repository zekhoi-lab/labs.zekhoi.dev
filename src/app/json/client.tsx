'use client'

import { useState, useRef } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
// import { cn } from '@/lib/utils'

import { GlitchText } from '@/components/glitch-text'

export default function JsonFormatter() {
  const [input, setInput] = useState<string>('{"name":"zekhoi labs","type":"Developer Tools","features":["UUID","JSON","JWT"],"active":true,"version":1.0}')
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [indent, setIndent] = useState<number>(2)
  const [mode, setMode] = useState<'format' | 'minify'>('format')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const processJson = (jsonString: string, indentSize: number, currentMode: 'format' | 'minify') => {
      try {
          if (!jsonString.trim()) {
              setOutput('')
              setError(null)
              return
          }

          const parsed = JSON.parse(jsonString)
          if (currentMode === 'minify') {
              setOutput(JSON.stringify(parsed))
          } else {
              setOutput(JSON.stringify(parsed, null, indentSize))
          }
          setError(null)
      } catch (e) {
          setError((e as Error).message)
          // We don't clear output on error to allow user to see what they had before or maybe keep previous valid?
          // Actually clearing output typically confusing. 
          // But strict formatter usually shows empty or error.
          // Let's leave output as is or maybe clear it? 
          // If input is invalid, output is invalid.
          // Let's keep output but maybe show error prominently.
          // Or better, don't update output if invalid?
          // If we don't update output, user might think it worked.
          // Let's blank output on error so they know it failed.
          setOutput('') 
      }
  }

  // Trigger processing whenever input or settings change
  // BUT we don't want to trigger on every keystroke if it's invalid JSON, 
  // that would flash error constantly.
  // Standard formatters often have a "Format" button or debounce.
  // The raw HTML UI has "Format" and "Minify" buttons.
  // So we should NOT auto-format on type, but manual trigger?
  // UseEffect would be auto.
  // Let's stick to manual buttons as per "ACTIONS" section in UI.
  
  const handleFormat = () => {
      setMode('format')
      processJson(input, indent, 'format')
  }

  const handleMinify = () => {
      setMode('minify')
      processJson(input, indent, 'minify')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
          const content = event.target?.result as string
          setInput(content)
          // Auto formatting on upload is a nice touch
          processJson(content, indent, mode) 
      }
      reader.readAsText(file)
  }

  const handleCopy = () => {
      navigator.clipboard.writeText(output)
  }
  
  const handleDownload = () => {
        if (!output) return
        const blob = new Blob([output], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'formatted.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        icon="terminal" 
        breadcrumbs={[
            { label: 'JSON Formatter', href: '/json' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="JSON Formatter" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            Validate, format, and minify JSON data with instant error highlighting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[calc(100vh-12rem)] min-h-[600px]">
            {/* Input Section */}
            <div className="flex flex-col border border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">input</span>
                        Input JSON
                    </h2>
                    <div className="flex gap-2">
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept=".json,application/json"
                            onChange={handleFileUpload}
                         />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-1 transition-colors" 
                            title="Upload File"
                        >
                            <span className="material-symbols-outlined text-sm">upload_file</span>
                        </button>
                        <button 
                            onClick={() => setInput('')}
                            className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-1 transition-colors" 
                            title="Clear"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                </div>
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-4 resize-none border-none focus:ring-0 font-mono text-xs md:text-sm leading-relaxed bg-transparent text-black dark:text-white placeholder:text-gray-300"
                    placeholder="Paste your JSON here..."
                    spellCheck={false}
                />
                <div className="p-2 border-t border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-[10px] text-gray-500 flex justify-between">
                   <span>{new Blob([input]).size} bytes</span>
                   <span>Lines: {input.split('\n').length}</span>
                </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col border border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">output</span>
                        Output JSON
                    </h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCopy}
                            className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-1 transition-colors" 
                            title="Copy"
                        >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-1 transition-colors" 
                            title="Download"
                        >
                            <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                    </div>
                </div>
                
                {error ? (
                    <div className="flex-1 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-mono text-sm">
                        <div className="flex items-center gap-2 font-bold mb-2">
                            <span className="material-symbols-outlined">error</span>
                            Invalid JSON
                        </div>
                        {error}
                    </div>
                ) : (
                    <textarea 
                        readOnly
                        value={output}
                        className="flex-1 p-4 resize-none border-none focus:ring-0 font-mono text-xs md:text-sm leading-relaxed bg-transparent text-black dark:text-white"
                        placeholder="Formatted output will appear here..."
                        spellCheck={false}
                    />
                )}
                
                <div className="p-2 border-t border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-[10px] text-gray-500 flex justify-between">
                   <span>{new Blob([output]).size} bytes</span>
                   <span>Lines: {output.split('\n').length}</span>
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="mt-8 border border-black dark:border-white bg-white dark:bg-black p-4 flex flex-col md:flex-row gap-6 items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Indent:</span>
                <div className="relative w-full md:w-auto">
                    <select 
                        value={indent}
                        onChange={(e) => setIndent(parseInt(e.target.value))}
                        className="appearance-none bg-gray-50 dark:bg-gray-900 border border-black dark:border-white px-3 py-1.5 pr-10 text-sm focus:ring-0 focus:border-black dark:focus:border-white cursor-pointer w-full md:w-40"
                    >
                        <option value={2}>2 Spaces</option>
                        <option value={4}>4 Spaces</option>
                        <option value={8}>8 Spaces</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black dark:text-white">
                        <span className="material-symbols-outlined text-sm">expand_more</span>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
                <button 
                    onClick={handleMinify}
                    className="flex-1 md:flex-none px-6 py-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">compress</span>
                    Minify
                </button>
                <button 
                    onClick={handleFormat}
                    className="flex-1 md:flex-none px-6 py-2 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                >
                    <span className="material-symbols-outlined text-lg">format_align_left</span>
                    Format
                </button>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
