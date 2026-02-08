'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { cn } from '@/lib/utils'
import { GlitchText } from '@/components/glitch-text'
import Link from 'next/link'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
type Tab = 'params' | 'headers' | 'auth' | 'body'

export default function HttpClient() {
  const [method, setMethod] = useState<Method>('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [activeTab, setActiveTab] = useState<Tab>('params')
  const [loading, setLoading] = useState(false)
  
  const [headers, setHeaders] = useState<[string, string][]>([['Content-Type', 'application/json']])
  const [params, setParams] = useState<[string, string][]>([])
  const [body, setBody] = useState('{\n  "key": "value"\n}')
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic'>('none')
  const [authToken, setAuthToken] = useState('')
  const [authBasicUser, setAuthBasicUser] = useState('')
  const [authBasicPass, setAuthBasicPass] = useState('')

  const [response, setResponse] = useState<{
    status: number
    statusText: string
    headers: [string, string][]
    body: string
    time: number
    size: number
  } | null>(null)

  const handleSend = async () => {
    setLoading(true)
    const startTime = performance.now()
    try {
      // Construct URL with params
      const urlObj = new URL(url)
      params.forEach(([k, v]) => {
        if (k) urlObj.searchParams.append(k, v)
      })

      // Construct headers
      const headersObj = new Headers()
      headers.forEach(([k, v]) => {
        if (k) headersObj.append(k, v)
      })

      // Auth
      if (authType === 'bearer' && authToken) {
        headersObj.set('Authorization', `Bearer ${authToken}`)
      } else if (authType === 'basic' && authBasicUser) {
        headersObj.set('Authorization', `Basic ${btoa(`${authBasicUser}:${authBasicPass}`)}`)
      }

      const options: RequestInit = {
        method,
        headers: headersObj,
      }

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = body
      }

      const res = await fetch(urlObj.toString(), options)
      const endTime = performance.now()
      
      const resBody = await res.text()
      const resHeaders: [string, string][] = []
      res.headers.forEach((v, k) => resHeaders.push([k, v]))

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
        body: resBody,
        time: Math.round(endTime - startTime),
        size: new Blob([resBody]).size
      })
    } catch (err) {
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: [],
        body: String(err),
        time: 0,
        size: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const addHeader = () => setHeaders([...headers, ['', '']])
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i))
  const updateHeader = (i: number, k: string, v: string) => {
    const newHeaders = [...headers]
    newHeaders[i] = [k, v]
    setHeaders(newHeaders)
  }
  
  const addParam = () => setParams([...params, ['', '']])
  const removeParam = (i: number) => setParams(params.filter((_, idx) => idx !== i))
  const updateParam = (i: number, k: string, v: string) => {
    const newParams = [...params]
    newParams[i] = [k, v]
    setParams(newParams)
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden">
      <Navbar 
        title="labs.zekhoi.dev" 
        breadcrumbs={[
            { label: 'HTTP Client', href: '/http' }
        ]}
      />
      


      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-6 h-[calc(100vh-100px)]">
        <div className="shrink-0 space-y-4 mb-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
              <GlitchText text="HTTP Client" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Test API endpoints directly from your browser.</p>
        </div>
        {/* Request Bar */}
        <div className="flex flex-col md:flex-row gap-0 border border-black dark:border-white bg-white dark:bg-black shrink-0">
          <div className="md:w-32 border-b md:border-b-0 md:border-r border-black dark:border-white">
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value as Method)}
              className="w-full h-12 bg-transparent border-none text-sm font-bold uppercase tracking-widest px-4 cursor-pointer focus:ring-0 text-black dark:text-white"
            >
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                <option key={m} value={m} className="bg-white dark:bg-black">{m}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 border-b md:border-b-0 md:border-r border-black dark:border-white">
            <input 
              className="w-full h-12 bg-transparent border-none text-sm px-4 placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:ring-0 text-black dark:text-white" 
              placeholder="https://api.example.com/v1/resource" 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={loading}
            className="h-12 px-8 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
            {!loading && <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Left Pane: Request Config */}
          <div className="flex flex-col border border-black dark:border-white bg-white dark:bg-black overflow-hidden">
            <div className="flex border-b border-black dark:border-white overflow-x-auto">
              {(['params', 'headers', 'auth', 'body'] as const).map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-r border-black dark:border-white transition-colors last:border-r-0",
                    activeTab === tab ? "bg-black dark:bg-white text-white dark:text-black" : "hover:bg-gray-50 dark:hover:bg-gray-900 text-black dark:text-white"
                  )}
                 >
                   {tab}
                 </button>
              ))}
            </div>
            
            <div className="flex-1 overflow-auto p-0 relative">
               {/* Params Tab */}
               {activeTab === 'params' && (
                 <div className="p-0">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900">
                          <th className="w-10 p-2 border-r border-black dark:border-white"></th>
                          <th className="p-2 text-left border-r border-black dark:border-white font-normal uppercase tracking-tighter opacity-50 text-black dark:text-white">Key</th>
                          <th className="p-2 text-left font-normal uppercase tracking-tighter opacity-50 text-black dark:text-white">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {params.map((header, i) => (
                           <tr key={i} className="border-b border-black dark:border-white last:border-b-0">
                             <td className="p-2 border-r border-black dark:border-white text-center">
                               <button onClick={() => removeParam(i)} className="text-red-500 hover:text-red-700 material-symbols-outlined text-sm">delete</button>
                             </td>
                             <td className="p-0 border-r border-black dark:border-white">
                               <input className="w-full p-2 border-none bg-transparent focus:ring-0 text-black dark:text-white" placeholder="Key" value={header[0]} onChange={e => updateParam(i, e.target.value, header[1])} />
                             </td>
                             <td className="p-0">
                               <input className="w-full p-2 border-none bg-transparent focus:ring-0 text-black dark:text-white" placeholder="Value" value={header[1]} onChange={e => updateParam(i, header[0], e.target.value)} />
                             </td>
                           </tr>
                        ))}
                         <tr>
                          <td colSpan={3} className="p-2 text-center">
                            <button onClick={addParam} className="text-[10px] uppercase font-bold hover:underline text-black dark:text-white">+ Add Param</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
               )}

              {/* Headers Tab */}
              {activeTab === 'headers' && (
                 <div className="p-0">
                    <table className="w-full border-collapse text-xs">
                       <thead>
                        <tr className="border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900">
                          <th className="w-10 p-2 border-r border-black dark:border-white"></th>
                          <th className="p-2 text-left border-r border-black dark:border-white font-normal uppercase tracking-tighter opacity-50 text-black dark:text-white">Key</th>
                          <th className="p-2 text-left font-normal uppercase tracking-tighter opacity-50 text-black dark:text-white">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {headers.map((header, i) => (
                           <tr key={i} className="border-b border-black dark:border-white last:border-b-0">
                             <td className="p-2 border-r border-black dark:border-white text-center">
                               <button onClick={() => removeHeader(i)} className="text-red-500 hover:text-red-700 material-symbols-outlined text-sm">delete</button>
                             </td>
                             <td className="p-0 border-r border-black dark:border-white">
                               <input className="w-full p-2 border-none bg-transparent focus:ring-0 text-black dark:text-white" placeholder="Key" value={header[0]} onChange={e => updateHeader(i, e.target.value, header[1])} />
                             </td>
                             <td className="p-0">
                               <input className="w-full p-2 border-none bg-transparent focus:ring-0 text-black dark:text-white" placeholder="Value" value={header[1]} onChange={e => updateHeader(i, header[0], e.target.value)} />
                             </td>
                           </tr>
                        ))}
                         <tr>
                          <td colSpan={3} className="p-2 text-center">
                            <button onClick={addHeader} className="text-[10px] uppercase font-bold hover:underline text-black dark:text-white">+ Add Header</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
              )}

              {/* Body Tab */}
              {activeTab === 'body' && (
                <textarea 
                  className="w-full h-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-xs leading-relaxed text-black dark:text-white"
                  placeholder="Request body (JSON)"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  spellCheck={false}
                />
              )}
              
               {/* Auth Tab */}
               {activeTab === 'auth' && (
                 <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Auth Type</label>
                      <select 
                        value={authType} 
                        onChange={e => {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setAuthType(e.target.value as any)
                        }}
                        className="w-full border border-black dark:border-white bg-transparent p-2 text-sm text-black dark:text-white"
                      >
                        <option value="none">None</option>
                        <option value="bearer">Bearer Token</option>
                        <option value="basic">Basic Auth</option>
                      </select>
                    </div>
                    
                    {authType === 'bearer' && (
                       <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Token</label>
                        <input 
                           type="text" 
                           value={authToken} 
                           onChange={e => setAuthToken(e.target.value)}
                           className="w-full border border-black dark:border-white bg-transparent p-2 text-sm text-black dark:text-white" 
                           placeholder="ey..."
                        />
                      </div>
                    )}
                    
                     {authType === 'basic' && (
                       <div className="space-y-2">
                        <input 
                           type="text" 
                           value={authBasicUser} 
                           onChange={e => setAuthBasicUser(e.target.value)}
                           className="w-full border border-black dark:border-white bg-transparent p-2 text-sm text-black dark:text-white mb-2" 
                           placeholder="Username"
                        />
                        <input 
                           type="password" 
                           value={authBasicPass} 
                           onChange={e => setAuthBasicPass(e.target.value)}
                           className="w-full border border-black dark:border-white bg-transparent p-2 text-sm text-black dark:text-white" 
                           placeholder="Password"
                        />
                      </div>
                    )}
                 </div>
               )}
            </div>
          </div>

          {/* Right Pane: Response */}
          <div className="flex flex-col border border-black dark:border-white bg-white dark:bg-black overflow-hidden">
            <div className="flex items-center justify-between border-b border-black dark:border-white px-4 bg-gray-50 dark:bg-gray-900 h-10 shrink-0">
               <div className="flex gap-4">
                 <span className="text-[10px] uppercase font-bold tracking-widest text-black dark:text-white">Response</span>
               </div>
               {response && (
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="opacity-40">Status:</span>
                      <span className={cn(
                        response.status >= 200 && response.status < 300 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>{response.status} {response.statusText}</span>
                    </div>
                    {!(response.status >= 200 && response.status < 300) && (
                      <div className="text-red-600 dark:text-red-400 font-mono text-sm">

                        {(response.body as unknown as Record<string, unknown>).title as string || (response.body as unknown as Record<string, unknown>).message as string || 'Request failed'}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="opacity-40">Time:</span>
                      <span>{response.time}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="opacity-40">Size:</span>
                      <span>{(response.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
               )}
            </div>
            
             <div className="flex-1 overflow-auto p-6 bg-white dark:bg-black">
               {response ? (
                 <pre className="text-xs leading-relaxed whitespace-pre-wrap text-black dark:text-gray-300 font-mono">
                    {/* Basic syntax highlighting simulation or just text */}
                    {JSON.stringify(tryParseJson(response.body), null, 2) || response.body}
                 </pre>
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-400 text-xs uppercase tracking-widest">
                   No Request Sent
                 </div>
               )}
             </div>

             {response && (
               <div className="border-t border-black dark:border-white bg-gray-50 dark:bg-gray-900 px-4 py-2 flex justify-between items-center shrink-0">
                 <span className="text-[9px] uppercase tracking-widest opacity-40 text-black dark:text-white">JSON Rendered</span>
                 <button 
                  onClick={() => navigator.clipboard.writeText(response.body)}
                  className="text-[9px] uppercase tracking-widest font-bold hover:underline text-black dark:text-white">
                    Copy Response
                 </button>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  )
}

function tryParseJson(str: string) {
  try { return JSON.parse(str) } catch { return null }
}
