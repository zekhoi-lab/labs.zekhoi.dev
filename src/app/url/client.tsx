'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GlitchText } from '@/components/glitch-text'
import { cn } from '@/lib/utils'

export default function UrlParser() {
  const [fullUrl, setFullUrl] = useState('https://api.zekhoi.dev:8080/v1/auth/callback?code=77c92b&state=active#profile')
  const [isValid, setIsValid] = useState(true)

  // Helper to parse URL
  const parse = (input: string) => {
    try {
      const url = new URL(input)
      const params: [string, string][] = []
      url.searchParams.forEach((value, key) => params.push([key, value]))
      return {
        parsed: {
            protocol: url.protocol.replace(':', ''),
            host: url.hostname,
            port: url.port,
            pathname: url.pathname,
            hash: url.hash,
            searchParams: params
        },
        valid: true
      }
    } catch {
      return {
          parsed: {
            protocol: '',
            host: '',
            port: '',
            pathname: '',
            hash: '',
            searchParams: [] as [string, string][]
          },
          valid: false
      }
    }
  }
  
  // Initialize state lazily
  const [parsed, setParsed] = useState(() => parse('https://api.zekhoi.dev:8080/v1/auth/callback?code=77c92b&state=active#profile').parsed)

  const handleFullUrlChange = (val: string) => {
    setFullUrl(val)
    const { parsed: newParsed, valid } = parse(val)
    if (valid) setParsed(newParsed)
    setIsValid(valid)
  }

  /* Removed useEffect to avoid sync state update lint */



  const updateUrlFromParts = (newParts: Partial<typeof parsed>) => {
    try {
      // Construct URL from current parsed state + new parts
      const current = { ...parsed, ...newParts }
      
      // We need to be careful constructing. 
      // If protocol is missing, it crashes URL constructor if we try 'proto://...' manually without care.
      // Safest is to use the last valid URL object if possible, but we don't store it.
      // Let's try to construct string first.
      
      let newUrlStr = `${current.protocol || 'https'}://${current.host}`
      if (current.port) newUrlStr += `:${current.port}`
      newUrlStr += current.pathname
      
      // Params
      if (current.searchParams.length > 0) {
        const sp = new URLSearchParams()
        current.searchParams.forEach(([k, v]) => sp.append(k, v))
        newUrlStr += `?${sp.toString()}`
      }
      
      newUrlStr += current.hash
      
      // Try to validate
      new URL(newUrlStr) // throws if invalid
      
      setFullUrl(newUrlStr)
      setParsed(current)
      setIsValid(true)
    } catch {
      // If construction fails (e.g. empty host), we might just update the parsed state 
      // but mark valid=false? Or just update what we can. 
      // For now, let's update parsed state so inputs don't lag, but fullUrl might be invalid?
      // Actually, if we update parsed state but not fullUrl, they get out of sync.
      // Let's update both, but validation status will be false.
      // We'll update parsed state
      setParsed(prev => ({ ...prev, ...newParts }))
      // We won't update fullUrl if it's fundamentally broken to avoid wiping it? 
      // No, better to try to sync.
    }
  }
  
  const updateParam = (index: number, key: string, value: string) => {
    const newParams = [...parsed.searchParams]
    newParams[index] = [key, value]
    updateUrlFromParts({ searchParams: newParams })
  }

  const addParam = () => {
    const newParams = [...parsed.searchParams, ['', ''] as [string, string]]
    updateUrlFromParts({ searchParams: newParams })
  }

  const removeParam = (index: number) => {
    const newParams = parsed.searchParams.filter((_, i) => i !== index)
    updateUrlFromParts({ searchParams: newParams })
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        breadcrumbs={[
            { label: 'URL Parser', href: '/url' }
        ]}
      />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="URL Parser" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm max-w-xl">
            Input a complex URL to break it down into its constituent parts. Edit any component to rebuild the URL in real-time.
          </p>
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Full URL Input</label>
            <div className="relative">
              <textarea 
                value={fullUrl}
                onChange={(e) => handleFullUrlChange(e.target.value)}
                className={cn(
                  "w-full bg-white dark:bg-gray-900 border p-6 text-lg font-mono focus:ring-0 focus:border-black dark:focus:border-white min-h-[120px] resize-none text-black dark:text-white outline-none",
                  isValid ? "border-black dark:border-gray-700" : "border-red-500"
                )}
                placeholder="https://labs.zekhoi.dev/tools/parser?id=123&auth=true#section-1"
              />
              <div className="absolute right-4 bottom-4 flex gap-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(fullUrl)}
                  className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-transparent transition-colors text-black dark:text-white"
                >
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
                <button 
                  onClick={() => handleFullUrlChange('')}
                  className="p-2 hover:bg-red-500 hover:text-white border border-transparent transition-colors text-black dark:text-white"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Component Breakdown</h2>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest flex items-center gap-1",
                isValid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", isValid ? "bg-green-500" : "bg-red-500")}></span>
                {isValid ? "Valid URL Structure" : "Invalid URL"}
              </span>
            </div>

            <div className="grid grid-cols-1 border border-black dark:border-gray-700 divide-y divide-black dark:divide-gray-700 bg-white dark:bg-black">
              {[
                { label: 'Protocol', key: 'protocol', val: parsed.protocol },
                { label: 'Host', key: 'host', val: parsed.host },
                { label: 'Port', key: 'port', val: parsed.port },
                { label: 'Path', key: 'pathname', val: parsed.pathname },
                { label: 'Hash', key: 'hash', val: parsed.hash },
              ].map((item) => (
                <div key={item.key} className="grid grid-cols-12 items-center">
                  <div className="col-span-3 p-4 bg-gray-50 dark:bg-gray-900 text-[10px] uppercase tracking-widest font-bold border-r border-black dark:border-gray-700 text-black dark:text-white">
                    {item.label}
                  </div>
                  <div className="col-span-9 p-0">
                    <input 
                      className="w-full border-none focus:ring-0 font-mono text-sm px-4 py-3 bg-transparent text-black dark:text-white placeholder:text-gray-400" 
                      type="text" 
                      value={item.val}
                      onChange={(e) => updateUrlFromParts({ [item.key]: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Query Parameters</h2>
              <button 
                onClick={addParam}
                className="text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1 text-black dark:text-white"
              >
                <span className="material-symbols-outlined text-xs">add</span> Add Parameter
              </button>
            </div>
            
            <div className="border border-black dark:border-gray-700 bg-white dark:bg-black overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 border-b border-black dark:border-gray-700">
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold border-r border-black dark:border-gray-700 w-1/3 text-black dark:text-white">Key</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold w-full text-black dark:text-white">Value</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black dark:divide-gray-700">
                  {parsed.searchParams.map((param, index) => (
                    <tr key={index}>
                      <td className="border-r border-black dark:border-gray-700 p-0">
                        <input 
                          className="w-full border-none focus:ring-0 font-mono text-sm px-4 py-3 bg-transparent text-black dark:text-white" 
                          type="text" 
                          value={param[0]}
                          onChange={(e) => updateParam(index, e.target.value, param[1])}
                        />
                      </td>
                      <td className="p-0">
                        <input 
                          className="w-full border-none focus:ring-0 font-mono text-sm px-4 py-3 bg-transparent text-black dark:text-white" 
                          type="text" 
                          value={param[1]}
                          onChange={(e) => updateParam(index, param[0], e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button 
                          onClick={() => removeParam(index)}
                          className="material-symbols-outlined text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                          close
                        </button>
                      </td>
                    </tr>
                  ))}
                  {parsed.searchParams.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-xs text-gray-400 italic">
                        No parameters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
