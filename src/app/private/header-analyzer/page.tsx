'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'
import { GlitchText } from '@/components/glitch-text'
import { useState } from 'react'
import { analyzeHeaders } from '../actions'

export default function HeaderAnalyzer() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleAnalyze = async () => {
        if (!url) return
        setLoading(true)
        setResult(null)
        try {
            const data = await analyzeHeaders(url)
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
                title="Header Analyzer"
                description="Analyze HTTP response headers for security misconfigurations. Identify missing security flags and validate server hardening policies."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'Security Analysis' }
                ]}
            />

            <div className="mb-12">
                <div className="flex flex-col md:flex-row gap-0">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40">
                            <span className="material-symbols-outlined text-lg">link</span>
                        </div>
                        <input
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 pl-12 pr-4 py-4 text-sm placeholder:text-white/30 text-white font-mono outline-none"
                            placeholder="https://target-domain.com"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-white text-black px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Analyzing...' : 'Fetch Headers'}
                    </button>
                </div>
            </div>

            {result && result.success ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="border border-white/20 p-8 flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-sm">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6">Security Grade</span>
                            <div className="text-9xl font-bold mb-6">
                                <GlitchText text={result.score >= 90 ? 'A' : result.score >= 70 ? 'B' : result.score >= 50 ? 'C' : 'F'} />
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs text-white/60">{result.issues.length} Warnings Detected</div>
                                <div className="text-xs text-green-500">{Object.keys(result.headers).length - result.issues.length} Headers Correctly Configured</div>
                            </div>
                        </div>
                        <div className="border border-white/20 p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest">Metadata</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-white/40">Server</span>
                                    <span className="text-white">{result.server}</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-white/40">IP Address</span>
                                    <span className="text-white">{result.ip}</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-white/40">Status Code</span>
                                    <span className="text-white font-bold">{result.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <div className="border border-white/20 overflow-hidden">
                            <div className="bg-white/5 border-b border-white/20 px-6 py-3 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Header Policy Breakdown</span>
                                <span className="text-[10px] text-white/40">v2.1.0-stable</span>
                            </div>
                            <div className="divide-y divide-white/10">
                                {Object.entries(result.headers).map(([key, value]) => (
                                    <div key={key} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="space-y-1">
                                            <div className="font-bold text-sm flex items-center gap-2 uppercase">
                                                {key}
                                                <span className="text-[9px] bg-green-500/10 text-green-500 border border-green-500/20 px-1.5 py-0.5">RECEIVED</span>
                                            </div>
                                        </div>
                                        <div className="text-[11px] font-mono text-white/80 bg-white/5 p-2 border border-white/10 overflow-hidden text-ellipsis whitespace-nowrap max-w-xs" title={value as string}>
                                            {value as string}
                                        </div>
                                    </div>
                                ))}
                                {result.issues.map((issue: string, i: number) => (
                                    <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="space-y-1">
                                            <div className="font-bold text-sm flex items-center gap-2">
                                                {issue.split(' ')[1]}
                                                <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5">MISSING</span>
                                            </div>
                                            <p className="text-[11px] text-white/40 max-w-md">Recommended security header not found.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : result && !result.success ? (
                <div className="p-12 border border-white/20 text-center text-red-500">
                    Error: {result.error}
                </div>
            ) : (
                <div className="p-12 border border-white/20 text-center text-white/20 uppercase tracking-widest text-sm">
                    Enter a URL to begin analysis
                </div>
            )}
        </PrivateToolLayout>
    )
}
