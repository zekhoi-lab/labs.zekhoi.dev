'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
// import { cn } from '@/lib/utils'

export default function HashGenerator() {
  const [input, setInput] = useState<string>('zekhoi labs')
  const [hashes, setHashes] = useState<{ [key: string]: string }>({
      'SHA-1': '',
      'SHA-256': '',
      'SHA-384': '',
      'SHA-512': '',
  })
  // const [loading, setLoading] = useState(false) // Unused

  useEffect(() => {
    const generateHashes = async () => {
        if (!input) {
            setHashes({
                'SHA-1': '',
                'SHA-256': '',
                'SHA-384': '',
                'SHA-512': ''
            })
            return
        }

        // setLoading(true)
        const encoder = new TextEncoder()
        const data = encoder.encode(input)

        const hashConfig = [
            { name: 'SHA-1', algo: 'SHA-1' },
            { name: 'SHA-256', algo: 'SHA-256' },
            { name: 'SHA-384', algo: 'SHA-384' },
            { name: 'SHA-512', algo: 'SHA-512' }
        ]

        const newHashes: { [key: string]: string } = {}

        for (const config of hashConfig) {
            try {
                const buffer = await window.crypto.subtle.digest(config.algo, data)
                const hashArray = Array.from(new Uint8Array(buffer))
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
                newHashes[config.name] = hashHex
            } catch {
                newHashes[config.name] = 'Error'
            }
        }

        setHashes(newHashes)
        // setLoading(false)
    }

    generateHashes()
  }, [input])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        icon="terminal" 
        breadcrumbs={[
            { label: 'Hash Generator', href: '/hash' }
        ]}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Hash Generator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Generate cryptographic hashes (SHA) securely in your browser.
          </p>
        </div>

        <div className="space-y-8">
            <div className="bg-white dark:bg-black border border-black dark:border-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <div className="border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Input Text
                </div>
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-4 h-32 resize-none border-none focus:ring-0 font-mono text-sm leading-relaxed bg-transparent text-black dark:text-white placeholder:text-gray-300"
                    placeholder="Enter text to hash..."
                />
                <div className="border-t border-black dark:border-white bg-gray-50 dark:bg-gray-900 px-4 py-2 text-[10px] uppercase tracking-wider text-gray-500 flex justify-between">
                    <span>{new Blob([input]).size} bytes</span>
                    <span>{input.length} chars</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(hashes).map(([algo, hash]) => (
                    <div key={algo} className="bg-white dark:bg-black border border-black dark:border-white p-6 fragment-card group">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm uppercase tracking-wider">{algo}</h3>
                            <button 
                                onClick={() => copyToClipboard(hash)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-1 rounded-sm"
                                title="Copy"
                            >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 break-all font-mono text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 group-hover:border-black dark:group-hover:border-white transition-colors">
                            {hash || <span className="text-gray-300 italic">Waiting for input...</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 border border-black dark:border-white opacity-75">
             <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-gray-500">security</span>
                <h3 className="font-bold text-sm uppercase tracking-wider">Security Note</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                All hashing is performed locally using the Web Crypto API. Your data never leaves your browser.
                MD5 is not included as it is considered cryptographically broken and not supported by the standard Web Crypto API.
            </p>
        </div>

      </main>

      <Footer />
    </div>
  )
}
