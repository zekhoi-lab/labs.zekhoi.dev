'use client'

import { useState } from 'react'
import { validateProxy, ProxyResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function ProxyValidator() {
    const [input, setInput] = useState('')
    const [validating, setValidating] = useState(false)
    const [results, setResults] = useState<ProxyResult[]>([])
    const [stats, setStats] = useState({ active: 0, dead: 0, total: 0 })

    const handleValidate = async () => {
        const proxies = input.split('\n').map(p => p.trim()).filter(p => p)
        if (proxies.length === 0) return

        setValidating(true)
        setResults([])
        setStats({ active: 0, dead: 0, total: proxies.length })

        const batchSize = 5
        for (let i = 0; i < proxies.length; i += batchSize) {
            const batch = proxies.slice(i, i + batchSize)
            const promises = batch.map(p => validateProxy(p))
            const batchResults = await Promise.all(promises)

            setResults(prev => [...prev, ...batchResults])
            setStats(prev => {
                const active = batchResults.filter(r => r.status === 'Active').length
                return { ...prev, active: prev.active + active, dead: prev.dead + (batch.length - active) }
            })
        }
        setValidating(false)
    }

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/60">Proxy List</label>
                            <textarea
                                className="w-full h-80 bg-black border border-white/20 focus:border-white focus:ring-0 p-4 text-sm text-white placeholder:text-white/20 font-mono resize-none outline-none"
                                placeholder={`192.168.1.1:8080\n10.0.0.1:3128:user:pass`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            ></textarea>
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                                <span>Format: IP:PORT or IP:PORT:USER:PASS</span>
                                <span>{input.split('\n').filter(l => l.trim()).length} Proxies</span>
                            </div>
                        </div>
                        <button
                            onClick={handleValidate}
                            disabled={validating}
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all border border-white disabled:opacity-50"
                        >
                            {validating ? 'Validating...' : 'Start Validation'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black border border-white/20 p-4 text-center">
                            <span className="block text-3xl font-bold text-green-500 mb-1">{stats.active}</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="bg-black border border-white/20 p-4 text-center">
                            <span className="block text-3xl font-bold text-red-500 mb-1">{stats.dead}</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Dead</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="border border-white/20 bg-black min-h-[600px] flex flex-col">
                        <div className="border-b border-white/20 px-6 py-4 flex items-center justify-between bg-white/5">
                            <h2 className="text-xs uppercase tracking-widest font-bold">Live Results</h2>
                            <div className="flex gap-4">
                                <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Export Active</button>
                                <button onClick={() => { setResults([]); setStats({ active: 0, dead: 0, total: 0 }); }} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Clear All</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest sticky top-0 bg-black">
                                        <th className="px-6 py-4 font-normal">Proxy Address</th>
                                        <th className="px-6 py-4 font-normal">Status</th>
                                        <th className="px-6 py-4 font-normal">Anonymity</th>
                                        <th className="px-6 py-4 font-normal">Latency</th>
                                        <th className="px-6 py-4 font-normal">Exit IP</th>
                                        <th className="px-6 py-4 font-normal text-right">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-mono">
                                    {results.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-white/20 italic">Waiting for input...</td>
                                        </tr>
                                    ) : (
                                        results.map((res, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-white/80">{res.proxy}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${res.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${res.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white/60">{res.anonymity}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`${res.latency < 200 ? 'text-green-500' : res.latency < 500 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                        {res.latency}ms
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white/60">{res.ip || '-'}</td>
                                                <td className="px-6 py-4 text-right text-white/40">{res.city ? `${res.city}, ${res.country}` : res.country}</td>
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
