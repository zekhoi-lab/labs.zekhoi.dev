'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function EmailBreaches() {
    return (
        <PrivateToolLayout>
            <div className="w-full py-4">
                <ToolHeader
                    title="OSINT_EMAIL_LEAK_INDEX"
                    description="Deep-web OSINT leak search. Identify compromised credentials across known databases."
                    breadcrumbs={[
                        { label: 'Private Tools', href: '/private' },
                        { label: 'Email Breaches' }
                    ]}
                    meta={
                        <span className="text-[10px] text-white/40 tracking-[0.3em] uppercase block">
                            Module: OSINT_LEAK_DETECTION
                        </span>
                    }
                />

                <div className="mb-16">
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">search</span>
                        </span>
                        <input
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 pl-12 pr-4 py-4 text-sm placeholder:text-white/20 text-white transition-all outline-none font-mono"
                            placeholder="Enter target email address..." type="text"
                        />
                    </div>
                </div>

                <section className="space-y-0 border-t border-white/10">
                    <div className="relative pl-8 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                        <div className="absolute left-[-1px] top-0 bottom-0 w-px bg-white/20"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Date</span>
                                <span className="text-sm">2023-11-14</span>
                            </div>
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Breach Name</span>
                                <span className="text-sm font-bold group-hover:underline">Canva Global</span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Data Leaked</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Passwords</span>
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Emails</span>
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">IP Addresses</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative pl-8 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                        <div className="absolute left-[-1px] top-0 bottom-0 w-px bg-white/20"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Date</span>
                                <span className="text-sm">2022-05-20</span>
                            </div>
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Breach Name</span>
                                <span className="text-sm font-bold group-hover:underline">MyFitnessPal</span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Data Leaked</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Auth Tokens</span>
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Usernames</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative pl-8 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                        <div className="absolute left-[-1px] top-0 bottom-0 w-px bg-white/20"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Date</span>
                                <span className="text-sm">2021-01-12</span>
                            </div>
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Breach Name</span>
                                <span className="text-sm font-bold group-hover:underline">Dropbox v2</span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Data Leaked</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Salted Hashes</span>
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Location Data</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative pl-8 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                        <div className="absolute left-[-1px] top-0 bottom-0 w-px bg-white/20"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Date</span>
                                <span className="text-sm">2019-08-30</span>
                            </div>
                            <div className="md:col-span-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Breach Name</span>
                                <span className="text-sm font-bold group-hover:underline">Zynga Leak</span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Data Leaked</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Cleartext PW</span>
                                    <span className="px-2 py-0.5 border border-white/10 text-[10px] uppercase">Full Names</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-12 p-6 border border-white/10 bg-white/[0.01]">
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-white/40">info</span>
                        <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider">
                            Caution: The data presented above is aggregated from various dark-web sources.
                            Unauthorized use of this data for malicious purposes is strictly prohibited and logged by
                            server-side protocols.
                        </p>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
