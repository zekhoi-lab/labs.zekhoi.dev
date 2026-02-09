'use client'

import { useState } from 'react'
import { lookupWhois, WhoisResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function WhoisMonitor() {
    const [domain, setDomain] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<WhoisResult | null>(null)

    const handleLookup = async () => {
        if (!domain) return
        setLoading(true)
        setResult(null)
        try {
            const data = await lookupWhois(domain)
            setResult(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Domain WHOIS Monitor"
                description="Real-time domain registration tracking. Monitor expiration dates, registrar changes, and DNS modifications. Automated alerts for status changes."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'WHOIS Monitor' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/60">Target Domain</label>
                            <input
                                className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                placeholder="example.com"
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                            />
                        </div>
                        <button
                            onClick={handleLookup}
                            disabled={loading}
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all border border-white disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search Record'}
                        </button>
                    </div>

                    {result && result.success ? (
                        <div className="flex-1 bg-black border border-white/20 p-6 space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-4">Registrar Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Registrar</span>
                                    <span className="text-sm font-bold block">{result.registrar}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Expiry Date</span>
                                    <span className="text-sm font-mono text-green-500">{result.expiry}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                                    <span className="text-white/40 uppercase tracking-widest">Nameservers</span>
                                    <div className="text-right">
                                        {(result.nameservers || []).map((ns, i) => (
                                            <span key={i} className="block font-mono">{ns}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : result && !result.success ? (
                        <div className="p-6 border border-white/20 text-center text-red-500">
                            Error: {result.error}
                        </div>
                    ) : (
                        <div className="p-6 border border-white/20 text-center text-white/20 text-xs uppercase tracking-widest">
                            No active lookup
                        </div>
                    )}
                </div>

                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="flex-1 border border-white/20 bg-black flex flex-col relative h-[600px] lg:h-auto">
                        <div className="border-b border-white/20 bg-white/5 p-3 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Raw WHOIS Output</span>
                            <div className="flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                            </div>
                        </div>
                        <div className="flex-1 p-6 font-mono text-xs overflow-auto text-white/70 whitespace-pre-wrap">
                            {loading ? (
                                <span className="animate-pulse"> querying whois server...</span>
                            ) : result ? (
                                result.raw
                            ) : (
                                <span className="text-white/30">Waiting for query...</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
