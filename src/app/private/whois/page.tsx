'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function WhoisMonitor() {
    return (
        <PrivateToolLayout>
            <ToolHeader
                title="WHOIS Monitor"
                description="Continuous tracking of ownership records, nameserver changes, and expiry alerts for private assets. Monitored activity is logged and encrypted."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'WHOIS Monitor' }
                ]}
                meta={
                    <div className="flex items-center gap-3 text-white/40 text-xs tracking-[0.2em] uppercase">
                        <span className="material-symbols-outlined text-sm">shield</span>
                        <span>Security Level: Alpha</span>
                    </div>
                }
            />

            <div className="mb-12">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <input
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white transition-colors outline-none font-mono"
                            placeholder="ENTER DOMAIN NAME (e.g. example.com)..." type="text"
                        />
                    </div>
                    <button className="fragment-card bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 border border-white">
                        <span className="material-symbols-outlined text-sm">search</span>
                        Analyze
                    </button>
                </div>
            </div>

            <div className="border border-white/20 bg-black overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-white/20 bg-white/5 uppercase tracking-tighter text-[10px] text-white/40">
                                <th className="px-6 py-4 font-medium border-r border-white/10">Registrar</th>
                                <th className="px-6 py-4 font-medium border-r border-white/10">Expiry Date</th>
                                <th className="px-6 py-4 font-medium border-r border-white/10">Nameservers</th>
                                <th className="px-6 py-4 font-medium border-r border-white/10">Registrant Contact</th>
                                <th className="px-6 py-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-5 border-r border-white/10">
                                    <span className="font-bold block">NAMECHEAP, INC.</span>
                                    <span className="text-[10px] text-white/40">IANA ID: 1068</span>
                                </td>
                                <td className="px-6 py-5 border-r border-white/10">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                                        <span>2025-10-14</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-r border-white/10">
                                    <ul className="text-[11px] space-y-1 text-white/80">
                                        <li>NS1.CLOUD.COM</li>
                                        <li>NS2.CLOUD.COM</li>
                                    </ul>
                                </td>
                                <td className="px-6 py-5 border-r border-white/10">
                                    <span className="text-[11px] leading-relaxed block text-white/80">Withheld for Privacy<br />Reykjavik, IS</span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button className="border border-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all inline-flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px]">notifications</span>
                                        Watch
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-5 border-r border-white/10">
                                    <span className="font-bold block">GODADDY.COM, LLC</span>
                                    <span className="text-[10px] text-white/40">IANA ID: 146</span>
                                </td>
                                <td className="px-6 py-5 border-r border-white/10">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm text-yellow-500">warning</span>
                                        <span>2024-11-22</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-r border-white/10">
                                    <ul className="text-[11px] space-y-1 text-white/80">
                                        <li>DNS1.REGISTRAR.NET</li>
                                        <li>DNS2.REGISTRAR.NET</li>
                                    </ul>
                                </td>
                                <td className="px-6 py-5 border-r border-white/10">
                                    <span className="text-[11px] leading-relaxed block text-white/80">Domains By Proxy, LLC<br />Arizona, US</span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <button className="bg-white text-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/80 transition-all inline-flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                                        Watching
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-white/20 p-6 bg-black flex flex-col gap-2">
                    <span className="text-[10px] text-white/40 uppercase">System Status</span>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold">STABLE</span>
                        <span className="text-[10px] text-green-500">ONLINE</span>
                    </div>
                </div>
                <div className="border border-white/20 p-6 bg-black flex flex-col gap-2">
                    <span className="text-[10px] text-white/40 uppercase">Active Watches</span>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold">142</span>
                        <span className="text-[10px] text-white/40">TOTAL</span>
                    </div>
                </div>
                <div className="border border-white/20 p-6 bg-black flex flex-col gap-2">
                    <span className="text-[10px] text-white/40 uppercase">Alerts (24h)</span>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold">03</span>
                        <span className="text-[10px] text-white/40">NOTIFICATIONS</span>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
