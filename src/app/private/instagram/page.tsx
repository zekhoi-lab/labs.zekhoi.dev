'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { checkInstagram, InstagramCheckResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function InstagramChecker() {
    const [input, setInput] = useState('')
    const [proxyInput, setProxyInput] = useState('')
    const [results, setResults] = useState<(InstagramCheckResult & { originalUsername: string, status: 'Active' | 'Not Found' | 'Scanning' | 'Queued' | 'Error' })[]>([])
    const [isScanning, setIsScanning] = useState(false)
    const [stats, setStats] = useState({ total: 0, success: 0, error: 0 })
    const [concurrency, setConcurrency] = useState(3)
    const [processId, setProcessId] = useState('')
    const [fetchMode, setFetchMode] = useState<'client' | 'server'>('server')

    useEffect(() => {
        setProcessId(`${Math.floor(Math.random() * 9000) + 1000}_XJ`)
    }, [])

    // Line numbers sync
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const lineNumbersRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
        }
    }

    function formatStat(num: number): string {
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
        return num.toString()
    }

    const checkInstagramClient = async (username: string): Promise<InstagramCheckResult> => {
        try {
            const apiUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`
            const apiResponse = await axios.get(apiUrl, {
                headers: {
                    'x-ig-app-id': '936619743392459',
                    'Accept': '*/*',
                    'x-requested-with': 'XMLHttpRequest'
                },
                timeout: 10000,
                validateStatus: (status) => status < 500
            })

            const httpCode = apiResponse.status
            const data = apiResponse.data

            if (data?.data?.user) {
                const user = data.data.user
                const followers = user.edge_followed_by.count
                const following = user.edge_follow.count
                const posts = user.edge_owner_to_timeline_media.count

                return {
                    success: true,
                    username,
                    isSuspended: false,
                    status: 'Active',
                    httpCode,
                    message: "Success (API Client)",
                    fullName: user.full_name,
                    biography: user.biography,
                    followers,
                    following,
                    posts,
                    isPrivate: user.is_private,
                    isVerified: user.is_verified,
                    profilePicUrl: user.profile_pic_url,
                    ogTitle: `${user.full_name} (@${user.username}) • Instagram photos and videos`,
                    ogDescription: `${formatStat(followers)} Followers, ${formatStat(following)} Following, ${formatStat(posts)} Posts - See Instagram photos and videos from ${user.full_name} (@${user.username})`
                }
            }

            return {
                success: true,
                username,
                isSuspended: httpCode === 404,
                status: httpCode === 404 ? 'Not Found' : 'Error',
                httpCode,
                message: httpCode === 404 ? '404: Not Found' : 'API Structure Mismatch'
            }
        } catch (e: any) {
            return {
                success: true,
                username,
                status: 'Error',
                httpCode: 0,
                message: 'Fetch Failed (Likely CORS) - Use Server Mode instead'
            }
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
                    const proxy = proxies.length > 0 ? proxies[proxyIndex++ % proxies.length] : undefined

                    // Update to scanning
                    setResults(prev => {
                        const next = [...prev]
                        if (next[index]) next[index] = { ...next[index], status: 'Scanning' }
                        return next
                    })

                    try {
                        const result = fetchMode === 'server'
                            ? await checkInstagram(username, proxy)
                            : await checkInstagramClient(username)

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
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/60">Fetch Mode</label>
                            <div className="grid grid-cols-2 border border-white/20 p-1">
                                <button
                                    onClick={() => setFetchMode('client')}
                                    className={`py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${fetchMode === 'client' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Client
                                </button>
                                <button
                                    onClick={() => setFetchMode('server')}
                                    className={`py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${fetchMode === 'server' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Server
                                </button>
                            </div>
                        </div>

                        {fetchMode === 'server' && (
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
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Concurrency</label>
                                <span className="text-xs font-mono text-white">{fetchMode === 'client' ? 'Sequential' : `${concurrency} Threads`}</span>
                            </div>
                            {fetchMode === 'server' ? (
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={concurrency}
                                    onChange={(e) => setConcurrency(parseInt(e.target.value))}
                                    disabled={isScanning}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                />
                            ) : (
                                <div className="text-[10px] text-white/30 italic">Client-side fetch is restricted to sequential to avoid IP rate limits.</div>
                            )}
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
                                                {res.proxyNode && (
                                                    <span className="text-[9px] text-white/30 truncate mt-0.5 font-mono" title={`Proxy Terminal: ${res.proxyNode}`}>
                                                        ROUTE: {res.proxyNode}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`col-span-3 text-right truncate min-w-0 ${res.status === 'Active' ? 'text-green-400' :
                                                res.status === 'Not Found' ? 'text-red-400' :
                                                    res.status === 'Scanning' ? 'text-yellow-400' :
                                                        res.status === 'Error' ? 'text-red-500' : 'text-white/40'
                                                }`} title={`Current Status: ${res.status || 'Queued'}`}>
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
                            <span>ACTIVE_FETCH_MODE: {fetchMode.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
