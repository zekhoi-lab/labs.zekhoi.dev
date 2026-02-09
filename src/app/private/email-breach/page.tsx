'use client'

import { useState } from 'react'
import { checkEmailBreach, EmailBreachResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function EmailBreach() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<EmailBreachResult | null>(null)

    const handleCheck = async () => {
        if (!email) return
        setLoading(true)
        setResult(null)
        try {
            const data = await checkEmailBreach(email)
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
                title="Email Breaches"
                description="Deep web surveillance system. Cross-references email addresses against 15TB+ of leaked database records. Instant notification of compromised credentials."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'Email Breaches' }
                ]}
            />

            <div className="w-full py-4">
                <div className="flex flex-col md:flex-row gap-4 mb-16">
                    <div className="relative flex-1 group">
                        <input
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-6 py-4 text-sm placeholder:text-white/20 text-white transition-colors outline-none font-mono"
                            placeholder="TARGET EMAIL ADDRESS..."
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                        />
                        <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 pointer-events-none transition-colors"></div>
                    </div>
                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="bg-white text-black px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Scanning...' : 'Scan Database'}
                    </button>
                </div>

                {result && (
                    <div className="mb-12 border border-white/20 p-8 flex items-center justify-between bg-black">
                        <div>
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Status</span>
                            {result.breached ? (
                                <h2 className="text-3xl font-bold text-red-500">COMPROMISED</h2>
                            ) : (
                                <h2 className="text-3xl font-bold text-green-500">SECURE</h2>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Breaches Found</span>
                            <span className="text-3xl font-bold">{result.count}</span>
                        </div>
                    </div>
                )}

                <section className="space-y-0 border-t border-white/10">
                    {result && result.breached ? (
                        result.sources.map((source, i) => (
                            <div key={i} className="relative pl-8 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
                                <span className="absolute left-0 top-10 w-2 h-2 bg-red-500 rounded-full group-hover:scale-150 transition-transform"></span>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                    <div className="md:col-span-1">
                                        <h3 className="text-xl font-bold mb-1">{source.name}</h3>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest">{source.date}</span>
                                    </div>
                                    <div className="md:col-span-3">
                                        <div className="flex flex-wrap gap-2">
                                            {source.data.map((item: string, j: number) => (
                                                <span key={j} className="px-3 py-1 border border-white/20 text-[10px] uppercase tracking-widest bg-white/[0.02]">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : result && !result.breached ? (
                        <div className="py-12 text-center text-white/40 text-sm uppercase tracking-widest">
                            No breaches found for this email address.
                        </div>
                    ) : (
                        <div className="py-12 text-center text-white/40 text-sm uppercase tracking-widest">
                            {loading ? 'Searching 15TB+ of data...' : 'Awaiting Input'}
                        </div>
                    )}
                </section>
            </div>
        </PrivateToolLayout>
    )
}
