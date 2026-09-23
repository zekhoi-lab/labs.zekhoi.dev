'use client'

import { useState } from 'react'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'
import { checkDns, type DnsCheckResult } from '../actions'
import type { CheckStatus } from '@/lib/email-security'

const STATUS_STYLES: Record<CheckStatus, string> = {
    pass: 'text-green-500 border-green-500/50',
    warn: 'text-yellow-500 border-yellow-500/50',
    fail: 'text-red-500 border-red-500/50',
}

function CheckCard({ title, status, record, notes, children }: {
    title: string
    status: CheckStatus
    record?: string | null
    notes: string[]
    children?: React.ReactNode
}) {
    return (
        <section aria-label={title} className="border border-white/20 bg-black p-5 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
                <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[status]}`}>{status}</span>
            </div>
            {record && <p className="font-mono text-xs text-white/80 break-all bg-white/5 p-2">{record}</p>}
            {children}
            {notes.length > 0 && (
                <ul className="space-y-1 text-xs text-white/60">
                    {notes.map(note => <li key={note}>• {note}</li>)}
                </ul>
            )}
        </section>
    )
}

export default function DnsChecker() {
    const [domain, setDomain] = useState('')
    const [selectors, setSelectors] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<DnsCheckResult | null>(null)

    const handleCheck = async () => {
        if (!domain.trim()) return
        setLoading(true)
        setResult(null)
        try {
            setResult(await checkDns(domain, selectors))
        } catch (e) {
            console.error(e)
            setResult({ success: false, error: 'Request failed. Check your connection and try again.' })
        } finally {
            setLoading(false)
        }
    }

    const records = result?.success ? result.records : undefined
    const email = result?.success ? result.email : undefined
    const recordRows: [string, string[]][] = records ? [
        ['A', records.a],
        ['AAAA', records.aaaa],
        ['CNAME', records.cname],
        ['MX', records.mx.map(mx => `${mx.priority} ${mx.exchange || '.'}`)],
        ['NS', records.ns],
        ['TXT', records.txt],
        ['CAA', records.caa],
    ] : []

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="DNS & Email Security"
                description="Looks up a domain's DNS records and checks its email authentication: SPF (including nested lookups), DMARC, DKIM, and MX."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'DNS & Email Security' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="dns-domain" className="text-[10px] uppercase tracking-widest text-white/60">Domain</label>
                        <input
                            id="dns-domain"
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                            placeholder="example.com"
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="dns-selectors" className="text-[10px] uppercase tracking-widest text-white/60">DKIM selectors (optional)</label>
                        <input
                            id="dns-selectors"
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                            placeholder="selector1, mail2024"
                            type="text"
                            value={selectors}
                            onChange={(e) => setSelectors(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                        />
                        <p className="text-[10px] text-white/40">Common selectors are always tried too.</p>
                    </div>
                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all border border-white disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Check Domain'}
                    </button>

                    {result && !result.success && (
                        <div className="p-6 border border-white/20 text-center text-red-500">
                            Error: {result.error}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-8 space-y-6">
                    {email && records ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CheckCard title="SPF" status={email.spf.status} record={email.spf.record} notes={[...email.spf.notes, `${email.spf.lookups} DNS lookups (limit 10)`]} />
                                <CheckCard title="DMARC" status={email.dmarc.status} record={email.dmarc.record} notes={email.dmarc.notes} />
                                <CheckCard title="DKIM" status={email.dkim.status} notes={email.dkim.notes}>
                                    <p className="text-xs text-white/80">
                                        {email.dkim.found.length > 0 ? `Key found for: ${email.dkim.found.join(', ')}` : 'No key found'}
                                    </p>
                                    <p className="text-[10px] text-white/40 break-words">Checked: {email.dkim.checked.join(', ')}</p>
                                </CheckCard>
                                <CheckCard title="MX" status={email.mx.status} notes={email.mx.notes}>
                                    {email.mx.records.length > 0 && (
                                        <ul className="font-mono text-xs text-white/80 space-y-1">
                                            {email.mx.records.map(mx => <li key={`${mx.priority}-${mx.exchange}`}>{mx.priority} {mx.exchange || '.'}</li>)}
                                        </ul>
                                    )}
                                </CheckCard>
                            </div>

                            <div className="border border-white/20 bg-black overflow-x-auto">
                                <table aria-label="DNS records" className="w-full text-xs font-mono">
                                    <tbody>
                                        {recordRows.map(([type, values]) => (
                                            <tr key={type} className="border-b border-white/10 last:border-b-0 align-top">
                                                <th scope="row" className="w-20 p-3 text-left text-[10px] uppercase tracking-widest text-white/40">{type}</th>
                                                <td className="p-3 text-white/80 break-all">
                                                    {values.length > 0 ? values.map(value => <div key={value}>{value}</div>) : <span className="text-white/20">-</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 border border-white/20 text-center text-white/20 uppercase tracking-widest text-sm">
                            {loading ? 'Querying DNS...' : 'Enter a domain to check its DNS and email setup'}
                        </div>
                    )}
                </div>
            </div>
        </PrivateToolLayout>
    )
}
