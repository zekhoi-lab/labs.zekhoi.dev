'use client'

import { useState, useRef } from 'react'
import { checkInstagram, InstagramCheckResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'
import { useProcessId } from '@/lib/use-process-id'

export default function InstagramChecker() {
    const [input, setInput] = useState('')
    const [proxyInput, setProxyInput] = useState('')
    const [results, setResults] = useState<(InstagramCheckResult & { originalUsername: string, status: 'Active' | 'Not Found' | 'Scanning' | 'Queued' | 'Error' })[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [stats, setStats] = useState({ total: 0, success: 0, error: 0 })
    const [concurrency, setConcurrency] = useState(3)
    const processId = useProcessId('XJ')

    // Line numbers sync
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const lineNumbersRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
        }
    }

    const handleExecute = async () => {
        const usernames = input.split('\n').map(u => u.trim()).filter(u => u)
        const proxies = proxyInput.split('\n').map(p => p.trim()).filter(p => p)
        if (usernames.length === 0) return

        setIsScanning(true)
        setStats({ total: usernames.length, success: 0, error: 0 })

        // Initialize results with queued state
        const initialResults = usernames.map(u => ({
            originalUsername: u,
            success: false,
            status: 'Queued' as const
        }))
        setResults(initialResults)

        let currentIndex = 0
        let proxyIndex = 0

        return new Promise<void>((resolve) => {
            const worker = async () => {
                while (currentIndex < usernames.length) {
                    const index = currentIndex++
                    if (index >= usernames.length) break

                    const username = usernames[index]
                    let result: InstagramCheckResult | null = null
                    let attempts = 0
                    const maxAttempts = 3

                    while (attempts <= maxAttempts) {
                        const currentProxy = proxies.length > 0 ? proxies[proxyIndex++ % proxies.length] : undefined

                        // Update to scanning/retrying
                        setResults(prev => {
                            const next = [...prev]
                            if (next[index]) {
                                next[index] = {
                                    ...next[index],
                                    status: 'Scanning',
                                    message: attempts > 0 ? `Retrying (${attempts}/${maxAttempts})...` : 'Scanning...'
                                }
                            }
                            return next
                        })

                        try {
                            result = await checkInstagram(username, currentProxy)

                            // Break loop if not a 429
                            if (result.httpCode !== 429) break

                            attempts++
                            if (attempts <= maxAttempts) {
                                // Wait before retry (exponential backoff)
                                await new Promise(r => setTimeout(r, 1000 * attempts))
                            }
                        } catch (e: unknown) {
                            console.error("Worker error:", e)
                            break
                        }
                    }

                    if (result) {
                        setResults(prev => {
                            const next = [...prev]
                            if (next[index]) {
                                next[index] = {
                                    ...result!,
                                    originalUsername: username,
                                    status: result!.status || 'Error'
                                }
                            }
                            return next
                        })

                        setStats(prev => ({
                            ...prev,
                            success: prev.success + (result!.status === 'Active' ? 1 : 0),
                            error: prev.error + (result!.status === 'Not Found' || result!.status === 'Error' ? 1 : 0)
                        }))
                    } else {
                        setResults(prev => {
                            const next = [...prev]
                            if (next[index]) next[index] = { ...next[index], status: 'Error', message: 'Scan Failed' }
                            return next
                        })
                        setStats(prev => ({ ...prev, error: prev.error + 1 }))
                    }
                }
            }

            const workers = Array(concurrency).fill(null).map(() => worker())
            Promise.all(workers).then(() => {
                setIsScanning(false)
                resolve()
            })
        })
    }

    const handleExport = (type: 'success' | 'error') => {
        const filteredResults = results.filter(res => {
            if (type === 'success') return res.status === 'Active'
            return res.status === 'Not Found' || res.status === 'Error'
        })

        if (filteredResults.length === 0) return

        const textContent = filteredResults
            .map(res => res.originalUsername)
            .join('\n')

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `instagram_${type}_${new Date().toISOString().split('T')[0]}.txt`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const lineCount = input.split('\n').length
    const lineNumbers = Array.from({ length: Math.max(15, lineCount) }, (_, i) => i + 1).join('\n')

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Instagram Checker"
                description="Checks whether Instagram usernames exist by reading public profile page metadata. Accepts a list, runs in parallel, and can rotate through proxies."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'Instagram Checker' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-black border border-white/20 p-4 h-[350px] flex flex-col relative">
                        <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            Input Payload
                        </div>
                        <div className="flex-1 flex mt-6 font-mono text-sm overflow-hidden relative">
                            <div
                                ref={lineNumbersRef}
                                className="w-8 text-right text-white/30 select-none pr-2 pt-2 leading-6 font-mono border-r border-white/10 h-full bg-black overflow-hidden"
                            >
                                <pre className="text-sm font-mono leading-6">{lineNumbers}</pre>
                            </div>
                            <textarea
                                ref={textareaRef}
                                onScroll={handleScroll}
                                className="flex-1 bg-transparent border-none text-white p-2 focus:ring-0 leading-6 resize-none font-mono placeholder:text-white/20 h-full w-full outline-none scrollbar-thin whitespace-pre"
                                placeholder={`Enter usernames (one per line)\nzekhoi_labs\ndev_null\nroot_access`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black border border-white/20 p-4 h-[200px] flex flex-col relative">
                            <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                Proxy Configuration (Optional)
                            </div>
                            <div className="flex-1 flex mt-6 font-mono text-sm overflow-hidden relative">
                                <textarea
                                    className="flex-1 bg-transparent border-none text-white p-2 focus:ring-0 leading-6 resize-none font-mono placeholder:text-white/20 h-full w-full outline-none scrollbar-thin whitespace-pre"
                                    placeholder={`http://user:pass@host:port\nhttp://host:port\n(One per line)`}
                                    value={proxyInput}
                                    onChange={(e) => setProxyInput(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Concurrency</label>
                                <span className="text-xs font-mono text-white">{concurrency} Threads</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={concurrency}
                                onChange={(e) => setConcurrency(parseInt(e.target.value))}
                                disabled={isScanning}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>

                        <button
                            onClick={handleExecute}
                            disabled={isScanning}
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 border border-white disabled:opacity-50 fragment-card"
                        >
                            <span>[ EXECUTE_SCAN ]</span>
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="flex items-center justify-between border border-white/20 bg-black p-3 mb-4 text-xs font-mono uppercase tracking-wider">
                        <div className="flex gap-4">
                            <span className="text-white">TOTAL: <span className="text-white/60">{stats.total}</span></span>
                            <span className="text-white/20">{'//'}</span>
                            <span className="text-white">SUCCESS: <span className="text-white/60">{stats.success}</span></span>
                            <span className="text-white/20">{'//'}</span>
                            <span className="text-white">ERROR: <span className="text-white/60">{stats.error}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2 mr-4">
                                <button
                                    onClick={() => handleExport('success')}
                                    disabled={stats.success === 0}
                                    className="text-[9px] bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-0.5 border border-green-500/20 transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[10px]">download</span>
                                    <span>EXPORT_SUCCESS</span>
                                </button>
                                <button
                                    onClick={() => handleExport('error')}
                                    disabled={stats.error === 0}
                                    className="text-[9px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-0.5 border border-red-500/20 transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[10px]">download</span>
                                    <span>EXPORT_ERROR</span>
                                </button>
                            </div>
                            <span className={`w-2 h-2 bg-white ${isScanning ? 'animate-pulse' : ''}`}></span>
                            <span>{isScanning ? 'SCANNING' : 'IDLE'}</span>
                        </div>
                    </div>

                    <div className="border border-white/20 bg-black flex-1 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto scrollbar-thin">
                            <div className="min-w-[800px]">
                                <div className="grid grid-cols-12 gap-x-4 border-b border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-white/60">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-6">Username / Full Name</div>
                                    <div className="col-span-2">Visit</div>
                                    <div className="col-span-3 text-right">Status</div>
                                </div>
                                <div className="overflow-y-auto max-h-[calc(100vh-500px)] min-h-[300px] p-0">
                                    {results.map((res, i) => (
                                        <div
                                            key={i}
                                            className={`grid grid-cols-12 gap-x-4 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors ${res.status === 'Queued' ? 'opacity-40' : ''}`}
                                        >
                                            <div className="col-span-1 text-white/40">{(i + 1).toString().padStart(2, '0')}</div>
                                            <div className="col-span-6 min-w-0 flex flex-col overflow-hidden">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className="select-all truncate" title={res.originalUsername}>{res.originalUsername}</span>
                                                    {res.message && <span className="text-[10px] text-white/30 truncate flex-1 min-w-0" title={res.message}>- {res.message}</span>}
                                                </div>
                                                {res.fullName && <span className="text-xs text-white/40 truncate" title={res.fullName}>{res.fullName}</span>}
                                                {(res.ogDescription || res.metaDescription) && (
                                                    <span className="text-[10px] text-white/30 truncate mt-0.5 italic" title={res.ogDescription || res.metaDescription}>
                                                        {res.ogDescription || res.metaDescription}
                                                    </span>
                                                )}
                                                {res.proxyNode && (
                                                    <span className="text-[9px] text-white/30 truncate mt-0.5 font-mono" title={`Proxy Terminal: ${res.proxyNode}`}>
                                                        ROUTE: {res.proxyNode}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-span-2">
                                                <a
                                                    href={`https://www.instagram.com/${res.originalUsername}/`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white px-2 py-1 transition-colors inline-block"
                                                >
                                                    Open
                                                </a>
                                            </div>
                                            <div className={`col-span-3 text-right truncate min-w-0 font-bold ${res.status === 'Active' ? 'text-green-400' :
                                                res.status === 'Not Found' ? 'text-red-400' :
                                                    res.status === 'Scanning' ? 'text-yellow-400' :
                                                        res.status === 'Error' ? 'text-red-500' : 'text-white/40'
                                                }`} title={`Current Status: ${res.status || 'Queued'}`}>
                                                [ {(res.status || 'Queued').toUpperCase().replace(/\s+/g, '_')} ]
                                            </div>
                                        </div>
                                    ))}
                                    {results.length === 0 && (
                                        <div className="p-8 text-center text-white/20 italic">
                                            No targets queued.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-2 border-t border-white/20 bg-white/5 text-[10px] text-white/40 font-mono flex justify-between">
                            <span suppressHydrationWarning>PROCESS_ID: {processId}</span>
                            <span>ROUTE: {proxyInput.trim() ? 'PROXY_ROTATION' : 'DIRECT'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
