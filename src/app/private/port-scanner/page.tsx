'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'
import { useState, useRef, useEffect } from 'react'
import { scanPort, PortScanResult } from '../actions'

export default function PortScanner() {
    const [target, setTarget] = useState('')
    const [range, setRange] = useState('1-100')
    const [scanning, setScanning] = useState(false)
    const [results, setResults] = useState<PortScanResult[]>([])
    const [logs, setLogs] = useState<string[]>([])
    const [progress, setProgress] = useState({ current: 0, total: 0 })
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
    }

    const handleScan = async () => {
        if (!target || !range) return
        setScanning(true)
        setResults([])
        setLogs([])
        addLog(`Initializing scan for target: ${target}`)

        const [start, end] = range.split('-').map(Number)
        if (isNaN(start) || isNaN(end) || start > end) {
            addLog('Error: Invalid port range')
            setScanning(false)
            return
        }

        const totalPorts = end - start + 1
        setProgress({ current: 0, total: totalPorts })
        addLog(`Scanning ${totalPorts} ports...`)

        const batchSize = 10
        for (let i = start; i <= end; i += batchSize) {
            const batch = []
            for (let j = 0; j < batchSize && i + j <= end; j++) {
                batch.push(i + j)
            }

            const promises = batch.map(port => scanPort(target, port))
            const batchResults = await Promise.all(promises)

            batchResults.forEach(res => {
                if (res.status === 'open') {
                    setResults(prev => [...prev, res])
                    addLog(`Port ${res.port} OPEN (${res.service})`)
                }
            })
            setProgress(prev => ({ ...prev, current: Math.min(prev.current + batchSize, totalPorts) }))
        }

        addLog('Scan complete.')
        setScanning(false)
    }

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Port Scanner"
                description="Internal network analysis utility. High-performance multi-threaded scanning module with service version detection and state validation. Restricted access authorized only."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'Port Scanner' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Input Container styled like Instagram Payload */}
                    <div className="bg-black border border-white/20 p-4 h-[500px] flex flex-col relative">
                        <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            Configuration
                        </div>
                        <div className="flex-1 flex flex-col gap-6 mt-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Target Host</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:ring-0 px-4 py-3 text-sm text-white placeholder:text-white/20 font-mono outline-none"
                                    placeholder="scanme.nmap.org"
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Port Range</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:ring-0 px-4 py-3 text-sm text-white placeholder:text-white/20 font-mono outline-none"
                                    placeholder="1-100"
                                    type="text"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                />
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-auto">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            className="rounded-none bg-black border-white/20 text-white focus:ring-0 focus:ring-offset-0"
                                            type="checkbox"
                                        />
                                        <span className="text-xs text-white/60 group-hover:text-white transition-colors">Service Version Detection</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            className="rounded-none bg-black border-white/20 text-white focus:ring-0 focus:ring-offset-0"
                                            type="checkbox" defaultChecked
                                        />
                                        <span className="text-xs text-white/60 group-hover:text-white transition-colors">OS Fingerprinting</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleScan}
                        disabled={scanning}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 border border-white disabled:opacity-50 fragment-card"
                    >
                        <span>{scanning ? '[ SCANNING... ]' : '[ EXECUTE SCAN ]'}</span>
                        <span className="material-symbols-outlined text-sm">radar</span>
                    </button>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="flex items-center justify-between border border-white/20 bg-black p-3 mb-4 text-xs font-mono uppercase tracking-wider">
                        <div className="flex gap-4">
                            <span className="text-white">PORTS: <span className="text-white/60">{progress.total}</span></span>
                            <span className="text-white/20">{'//'}</span>
                            <span className="text-white">OPEN: <span className="text-white/60">{results.length}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 bg-white ${scanning ? 'animate-pulse' : ''}`}></span>
                                <span>{scanning ? `SCANNING (${Math.round(progress.total ? (progress.current / progress.total) * 100 : 0)}%)` : 'IDLE'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-white/20 bg-black flex-1 overflow-hidden flex flex-col min-h-[400px]">
                        <div className="overflow-x-auto scrollbar-thin">
                            <div className="min-w-[700px]">
                                <div className="grid grid-cols-12 gap-x-4 border-b border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-white/60">
                                    <div className="col-span-2">Port</div>
                                    <div className="col-span-7">Service</div>
                                    <div className="col-span-3 text-right">State</div>
                                </div>
                                <div className="overflow-y-auto max-h-[400px] min-h-[300px] p-0 scrollbar-thin">
                                    {results.map((res, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-12 gap-x-4 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors"
                                        >
                                            <div className="col-span-2 text-white/80 truncate min-w-0" title={`Port: ${res.port}`}>{res.port}</div>
                                            <div className="col-span-7 text-white/60 truncate px-1 min-w-0" title={res.service}>{res.service}</div>
                                            <div className="col-span-3 text-right text-green-400 font-bold uppercase tracking-tighter truncate min-w-0" title="State: OPEN">
                                                [ OPEN ]
                                            </div>
                                        </div>
                                    ))}
                                    {results.length === 0 && (
                                        <div className="p-8 text-center text-white/20 italic">
                                            {scanning ? 'Scanning ports...' : 'No open ports found or waiting to start.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Terminal styled as footer log */}
                    <div className="border border-white/20 bg-black mt-4 h-48 flex flex-col">
                        <div className="bg-white/5 px-4 py-2 text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10">
                            Scan Log
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-white/60 space-y-1 scrollbar-thin" ref={scrollRef}>
                            {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                            {scanning && <div className="text-white">_</div>}
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
