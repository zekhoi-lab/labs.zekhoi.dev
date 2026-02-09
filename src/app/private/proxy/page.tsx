'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function ProxyValidator() {
    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Proxy Validator"
                description="High-performance validation engine for network node verification. Real-time latency profiling and anonymity level detection."
                breadcrumbs={[
                    { label: 'Dashboard', href: '/private' },
                    { label: 'Proxy Validator' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-white/60 block">
                            Input Proxy List (IP:PORT or IP:PORT:USER:PASS)
                        </label>
                        <textarea
                            className="w-full h-96 bg-black border border-white/20 focus:border-white focus:ring-0 p-4 text-xs font-mono placeholder:text-white/20 transition-all resize-none outline-none text-white"
                            placeholder={`192.168.1.1:8080
185.72.1.1:3128:user:pass
127.0.0.1:9050`}
                        ></textarea>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-white text-black font-bold text-xs py-3 uppercase tracking-widest hover:bg-white/80 transition-colors">
                                Validate
                            </button>
                            <button className="bg-black text-white border border-white/20 font-bold text-xs py-3 uppercase tracking-widest hover:border-white transition-colors">
                                Clear
                            </button>
                        </div>
                    </div>
                    <div className="p-4 border border-white/10 bg-white/5 space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Configuration</h4>
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-white/40">Timeout (ms)</span>
                            <span>5000</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-white/40">Threads</span>
                            <span>64</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-white/40">Auto-Detect Protocol</span>
                            <span className="text-white">ON</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="border border-white/20 bg-black overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="text-[11px] font-mono w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/20 text-white">
                                        <th className="font-bold uppercase tracking-wider py-4 px-4">Status</th>
                                        <th className="font-bold uppercase tracking-wider py-4 px-4">IP:PORT</th>
                                        <th className="font-bold uppercase tracking-wider py-4 px-4">Protocol</th>
                                        <th className="font-bold uppercase tracking-wider py-4 px-4">Anonymity</th>
                                        <th className="font-bold uppercase tracking-wider py-4 px-4">Latency</th>
                                        <th className="font-bold uppercase tracking-wider py-4 px-4">Country</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10 text-white">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4"><span className="w-2 h-2 bg-white inline-block rounded-full"></span></td>
                                        <td className="py-4 px-4">185.22.154.12:3128</td>
                                        <td className="py-4 px-4">SOCKS5</td>
                                        <td className="py-4 px-4">Elite</td>
                                        <td className="py-4 px-4">42ms</td>
                                        <td className="py-4 px-4">DE</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4"><span className="w-2 h-2 bg-white inline-block rounded-full"></span></td>
                                        <td className="py-4 px-4">45.89.229.110:80</td>
                                        <td className="py-4 px-4">HTTP</td>
                                        <td className="py-4 px-4">Transparent</td>
                                        <td className="py-4 px-4">156ms</td>
                                        <td className="py-4 px-4">US</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4"><span className="w-2 h-2 bg-white inline-block rounded-full"></span></td>
                                        <td className="py-4 px-4">202.164.21.18:1080</td>
                                        <td className="py-4 px-4">SOCKS4</td>
                                        <td className="py-4 px-4">Anonymous</td>
                                        <td className="py-4 px-4">289ms</td>
                                        <td className="py-4 px-4">SG</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4"><span className="w-2 h-2 bg-white/20 inline-block rounded-full"></span></td>
                                        <td className="py-4 px-4 text-white/40">103.21.58.11:8080</td>
                                        <td className="py-4 px-4 text-white/40">HTTP</td>
                                        <td className="py-4 px-4 text-white/40">---</td>
                                        <td className="py-4 px-4 text-white/40">Timeout</td>
                                        <td className="py-4 px-4 text-white/40">CN</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4"><span className="w-2 h-2 bg-white inline-block rounded-full"></span></td>
                                        <td className="py-4 px-4">91.241.19.44:3128</td>
                                        <td className="py-4 px-4">SOCKS5</td>
                                        <td className="py-4 px-4">Elite</td>
                                        <td className="py-4 px-4">68ms</td>
                                        <td className="py-4 px-4">RU</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4"><span className="w-2 h-2 bg-white inline-block rounded-full"></span></td>
                                        <td className="py-4 px-4">138.197.148.21:8080</td>
                                        <td className="py-4 px-4">HTTP</td>
                                        <td className="py-4 px-4">Elite</td>
                                        <td className="py-4 px-4">112ms</td>
                                        <td className="py-4 px-4">CA</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-[10px] text-white/40 uppercase font-mono">
                        <div className="flex gap-4">
                            <span>TOTAL: 1,429</span>
                            <span>VALID: 842</span>
                            <span>FAILED: 587</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="hover:text-white underline underline-offset-4">EXPORT VALID (.TXT)</button>
                            <span>/</span>
                            <button className="hover:text-white underline underline-offset-4">EXPORT ALL (.CSV)</button>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
