'use client'

import { useState, useRef } from 'react'
import { validateProxy, ProxyResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function ProxyValidator() {
    const [input, setInput] = useState('')
    const [validating, setValidating] = useState(false)
    const [results, setResults] = useState<ProxyResult[]>([])
    const [stats, setStats] = useState({ active: 0, dead: 0, total: 0 })
    const [concurrency, setConcurrency] = useState(10)
    const [timeout, setTimeoutVal] = useState(5000)

    // Line numbers sync (Standardized)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const lineNumbersRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
        }
    }

    const handleValidate = async () => {
        const proxies = input.split('\n').map(p => p.trim()).filter(p => p)
        if (proxies.length === 0) return

        setValidating(true)
        setResults([])
        setStats({ active: 0, dead: 0, total: proxies.length })

        // Pre-fill results to maintain order
        setResults(proxies.map(p => ({ proxy: p, status: 'Queued', latency: 0, anonymity: 'Unknown' })))

        let currentIndex = 0
        let isRunning = true

        const worker = async () => {
            while (isRunning && currentIndex < proxies.length) {
                const index = currentIndex++
                if (index >= proxies.length) break

                const proxy = proxies[index]

                // Update status to Checking
                setResults(prev => {
                    const next = [...prev]
                    if (next[index]) {
                        next[index] = { ...next[index], status: 'Checking' }
                    }
                    return next
                })

                try {
                    const result = await validateProxy(proxy, timeout)
                    if (!isRunning) return

                    setResults(prev => {
                        const newResults = [...prev]
                        if (newResults[index]) {
                            newResults[index] = result
                        }
                        return newResults
                    })

                    setStats(prev => ({
                        ...prev,
                        active: prev.active + (result.status === 'Active' ? 1 : 0),
                        dead: prev.dead + (result.status === 'Active' ? 0 : 1)
                    }))
                } catch {
                    setResults(prev => {
                        const next = [...prev]
                        if (next[index]) {
                            next[index] = { ...next[index], status: 'Error' }
                        }
                        return next
                    })
                }
            }
        }

        const workers = Array.from({ length: concurrency }, () => worker())
        await Promise.all(workers)

        isRunning = false
        setValidating(false)
    }

    const handleExport = () => {
        const activeProxies = results
            .filter(r => r.status === 'Active')
            .map(r => r.proxy)
            .join('\n')

        if (!activeProxies) return

        const blob = new Blob([activeProxies], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `active-proxies-${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const lineCount = input.split('\n').length
    const lineNumbers = Array.from({ length: Math.max(15, lineCount) }, (_, i) => i + 1).join('\n')

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Proxy Validator"
                description="High-speed proxy verification engine. Checks anonymity levels, latency, and geolocation. Optimized for bulk list processing with multi-threaded validation."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'Proxy Validator' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-black border border-white/20 p-4 h-[500px] flex flex-col relative">
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
                                placeholder={`192.168.1.1:8080\n10.0.0.1:3128:user:pass`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 mt-2">
                            <span>Format: IP:PORT:USER:PASS</span>
                        </div>
                    </div>

                    <div className="space-y-4">
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
                                onChange={(e) => setConcurrency(Number(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Timeout</label>
                                <span className="text-xs font-mono text-white">{timeout}ms</span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="10000"
                                step="500"
                                value={timeout}
                                onChange={(e) => setTimeoutVal(Number(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                            />
                        </div>

                        <button
                            onClick={handleValidate}
                            disabled={validating}
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 border border-white disabled:opacity-50 fragment-card"
                        >
                            <span>{validating ? '[ VALIDATING... ]' : '[ START VALIDATION ]'}</span>
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="flex items-center justify-between border border-white/20 bg-black p-3 mb-4 text-xs font-mono uppercase tracking-wider">
                        <div className="flex gap-4">
                            <span className="text-white">TOTAL: <span className="text-white/60">{stats.total}</span></span>
                            <span className="text-white/20">{'//'}</span>
                            <span className="text-white">ACTIVE: <span className="text-white/60">{stats.active}</span></span>
                            <span className="text-white/20">{'//'}</span>
                            <span className="text-white">DEAD: <span className="text-white/60">{stats.dead}</span></span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <button onClick={handleExport} className="hover:text-white text-white/40 transition-colors">EXPORT ACTIVE</button>
                            <span className="text-white/20">|</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 bg-white ${validating ? 'animate-pulse' : ''}`}></span>
                                <span>{validating ? 'RUNNING' : 'IDLE'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-white/20 bg-black flex-1 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto scrollbar-thin">
                            <div className="min-w-[1000px]">
                                <div className="grid grid-cols-12 gap-x-4 border-b border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-white/60">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-3">Proxy</div>
                                    <div className="col-span-1">Lat</div>
                                    <div className="col-span-1">Type</div>
                                    <div className="col-span-2">Exit IP</div>
                                    <div className="col-span-2">Loc</div>
                                    <div className="col-span-2 text-right">Status</div>
                                </div>
                                <div className="overflow-y-auto max-h-[calc(100vh-500px)] min-h-[400px] p-0">
                                    {results.map((res, i) => (
                                        <div
                                            key={i}
                                            className={`grid grid-cols-12 gap-x-4 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors ${res.status === 'Queued' ? 'opacity-40' : ''}`}
                                        >
                                            <div className="col-span-1 text-white/40">{(i + 1).toString().padStart(2, '0')}</div>
                                            <div className="col-span-3 truncate px-1 select-all min-w-0" title={res.proxy}>{res.proxy}</div>
                                            <div className="col-span-1 text-xs truncate min-w-0" title={res.latency > 0 ? `${res.latency}ms` : 'Pending'}>{res.latency > 0 ? `${res.latency}ms` : '-'}</div>
                                            <div className="col-span-1 text-xs text-white/60 truncate min-w-0" title={res.anonymity || 'Unknown'}>{res.anonymity || '-'}</div>
                                            <div className="col-span-2 text-xs text-white/60 truncate min-w-0" title={res.ip || '-'}>{res.ip || '-'}</div>
                                            <div className="col-span-2 text-xs text-white/60 truncate min-w-0" title={res.city ? `${res.city}, ${res.country}` : res.country || '-'}>
                                                {res.city && res.country ? `${res.city}, ${res.country}` : (res.country || '-')}
                                            </div>
                                            <div className={`col-span-2 text-right truncate min-w-0 ${res.status === 'Active' ? 'text-green-400' :
                                                res.status === 'Dead' || res.status === 'Connection Failed' ? 'text-red-400' :
                                                    res.status === 'Checking' ? 'text-yellow-400' :
                                                        res.status === 'Error' ? 'text-red-400' : 'text-white/40'
                                                }`} title={`Status: ${res.status || 'Queued'}`}>
                                                [ {(res.status || 'QUEUED').toUpperCase().replace(' ', '_')} ]
                                            </div>
                                        </div>
                                    ))}
                                    {results.length === 0 && (
                                        <div className="p-8 text-center text-white/20 italic">
                                            No proxies queued.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-2 border-t border-white/20 bg-white/5 text-[10px] text-white/40 font-mono flex justify-between">
                            <span>PROCESS_ID: {Math.floor(Math.random() * 9000) + 1000}_PX</span>
                            <span>THREADS: {concurrency}</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
