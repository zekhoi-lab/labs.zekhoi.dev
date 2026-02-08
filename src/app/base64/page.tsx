'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

export default function Base64Converter() {
  const [input, setInput] = useState<string>('Zekhoi Labs')
  const [output, setOutput] = useState<string>('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState<string | null>(null)

  // UTF-8 safe base64 encoding/decoding
  const utf8ToB64 = (str: string) => {
      try {
        return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
        }));
      } catch (e) {
        throw new Error('Encoding failed')
      }
  }

  const b64ToUtf8 = (str: string) => {
      try {
        return decodeURIComponent(window.atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      } catch (e) {
        throw new Error('Invalid Base64 string')
      }
  }

  const handleConvert = () => {
      setError(null)
      try {
          if (mode === 'encode') {
              setOutput(utf8ToB64(input))
          } else {
              setOutput(b64ToUtf8(input))
          }
      } catch (e) {
          setOutput('')
          setError((e as Error).message)
      }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const switchMode = (newMode: 'encode' | 'decode') => {
      setMode(newMode)
      setInput(output) // Swap input/output for convenience
      setOutput('')
      setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar title="labs.zekhoi.dev" icon="terminal" />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Base64 Converter</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Encode and decode Base64 data with UTF-8 support.
            </p>
        </div>

        <div className="max-w-4xl mx-auto">
             <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 border border-black dark:border-white">
                    <button 
                        onClick={() => setMode('encode')}
                        className={cn(
                            "px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all",
                            mode === 'encode' 
                                ? "bg-black dark:bg-white text-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]" 
                                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        )}
                    >
                        Encode
                    </button>
                    <button 
                        onClick={() => setMode('decode')}
                        className={cn(
                            "px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all",
                            mode === 'decode' 
                                ? "bg-black dark:bg-white text-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]" 
                                : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        )}
                    >
                        Decode
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative">
                {/* Connector Arrow for Desktop */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 z-10 bg-white dark:bg-black border border-black dark:border-white items-center justify-center rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                     <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>

                <div className="flex flex-col gap-4">
                     <div className="bg-white dark:bg-black border border-black dark:border-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <div className="border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between items-center">
                            <span>Input</span>
                            <button onClick={() => setInput('')} className="hover:text-black dark:hover:text-white">Clear</button>
                        </div>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full p-4 h-64 resize-none border-none focus:ring-0 font-mono text-sm leading-relaxed bg-transparent text-black dark:text-white placeholder:text-gray-300"
                            placeholder={mode === 'encode' ? "Paste text to encode..." : "Paste Base64 to decode..."}
                        />
                        <div className="border-t border-black dark:border-white bg-gray-50 dark:bg-gray-900 px-4 py-2 text-[10px] uppercase tracking-wider text-gray-500 flex justify-between">
                            <span>{new Blob([input]).size} bytes</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                     <div className="bg-white dark:bg-black border border-black dark:border-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <div className="border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 flex justify-between items-center">
                            <span>Output</span>
                            <button onClick={() => copyToClipboard(output)} className="hover:text-black dark:hover:text-white">Copy</button>
                        </div>
                         
                         {error ? (
                            <div className="w-full h-64 p-4 text-red-600 dark:text-red-400 font-mono text-sm flex items-center justify-center text-center">
                                <div>
                                    <span className="material-symbols-outlined text-4xl mb-2">error</span>
                                    <p>{error}</p>
                                </div>
                            </div>
                         ) : (
                            <textarea 
                                readOnly
                                value={output}
                                className="w-full p-4 h-64 resize-none border-none focus:ring-0 font-mono text-sm leading-relaxed bg-transparent text-black dark:text-white placeholder:text-gray-300"
                                placeholder="Result will appear here..."
                            />
                         )}

                        <div className="border-t border-black dark:border-white bg-gray-50 dark:bg-gray-900 px-4 py-2 text-[10px] uppercase tracking-wider text-gray-500 flex justify-between">
                            <span>{new Blob([output]).size} bytes</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button 
                    onClick={handleConvert}
                    className="bg-black dark:bg-white text-white dark:text-black px-12 py-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all border border-transparent hover:border-black dark:hover:border-white active:translate-y-0 active:shadow-none"
                >
                    Convert
                </button>
            </div>
            
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 border border-black dark:border-white opacity-75">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-gray-500">info</span>
                    <h3 className="font-bold text-sm uppercase tracking-wider">About Base64</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation. 
                    This tool supports UTF-8 encoding so you can safely convert emojis and special characters.
                </p>
            </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
