'use client'

import { useState, useRef } from 'react'
import { checkInstagram, InstagramCheckResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function InstagramChecker() {
    const [input, setInput] = useState('')
    const [results, setResults] = useState<(InstagramCheckResult & { originalUsername: string, status: 'Active' | 'Not Found' | 'Scanning' | 'Queued' | 'Error' })[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [stats, setStats] = useState({ total: 0, success: 0, error: 0 })
    const [concurrency, setConcurrency] = useState(3)

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

        return new Promise<void>((resolve) => {
            const worker = async () => {
                while (currentIndex < usernames.length) {
                    const index = currentIndex++
                    if (index >= usernames.length) break

                    const username = usernames[index]

                    // Update to scanning
                    setResults(prev => {
                        const next = [...prev]
                        if (next[index]) next[index] = { ...next[index], status: 'Scanning' }
                        return next
                    })

                    try {
                        const result = await checkInstagram(username)

                        setResults(prev => {
                            const next = [...prev]
                            if (next[index]) {
                                next[index] = {
                                    ...result,
                                    originalUsername: username,
                                    // Use 'status' directly from result, fallback to 'Error' if undefined
                                    status: result.status || 'Error'
                                }
                            }
                            return next
                        })

                        setStats(prev => ({
                            ...prev,
                            success: prev.success + (result.status === 'Active' ? 1 : 0),
                            error: prev.error + (result.status === 'Not Found' ? 1 : 0)
                        }))

                    } catch {
                        setResults(prev => {
                            const next = [...prev]
                            if (next[index]) next[index] = { ...next[index], status: 'Error', error: 'Scan Failed' }
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

    const lineCount = input.split('\n').length
    const lineNumbers = Array.from({ length: Math.max(15, lineCount) }, (_, i) => i + 1).join('\n')

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Instagram Checker"
                description="Profile analytics and availability verification. Retrieves public metadata, engagement metrics, and account status from the Instagram graph."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'Instagram Checker' }
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
                                placeholder={`Enter usernames (one per line)\nzekhoi_labs\ndev_null\nroot_access`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            ></textarea>
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
                            <span className={`w-2 h-2 bg-white ${isScanning ? 'animate-pulse' : ''}`}></span>
                            <span>{isScanning ? 'SCANNING' : 'IDLE'}</span>
                        </div>
                    </div>

                    <div className="border border-white/20 bg-black flex-1 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto scrollbar-thin">
                            <div className="min-w-[800px]">
                                <div className="grid grid-cols-12 gap-x-4 border-b border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-white/60">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-2">Code</div>
                                    <div className="col-span-6">Username / Full Name</div>
                                    <div className="col-span-3 text-right">Status</div>
                                </div>
                                <div className="overflow-y-auto max-h-[calc(100vh-500px)] min-h-[300px] p-0">
                                    {results.map((res, i) => (
                                        <div
                                            key={i}
                                            className={`grid grid-cols-12 gap-x-4 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors ${res.status === 'Queued' ? 'opacity-40' : ''}`}
                                        >
                                            <div className="col-span-1 text-white/40">{(i + 1).toString().padStart(2, '0')}</div>
                                            <div className={`col-span-2 min-w-0 ${res.httpCode === 200 ? 'text-green-500' :
                                                res.httpCode === 404 ? 'text-red-500' :
                                                    res.httpCode ? 'text-yellow-500' : 'text-white/20'
                                                }`} title={res.httpCode ? `HTTP Status: ${res.httpCode}` : ''}>
                                                {res.httpCode ? `[ ${res.httpCode} ]` : '---'}
                                            </div>
                                            <div className="col-span-6 min-w-0 flex flex-col overflow-hidden">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className="select-all truncate" title={res.originalUsername}>{res.originalUsername}</span>
                                                    {res.message && <span className="text-[10px] text-white/30 truncate flex-1 min-w-0" title={res.message}>- {res.message}</span>}
                                                </div>
                                                {res.fullName && <span className="text-xs text-white/40 truncate" title={res.fullName}>{res.fullName}</span>}
                                                {res.followers !== undefined && (
                                                    <span className="text-[10px] text-white/20 mt-0.5 truncate" title={`${res.followers} followers, ${res.posts} posts`}>
                                                        {res.followers} followers • {res.posts} posts {res.isVerified ? '• Verified' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`col-span-3 text-right truncate min-w-0 ${res.status === 'Active' ? 'text-green-400' :
                                                res.status === 'Not Found' ? 'text-red-400' :
                                                    res.status === 'Scanning' ? 'text-yellow-400' :
                                                        res.status === 'Error' ? 'text-red-500' : 'text-white/40'
                                                }`} title={`Current Status: ${res.status || 'Queued'}`}>
                                                [ {(res.status || 'QUEUED').toUpperCase().replace(' ', '_')} ]
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
                            <span>PROCESS_ID: {Math.floor(Math.random() * 9000) + 1000}_XJ</span>
                            <span>SERVER_PROXY_EXECUTION</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
