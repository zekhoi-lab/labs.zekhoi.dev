'use client'

import { useState, useMemo, useRef } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import * as Diff from 'diff'
import { GlitchText } from '@/components/glitch-text'
import { cn } from '@/lib/utils'

export default function DiffViewer() {
  const [original, setOriginal] = useState('function helloWorld() {\n  console.log("Hello, world!");\n  const value = 100;\n  return value;\n}')
  const [modified, setModified] = useState('function helloWorld() {\n  console.log("Hello, Lab!");\n  const val = 150;\n  return val;\n}')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const diffs = useMemo(() => {
    if (!original && !modified) return []
    return Diff.diffLines(original, modified)
  }, [original, modified])

  // Process diffs into side-by-side view
  const { leftLines, rightLines } = useMemo(() => {
    const left: { number: number | null, text: string, type: 'common' | 'removed' | 'empty' }[] = []
    const right: { number: number | null, text: string, type: 'common' | 'added' | 'empty' }[] = []

    let leftCount = 1
    let rightCount = 1

    diffs.forEach(part => {
      // Handling weird split behavior of diffLines which includes newlines
      // Re-split strictly
      const cleanLines = part.value.replace(/\n$/, '').split('\n')
      
      if (part.removed) {
        cleanLines.forEach(line => {
          left.push({ number: leftCount++, text: line, type: 'removed' })
          right.push({ number: null, text: '', type: 'empty' })
        })
      } else if (part.added) {
        cleanLines.forEach(line => {
          left.push({ number: null, text: '', type: 'empty' })
          right.push({ number: rightCount++, text: line, type: 'added' })
        })
      } else {
        cleanLines.forEach(line => {
          left.push({ number: leftCount++, text: line, type: 'common' })
          right.push({ number: rightCount++, text: line, type: 'common' })
        })
      }
    })

    return { leftLines: left, rightLines: right }
  }, [diffs])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      // Just set to modified for now, or intelligent logic?
      // Let's set to modified as that's usually the "new" thing
      setModified(text)
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        breadcrumbs={[
            { label: 'Diff Viewer', href: '/diff' }
        ]}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
              <GlitchText text="Diff Viewer" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs tracking-tight">Compare text or code blocks. Highlighting changes in monochrome shades.</p>
          </div>
          <div className="flex gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
              accept=".txt,.js,.ts,.json,.md,.html,.css"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="fragment-btn bg-white dark:bg-black border border-black dark:border-white px-4 py-2 text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-black dark:text-white"
            >
              <span className="material-symbols-outlined text-sm">upload</span>
              Upload
            </button>
            <button 
              onClick={() => {
                const temp = original
                setOriginal(modified)
                setModified(temp)
              }}
              className="fragment-btn bg-white dark:bg-black border border-black dark:border-white px-4 py-2 text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-black dark:text-white"
            >
              <span className="material-symbols-outlined text-sm">swap_horiz</span>
              Swap
            </button>
            <button 
              onClick={() => {
                setOriginal('')
                setModified('')
              }}
              className="fragment-btn bg-white dark:bg-black border border-black dark:border-white px-4 py-2 text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-black dark:text-white"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black dark:border-white bg-black dark:bg-white">
          <div className="bg-white dark:bg-black p-0 flex flex-col min-h-[500px]">
            <div className="border-b border-black dark:border-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold flex justify-between items-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
              <span>Original Text</span>
              <span className="text-gray-400">Input A</span>
            </div>
            <textarea 
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              className="flex-1 w-full p-6 text-sm resize-none focus:ring-0 border-none outline-none font-mono leading-relaxed bg-transparent text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700" 
              placeholder="Paste original content here..."
            />
          </div>
          <div className="bg-white dark:bg-black p-0 flex flex-col border-l border-black dark:border-white min-h-[500px]">
            <div className="border-b border-black dark:border-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold flex justify-between items-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
              <span>Modified Text</span>
              <span className="text-gray-400">Input B</span>
            </div>
            <textarea 
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              className="flex-1 w-full p-6 text-sm resize-none focus:ring-0 border-none outline-none font-mono leading-relaxed bg-transparent text-black dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700" 
              placeholder="Paste modified content here..."
            />
          </div>
        </div>

        <div className="mt-8 border border-black dark:border-white bg-white dark:bg-black">
          <div className="border-b border-black dark:border-white px-4 py-3 text-[10px] uppercase tracking-widest font-bold bg-black dark:bg-white text-white dark:text-black">
            Comparison Result
          </div>
          <div className="p-6 overflow-x-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm leading-relaxed font-mono">
              <div className="space-y-1">
                {leftLines.map((line, i) => (
                  <div key={i} className={cn("flex gap-4", line.type === 'removed' ? "bg-red-50 dark:bg-red-900/20" : "")}>
                    <span className="text-gray-300 dark:text-gray-600 w-8 select-none text-right">{line.number}</span>
                    <span className={cn(
                      "flex-1 whitespace-pre-wrap break-all",
                      line.type === 'removed' ? "text-red-700 dark:text-red-400" : "text-black dark:text-gray-300"
                    )}>
                      {line.type === 'removed' && '- '}{line.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {rightLines.map((line, i) => (
                  <div key={i} className={cn("flex gap-4", line.type === 'added' ? "bg-green-50 dark:bg-green-900/20" : "")}>
                    <span className="text-gray-300 dark:text-gray-600 w-8 select-none text-right">{line.number}</span>
                    <span className={cn(
                      "flex-1 whitespace-pre-wrap break-all",
                      line.type === 'added' ? "text-green-700 dark:text-green-400" : "text-black dark:text-gray-300"
                    )}>
                      {line.type === 'added' && '+ '}{line.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
