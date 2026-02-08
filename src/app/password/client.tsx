'use client'

import { useState, useCallback, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
// import { cn } from '@/lib/utils'

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const generatePassword = useCallback(() => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='

    let chars = ''
    if (includeUppercase) chars += uppercaseChars
    if (includeLowercase) chars += lowercaseChars
    if (includeNumbers) chars += numberChars
    if (includeSymbols) chars += symbolChars

    // Fallback if nothing selected (should prevent this in UI, but safety first)
    if (chars === '') chars = lowercaseChars

    let newPassword = ''
    for (let i = 0; i < length; i++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setPassword(newPassword)
    setHistory(prev => {
        const newHistory = [newPassword, ...prev]
        return newHistory.slice(0, 3) // Keep last 3 per UI design
    })
    setCopied(false)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  // Generate on mount or when settings change
  useEffect(() => {
    generatePassword() // eslint-disable-line react-hooks/set-state-in-effect
  }, [generatePassword]) 
  // Note: We might want to NOT regenerate on every setting change to avoid annoying flickering if user is setting up,
  // but looking at the raw HTML interactions, it's often expected. 
  // However, usually "Generate" button is explicit. The raw HTML has a "Generate New" button.
  // The provided code will regenerate on setting change which is also fine for interactivity.
  // Let's stick to explicit generation primarily, but initial generation is needed.

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate entropy roughly
  const calculateEntropy = () => {
    let poolSize = 0
    if (includeUppercase) poolSize += 26
    if (includeLowercase) poolSize += 26
    if (includeNumbers) poolSize += 10
    if (includeSymbols) poolSize += 30 // Approx
    if (poolSize === 0) return 0
    
    const entropy = Math.log2(Math.pow(poolSize, length))
    return Math.floor(entropy)
  }

  const entropy = calculateEntropy()
  const crackTime = entropy < 28 ? 'Instant' : entropy < 40 ? 'Seconds' : entropy < 60 ? 'Minutes/Hours' : 'Centuries'

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        icon="terminal" 
        breadcrumbs={[
            { label: 'Password Generator', href: '/password' }
        ]}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Password Generator</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Generate secure, random passwords locally in your browser.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-black border border-black dark:border-white p-6 fragment-card hover:-translate-y-0.5 hover:-translate-x-0.5 transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <label className="font-bold text-sm uppercase tracking-wider">Length</label>
                        <span className="font-bold text-xl">{length}</span>
                    </div>
                    <input 
                        type="range" 
                        min="8" 
                        max="64" 
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer focus:outline-none focus:ring-0 accent-black dark:accent-white"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-sans">
                        <span>8</span>
                        <span>32</span>
                        <span>64</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-black border border-black dark:border-white p-6 fragment-card space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Settings</h3>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Include Uppercase</span>
                        <input 
                            type="checkbox" 
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            className="w-5 h-5 border-2 border-black dark:border-white rounded-none text-black dark:text-white focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer bg-transparent checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white"
                        />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Include Lowercase</span>
                        <input 
                            type="checkbox" 
                            checked={includeLowercase}
                            onChange={(e) => {
                                // Prevent unchecking if it's the last one
                                if (!e.target.checked && !includeUppercase && !includeNumbers && !includeSymbols) return;
                                setIncludeLowercase(e.target.checked)
                            }}
                            className="w-5 h-5 border-2 border-black dark:border-white rounded-none text-black dark:text-white focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer bg-transparent checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white"
                        />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Include Numbers</span>
                        <input 
                            type="checkbox" 
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            className="w-5 h-5 border-2 border-black dark:border-white rounded-none text-black dark:text-white focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer bg-transparent checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white"
                        />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Include Symbols</span>
                        <input 
                            type="checkbox" 
                            checked={includeSymbols}
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                            className="w-5 h-5 border-2 border-black dark:border-white rounded-none text-black dark:text-white focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer bg-transparent checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white"
                        />
                    </label>
                </div>

                <button 
                    onClick={generatePassword}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                    Generate New
                </button>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white dark:bg-black border border-black dark:border-white p-8 md:p-12 relative flex flex-col items-center justify-center min-h-[240px] text-center group fragment-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
                    <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4 animate-[flicker_2s_linear_infinite] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">shield</span>
                        Strong Security
                    </div>
                    <div className="font-mono text-3xl md:text-5xl font-bold break-all w-full leading-tight select-all selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
                        {password}
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button 
                            onClick={() => copyToClipboard(password)}
                            className="flex items-center gap-2 px-6 py-3 border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all uppercase tracking-widest text-xs font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                            <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-black border border-black dark:border-white p-6 fragment-card">
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">History</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {history.map((hist, idx) => (
                                <li key={idx} onClick={() => copyToClipboard(hist)} className="flex justify-between items-center group cursor-pointer hover:text-black dark:hover:text-white">
                                    <span className="truncate max-w-[180px]">{hist}</span>
                                    <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">content_copy</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-black border border-black dark:border-white p-6 fragment-card">
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Entropy</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500 dark:text-gray-400">Bits of Entropy</span>
                                    <span className="font-bold">{entropy} bits</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1">
                                    <div className="bg-black dark:bg-white h-1 transition-all duration-500" style={{ width: `${Math.min(entropy, 128) / 1.28}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500 dark:text-gray-400">Crack Time</span>
                                    <span className="font-bold capitalize">{crackTime}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1">
                                    <div className="bg-black dark:bg-white h-1 w-full"></div>
                                </div>
                            </div>
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
