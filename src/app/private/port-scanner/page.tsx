'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function PortScanner() {
    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Port Scanner"
                description="Internal network analysis utility. High-performance multi-threaded scanning module with service version detection and state validation. Restricted access authorized only."
                breadcrumbs={[
                    { label: 'Internal Dashboard', href: '/private' },
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
                                    placeholder="192.168.1.1" type="text"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Port Range</label>
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-2.5 text-sm text-white placeholder:text-white/20 font-mono transition-colors outline-none"
                                    placeholder="1-1024" type="text"
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
                        <button className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white border border-white transition-all">
                            Initialize Scan
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-white/20 p-4 text-center bg-black">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Threads</p>
                            <p className="text-xl font-bold tracking-tighter">128/SEC</p>
                        </div>
                        <div className="border border-white/20 p-4 text-center bg-black">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-xl font-bold tracking-tighter text-white/60">IDLE</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="border border-white/20 bg-black flex flex-col h-64">
                        <div className="border-b border-white/20 px-4 py-2 flex items-center justify-between bg-white/5">
                            <span className="text-[10px] uppercase tracking-widest text-white/60">Live Terminal Output</span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full border border-white/20"></div>
                                <div className="w-2 h-2 rounded-full border border-white/20"></div>
                                <div className="w-2 h-2 rounded-full border border-white/20"></div>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1 terminal-scroll">
                            <div className="text-white/40">[2024-05-20 14:02:11] Waiting for user input...</div>
                            <div className="text-white/40">[2024-05-20 14:02:15] System ready. All modules loaded.</div>
                            <div className="text-white">root@zekhoi-labs:~# <span className="animate-pulse">_</span></div>
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
                                        <th className="px-4 py-3 font-normal">Version</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-bold">22</td>
                                        <td className="px-4 py-3">ssh</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                                Open
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white/60">OpenSSH 8.9p1 Ubuntu-3ubuntu0.1</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-bold">80</td>
                                        <td className="px-4 py-3">http</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                                Open
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white/60">nginx 1.18.0</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-bold">443</td>
                                        <td className="px-4 py-3">https</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                                Open
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white/60">nginx 1.18.0 (SSL)</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-bold">3306</td>
                                        <td className="px-4 py-3">mysql</td>
                                        <td className="px-4 py-3 text-white/40">
                                            <span className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 border border-white/40 rounded-full"></span>
                                                Closed
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white/20">--</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-bold">8080</td>
                                        <td className="px-4 py-3">http-proxy</td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                                Open
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white/60">Squid proxy-cache 5.7</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
