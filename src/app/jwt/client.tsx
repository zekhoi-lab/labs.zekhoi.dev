'use client'

import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { GlitchText } from '@/components/glitch-text'

const HMAC_HASHES = new Map([
  ['HS256', 'SHA-256'],
  ['HS384', 'SHA-384'],
  ['HS512', 'SHA-512'],
])

const base64UrlToBytes = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0))
}

export default function JwtDebugger() {
  const [token, setToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  const [secret, setSecret] = useState<string>('')
  const [isSecretBase64, setIsSecretBase64] = useState<boolean>(false)
  const [isValidSignature, setIsValidSignature] = useState<boolean | null>(null)

  // Use useMemo for derived state to avoid setState in useEffect
  const { header, payload } = useMemo(() => {
    if (!token) return { header: null, payload: null }

    try {
        const parts = token.split('.')
        
        const decodePart = (part: string) => {
            try {
                const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload)
            } catch { 
                return null
            }
        }

        return {
            header: parts[0] ? decodePart(parts[0]) : null,
            payload: parts[1] ? decodePart(parts[1]) : null
        }
    } catch { 
        return { header: null, payload: null }
    }
  }, [token])

  const alg = typeof header?.alg === 'string' ? header.alg : 'HS256'
  const hashName = HMAC_HASHES.get(alg)

  // Verify Signature
  useEffect(() => {
    let cancelled = false

    const verify = async () => {
        if (!token || !secret || !hashName) {
            setIsValidSignature(null)
            return
        }

        const parts = token.split('.')
        if (parts.length !== 3) {
            setIsValidSignature(false)
            return
        }

        try {
            const encoder = new TextEncoder()
            const keyData = isSecretBase64 ? base64UrlToBytes(secret) : encoder.encode(secret)

            const key = await window.crypto.subtle.importKey(
                'raw',
                keyData as BufferSource,
                { name: 'HMAC', hash: hashName },
                false,
                ['verify']
            )

            const isValid = await window.crypto.subtle.verify(
                'HMAC',
                key,
                base64UrlToBytes(parts[2]) as BufferSource,
                encoder.encode(`${parts[0]}.${parts[1]}`) as BufferSource
            )

            if (!cancelled) setIsValidSignature(isValid)
        } catch (e) {
            console.error('Verification failed', e)
            if (!cancelled) setIsValidSignature(false)
        }
    }

    verify()
    return () => { cancelled = true }
  }, [token, secret, isSecretBase64, hashName])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        icon="terminal" 
        breadcrumbs={[
            { label: 'JWT Debugger', href: '/jwt' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="JWT Debugger" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            Decode, inspect, and debug JSON Web Tokens (JWTs) in real-time.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-12rem)] min-h-[800px]">
            <div className="flex-1 flex flex-col border border-black dark:border-white bg-white dark:bg-black h-full relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        Encoded
                    </h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigator.clipboard.readText().then(setToken)}
                            className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-1 transition-colors" 
                            title="Paste"
                        >
                            <span className="material-symbols-outlined text-sm">content_paste</span>
                        </button>
                        <button 
                            onClick={() => setToken('')}
                            className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-1 transition-colors" 
                            title="Clear"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 p-0 relative">
                    <textarea 
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full h-full resize-none border-none p-4 font-mono text-sm leading-relaxed focus:ring-0 selection:bg-gray-200 dark:selection:bg-gray-800 bg-transparent text-black dark:text-white"
                        spellCheck={false}
                        placeholder="Paste JWT here..."
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-6 h-full">
                <div className="flex-1 flex flex-col border border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                        <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2 text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined text-sm">code_blocks</span>
                            Header
                        </h2>
                        <span className="text-[10px] text-gray-500 uppercase">Algorithm & Token Type</span>
                    </div>
                    <div className="flex-1 p-4 overflow-auto bg-white dark:bg-black relative">
                        <ColorizedJson data={header} colorClass="text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <div className="flex-[2] flex flex-col border border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                        <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2 text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined text-sm">data_object</span>
                            Payload
                        </h2>
                        <span className="text-[10px] text-gray-500 uppercase">Data</span>
                    </div>
                    <div className="flex-1 p-4 overflow-auto bg-white dark:bg-black relative">
                        <ColorizedJson data={payload} colorClass="text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 flex flex-col border border-black dark:border-white bg-white dark:bg-black h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <h2 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2 text-blue-500 dark:text-blue-400">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Signature
                    </h2>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-6 overflow-auto">
                    <div className="text-sm font-mono space-y-2 text-gray-500">
                        <p className="uppercase text-[10px] tracking-widest text-black dark:text-white mb-2">Algorithm</p>
                        <div className="relative">
                            <select className="w-full bg-white dark:bg-black border border-black dark:border-white px-3 py-2 pr-10 text-sm focus:ring-0 focus:border-black dark:focus:border-white opacity-100 appearance-none cursor-default" disabled>
                                <option>{hashName ? `${alg} (HMAC + ${hashName})` : `${alg} (not supported)`}</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="uppercase text-[10px] tracking-widest text-black dark:text-white mb-2">{hashName ? `HMAC${hashName.replace('-', '')}` : alg}</p>
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 font-mono text-xs break-all text-gray-400 select-all">
                            base64UrlEncode(header) + &quot;.&quot; +<br/>
                            base64UrlEncode(payload),<br/>
                            <span className="text-blue-500 dark:text-blue-400 font-bold">{`your-${hashName ? hashName.slice(4) : '256'}-bit-secret`}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                         <div className="flex justify-between items-end">
                            <p className="uppercase text-[10px] tracking-widest text-black dark:text-white">Secret Key</p>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={isSecretBase64}
                                    onChange={(e) => setIsSecretBase64(e.target.checked)}
                                    className="w-3 h-3 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:ring-black dark:focus:ring-white bg-transparent" 
                                />
                                <span className="text-[10px] uppercase">Base64 Encoded</span>
                            </label>
                        </div>
                        <input 
                            type="text" 
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className="w-full bg-white dark:bg-black border border-black dark:border-white px-3 py-2 text-sm font-mono focus:ring-0 focus:border-black dark:focus:border-white placeholder:text-gray-300" 
                            placeholder="Enter secret to verify..." 
                        />
                    </div>

                    <div className="mt-auto pt-6 border-t border-dashed border-gray-300 dark:border-gray-700">
                        {hashName && isValidSignature === true && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 animate-in slide-in-from-bottom-2">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span className="text-xs font-bold uppercase tracking-wide">Signature Verified</span>
                            </div>
                        )}
                        {hashName && isValidSignature === false && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 animate-in slide-in-from-bottom-2">
                                <span className="material-symbols-outlined text-lg">cancel</span>
                                <span className="text-xs font-bold uppercase tracking-wide">Invalid Signature</span>
                            </div>
                        )}
                        {!hashName && (
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3">
                                <span className="material-symbols-outlined text-lg">block</span>
                                <span className="text-xs font-bold uppercase tracking-wide">{alg} can&apos;t be verified here (HS256/384/512 only)</span>
                            </div>
                        )}
                        {hashName && isValidSignature === null && (
                            <div className="flex items-center gap-2 text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3">
                                <span className="material-symbols-outlined text-lg">info</span>
                                <span className="text-xs font-bold uppercase tracking-wide">Enter secret to verify</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

const JSON_TOKEN = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g

const tokenClass = (token: string, colorClass: string) => {
    if (/^"/.test(token)) {
        return /:$/.test(token) ? 'text-black dark:text-white font-bold' : colorClass
    }
    if (/true|false/.test(token)) return 'text-blue-600 dark:text-blue-400'
    if (/null/.test(token)) return 'text-gray-500'
    if (/^-?\d/.test(token)) return colorClass
    return 'text-black dark:text-white'
}

// Tokens are rendered as React text nodes (never as HTML) because the decoded
// claims come straight from a pasted, untrusted token.
const ColorizedJson = ({ data, colorClass }: { data: object | null, colorClass: string }) => {
    if (!data) return null
    const jsonStr = JSON.stringify(data, null, 2)

    const nodes: React.ReactNode[] = []
    let lastIndex = 0
    for (const match of jsonStr.matchAll(JSON_TOKEN)) {
        const index = match.index ?? 0
        if (index > lastIndex) nodes.push(jsonStr.slice(lastIndex, index))
        nodes.push(<span key={index} className={tokenClass(match[0], colorClass)}>{match[0]}</span>)
        lastIndex = index + match[0].length
    }
    nodes.push(jsonStr.slice(lastIndex))

    return (
        <pre className="text-sm font-mono whitespace-pre-wrap">{nodes}</pre>
    )
}
