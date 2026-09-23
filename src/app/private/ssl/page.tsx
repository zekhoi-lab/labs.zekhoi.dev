'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'


import { useState } from 'react'
import { checkSSL, SSLResult } from '../actions'

export default function SSLChecker() {
    const [host, setHost] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<SSLResult | null>(null)

    const handleCheck = async () => {
        if (!host) return
        setLoading(true)
        setResult(null)
        try {
            const data = await checkSSL(host)
            setResult(data)
        } catch (e) {
            console.error(e)
            setResult({ success: false, error: 'Request failed. Check your connection and try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="SSL Cert Checker"
                description="Connects to a host on port 443 and checks its certificate: whether it is trusted and matches the hostname, when it expires, its chain, and its alternative names."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'SSL Checker' }
                ]}
            />

            <div className="w-full space-y-12">
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/60">Target Hostname</label>
                        <input
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-4 text-sm font-mono placeholder:text-white/20 text-white outline-none"
                            placeholder="example.com"
                            type="text"
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                        />
                    </div>
                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="bg-white text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all border border-white whitespace-nowrap disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Check SSL'}
                    </button>
                </div>

                {result && result.success ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border border-white/20 p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-9xl">{result.authorized ? 'verified_user' : 'gpp_bad'}</span>
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={result.authorized ? 'p-3 bg-white text-black' : 'p-3 bg-red-500 text-white'}>
                                        <span className="material-symbols-outlined">{result.authorized ? 'lock' : 'lock_open'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{result.subject || '-'}</h3>
                                        {result.authorized ? (
                                            <span className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                Valid Certificate
                                            </span>
                                        ) : (
                                            <span className="text-xs text-red-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                                {result.validationError || 'Invalid Certificate'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Issuer</span>
                                            <span className="text-sm truncate block" title={result.issuer || '-'}>{result.issuer || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Protocol</span>
                                            <span className="text-sm">{result.protocol || '-'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Validity Period</span>
                                        <div className="flex justify-between items-center bg-white/5 p-2 border border-white/10 text-xs font-mono">
                                            <span>{result.validFrom ? new Date(result.validFrom).toLocaleDateString() : '-'}</span>
                                            <span className="text-white/40">→</span>
                                            <span>{result.validTo ? new Date(result.validTo).toLocaleDateString() : '-'}</span>
                                        </div>
                                    </div>
                                    {result.altNames && result.altNames.length > 0 && (
                                        <div>
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Alternative Names ({result.altNames.length})</span>
                                            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                                {result.altNames.map((name) => (
                                                    <span key={name} className="px-2 py-0.5 border border-white/10 text-[10px] font-mono">{name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border border-white/20 p-8 flex flex-col justify-between bg-white/[0.02]">
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Chain of Trust</h3>
                            <div className="space-y-6 flex-1 flex flex-col justify-center">
                                {[...(result.chain || [])].reverse().map((name, i, chain) => {
                                    const isLeaf = i === chain.length - 1
                                    return (
                                        <div key={`${name}-${i}`} className="flex items-center gap-4 group">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`w-2 h-2 rounded-full border border-white/40 ${isLeaf ? 'bg-white/20' : 'bg-white'}`}></span>
                                                {!isLeaf && <div className="h-8 w-px bg-white/20"></div>}
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold truncate max-w-[200px]" title={name}>{name}</span>
                                                <span className="text-[10px] text-white/40 uppercase tracking-wider">{isLeaf ? 'Subject' : 'Issuer'}</span>
                                            </div>
                                            {isLeaf && (
                                                <span className={`ml-auto material-symbols-outlined text-sm ${result.authorized ? 'text-green-500' : 'text-red-500'}`}>
                                                    {result.authorized ? 'check' : 'close'}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) : result && !result.success ? (
                    <div className="p-12 border border-white/20 text-center text-red-500">
                        Error: {result.error}
                    </div>
                ) : (
                    <div className="p-12 border border-white/20 text-center text-white/20 uppercase tracking-widest text-sm">
                        Enter a hostname to check SSL certificate
                    </div>
                )}

                {result && result.success && (
                    <div className="border border-white/20 bg-black p-4 flex flex-wrap gap-8 justify-around items-center">
                        <div className="text-center">
                            <span className={`block text-3xl font-bold mb-1 ${(result.daysRemaining ?? 0) < 0 ? 'text-red-500' : ''}`}>{Math.abs(result.daysRemaining ?? 0)}</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">{(result.daysRemaining ?? 0) < 0 ? 'Days Since Expiry' : 'Days Remaining'}</span>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                        <div className="text-center">
                            <span className="block text-3xl font-bold mb-1">{result.protocol}</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Protocol Version</span>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                        <div className="text-center">
                            <span className={`block text-3xl font-bold mb-1 ${result.grade === 'A+' ? 'text-green-500' : result.grade === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>{result.grade}</span>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Health Grade</span>
                        </div>
                    </div>
                )}
            </div>
        </PrivateToolLayout>
    )
}
