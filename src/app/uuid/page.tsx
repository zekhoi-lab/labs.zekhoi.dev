'use client'

import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4, v1 as uuidv1, v6 as uuidv6, v7 as uuidv7 } from 'uuid'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

interface HistoryItem {
  id: string
  version: 'v4' | 'v1' | 'v6' | 'v7'
}

export default function UuidGenerator() {
  const [uuid, setUuid] = useState<string>('')
  const [version, setVersion] = useState<'v4' | 'v1' | 'v6' | 'v7'>('v4')
  const [quantity, setQuantity] = useState<number>(1)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [copied, setCopied] = useState(false)

  const generateUuid = useCallback(() => {
    // For single generation (simulated as array of 1 for now based on UI)
    // The UI shows "Quantity" input but the display is single. 
    // Assuming the "Quantity" might produce a list or just be for bulk generation in future.
    // For now, let's just generate one to match the main display.
    // If the user wants bulk, we might need a different UI view or Modal.
    // Current UI design has a large single display. 
    // I will generate one "primary" UUID for the display.
    
    let newUuid = ''
    switch (version) {
        case 'v1': newUuid = uuidv1(); break;
        case 'v4': newUuid = uuidv4(); break;
        case 'v6': newUuid = uuidv6(); break;
        case 'v7': newUuid = uuidv7(); break;
        default: newUuid = uuidv4();
    }
    setUuid(newUuid)
    
    setHistory(prev => {
      // Add to history, keep top 5
      const newItem: HistoryItem = { id: newUuid, version }
      // Filter out duplicates if any (though unlikely for UUIDs)
      const filtered = prev.filter(item => item.id !== newUuid)
      return [newItem, ...filtered].slice(0, 5)
    })
    setCopied(false)
  }, [version])

  // Generate on mount
  useEffect(() => {
    generateUuid()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const getVersionLabel = (v: string) => {
      switch(v) {
          case 'v1': return 'Version 1 (Timestamp)';
          case 'v4': return 'Version 4 (Random)';
          case 'v6': return 'Version 6 (Reordered Time)';
          case 'v7': return 'Version 7 (Unix Epoch)';
          default: return '';
      }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar title="labs.zekhoi.dev" icon="terminal" />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">UUID Generator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Generate cryptographically strong Universally Unique Identifiers (UUIDs).
          </p>
        </div>

        <div className="bg-white dark:bg-black border border-black dark:border-white p-8 md:p-12 mb-12 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => copyToClipboard(uuid)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-black dark:hover:border-white" 
              title="Copy to clipboard"
            >
              <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-8">
            <div className="font-mono text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center break-all select-all">
                {uuid}
            </div>
            <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest">
              {getVersionLabel(version)}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold tracking-wider text-gray-500">Version</label>
              <div className="relative">
                <select 
                  value={version}
                  onChange={(e) => setVersion(e.target.value as any)}
                  className="w-full appearance-none bg-white dark:bg-black border border-black dark:border-white px-4 py-3 pr-8 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer font-mono text-sm"
                >
                  <option value="v4">Version 4 (Random)</option>
                  <option value="v1">Version 1 (Timestamp)</option>
                  <option value="v6">Version 6 (Reordered)</option>
                  <option value="v7">Version 7 (Unix Epoch)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black dark:text-white">
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold tracking-wider text-gray-500">Quantity</label>
              <input 
                type="number" 
                min="1" 
                max="100" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full bg-white dark:bg-black border border-black dark:border-white px-4 py-3 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono text-sm"
              />
            </div>

            <button 
              onClick={generateUuid}
              className="w-full bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 group hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all active:translate-y-0 active:translate-x-0 active:shadow-none"
            >
              <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform duration-500">refresh</span>
              Regenerate
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 border-b border-black dark:border-white pb-2">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">history</span>
              Recent History
            </h3>
            <button 
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-black dark:hover:text-white hover:underline uppercase tracking-wider"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-3 font-mono text-sm text-gray-600 dark:text-gray-400">
            {history.map((item, index) => (
              <li 
                key={item.id + index}
                onClick={() => copyToClipboard(item.id)}
                className="group flex items-center justify-between p-3 bg-white dark:bg-black border border-transparent hover:border-gray-200 dark:hover:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer"
              >
                <span className="opacity-50 group-hover:opacity-100 transition-opacity truncate max-w-[200px] sm:max-w-md">{item.id}</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 text-gray-400 group-hover:text-black dark:group-hover:text-white">
                  {item.version}
                </span>
              </li>
            ))}
            {history.length === 0 && (
                <li className="text-center text-gray-400 italic py-4">No history yet</li>
            )}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}
