'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function SSLChecker() {
    return (
        <PrivateToolLayout>
            <ToolHeader
                title="SSL Cert Checker"
                description="Deep inspection of SSL/TLS configurations. Validate certificate chains, expiration dates, and ciphersuite strength against current security standards."
                breadcrumbs={[
                    { label: 'Dashboard', href: '/private' },
                    { label: 'SSL Checker' }
                ]}
            />

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/60">Target Hostname</label>
                        <input
                            className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-4 text-sm font-mono placeholder:text-white/20 text-white outline-none"
                            placeholder="example.com" type="text"
                        />
                    </div>
                    <button className="bg-white text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all border border-white whitespace-nowrap">
                        Check SSL
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-white/20 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-9xl">verified_user</span>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-black">
                                    <span className="material-symbols-outlined">lock</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">zekhoi.dev</h3>
                                    <span className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        Valid Certificate
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Issuer</span>
                                        <span className="text-sm">Let's Encrypt R3</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Key Strength</span>
                                        <span className="text-sm">RSA 2048-bit</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Validity Period</span>
                                    <div className="flex justify-between items-center bg-white/5 p-2 border border-white/10 text-xs font-mono">
                                        <span>2024-03-15</span>
                                        <span className="text-white/40">→</span>
                                        <span>2024-06-13</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-white/20 p-8 flex flex-col justify-between bg-white/[0.02]">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Chain of Trust</h3>
                        <div className="space-y-6 flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-4 group">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="w-2 h-2 rounded-full border border-white/40 bg-white"></span>
                                    <div className="h-8 w-px bg-white/20"></div>
                                </div>
                                <div>
                                    <span className="block text-sm font-bold">ISRG Root X1</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Root CA</span>
                                </div>
                                <span className="ml-auto text-green-500 material-symbols-outlined text-sm">check</span>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="w-2 h-2 rounded-full border border-white/40 bg-white/60"></span>
                                    <div className="h-8 w-px bg-white/20"></div>
                                </div>
                                <div>
                                    <span className="block text-sm font-bold">R3</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Intermediate CA</span>
                                </div>
                                <span className="ml-auto text-green-500 material-symbols-outlined text-sm">check</span>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="w-2 h-2 rounded-full border border-white/40 bg-white/20"></span>
                                </div>
                                <div>
                                    <span className="block text-sm font-bold">zekhoi.dev</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Leaf Certificate</span>
                                </div>
                                <span className="ml-auto text-green-500 material-symbols-outlined text-sm">check</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-white/20 bg-black p-4 flex flex-wrap gap-8 justify-around items-center">
                    <div className="text-center">
                        <span className="block text-3xl font-bold mb-1">89</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Days Remaining</span>
                    </div>
                    <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                    <div className="text-center">
                        <span className="block text-3xl font-bold mb-1">TLS 1.3</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Protocol Version</span>
                    </div>
                    <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                    <div className="text-center">
                        <span className="block text-3xl font-bold mb-1 text-green-500">A+</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Qualys Grade</span>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
