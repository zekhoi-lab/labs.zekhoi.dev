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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-black border border-white/20 p-6 space-y-6 fragment-card">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Target IP / Hostname</label>
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-2.5 text-sm text-white placeholder:text-white/20 font-mono transition-colors outline-none"
                                    placeholder="scanme.nmap.org"
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Port Range</label>
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-2.5 text-sm text-white placeholder:text-white/20 font-mono transition-colors outline-none"
                                    placeholder="1-100"
                                    type="text"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
                                <span>Options</span>
                            </div>
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
                        <button
                            onClick={handleScan}
                            disabled={scanning}
                            className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white border border-white transition-all disabled:opacity-50"
                        >
                            {scanning ? 'Scanning...' : 'Initialize Scan'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-white/20 p-4 text-center bg-black">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Threads</p>
                            <p className="text-xl font-bold tracking-tighter">10/BATCH</p>
                        </div>
                        <div className="border border-white/20 p-4 text-center bg-black">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Status</p>
                            <p className={`text-xl font-bold tracking-tighter ${scanning ? 'text-green-500 animate-pulse' : 'text-white/60'}`}>
                                {scanning ? 'ACTIVE' : 'IDLE'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="border border-white/20 bg-black flex flex-col h-64">
                        <div className="border-b border-white/20 px-4 py-2 flex items-center justify-between bg-white/5">
                            <span className="text-[10px] uppercase tracking-widest text-white/60">
                                Live Terminal Output {scanning && progress.total > 0 && `(${Math.round((progress.current / progress.total) * 100)}%)`}
                            </span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full border border-white/20"></div>
                                <div className="w-2 h-2 rounded-full border border-white/20"></div>
                                <div className="w-2 h-2 rounded-full border border-white/20"></div>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1 terminal-scroll" ref={scrollRef}>
                            {logs.length === 0 && <div className="text-white/40">Waiting for user input...</div>}
                            {logs.map((log, i) => (
                                <div key={i} className="text-white/60">{log}</div>
                            ))}
                            {scanning && <div className="text-white">root@zekhoi-labs:~# <span className="animate-pulse">_</span></div>}
                        </div>
                    </div>
                    <div className="border border-white/20 bg-black">
                        <div className="border-b border-white/20 px-4 py-3 flex items-center justify-between">
                            <h2 className="text-xs uppercase tracking-widest font-bold">Scan Results</h2>
                            <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-sm">download</span>
                                Export CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest">
                                        <th className="px-4 py-3 font-normal">Port</th>
                                        <th className="px-4 py-3 font-normal">Service</th>
                                        <th className="px-4 py-3 font-normal">State</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {results.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-white/20 italic">No open ports found yet.</td>
                                        </tr>
                                    ) : (
                                        results.map((res, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-bold">{res.port}</td>
                                                <td className="px-4 py-3">{res.service}</td>
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        <span className="text-green-500">Open</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
