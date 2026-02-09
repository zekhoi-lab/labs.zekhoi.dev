'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function InstagramChecker() {
    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Instagram Checker"
                description="Account status verification & metadata extraction via private API endpoints. High-performance multi-threaded scanning module."
                breadcrumbs={[
                    { label: 'Private Tool', href: '/private' },
                    { label: 'Instagram Checker' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-black border border-white/20 p-4 h-[500px] flex flex-col relative">
                        <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            Input Payload
                        </div>
                        <div className="flex-1 flex mt-6 font-mono text-sm overflow-hidden">
                            <div className="w-8 text-right text-white/30 select-none pr-2 pt-2 leading-6 font-mono border-r border-white/10 h-full bg-black">
                                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12<br />13<br />14<br />15
                            </div>
                            <textarea
                                className="flex-1 bg-transparent border-none text-white p-2 focus:ring-0 leading-6 resize-none font-mono placeholder:text-white/20 h-full w-full outline-none"
                                placeholder={`Enter usernames (one per line)
zekhoi_labs
dev_null
root_access`}
                            ></textarea>
                        </div>
                    </div>
                    <button className="fragment-card w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 border border-white">
                        <span>[ EXECUTE_SCAN ]</span>
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                    </button>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="flex items-center justify-between border border-white/20 bg-black p-3 mb-4 text-xs font-mono uppercase tracking-wider">
                        <div className="flex gap-4">
                            <span className="text-white">TOTAL: <span className="text-white/60">0</span></span>
                            <span className="text-white/20">//</span>
                            <span className="text-white">SUCCESS: <span className="text-white/60">0</span></span>
                            <span className="text-white/20">//</span>
                            <span className="text-white">ERROR: <span className="text-white/60">0</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-white animate-pulse"></span>
                            <span>IDLE</span>
                        </div>
                    </div>
                    <div className="border border-white/20 bg-black flex-1 overflow-hidden flex flex-col">
                        <div className="grid grid-cols-12 border-b border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-white/60">
                            <div className="col-span-1">#</div>
                            <div className="col-span-4">Username</div>
                            <div className="col-span-4">Name</div>
                            <div className="col-span-3 text-right">Status</div>
                        </div>
                        <div className="overflow-y-auto flex-1 p-0">
                            <div className="grid grid-cols-12 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors">
                                <div className="col-span-1 text-white/40">01</div>
                                <div className="col-span-4">zekhoi_labs</div>
                                <div className="col-span-4 text-white/60">Zekhoi Laboratories</div>
                                <div className="col-span-3 text-right text-green-400">[ ACTIVE ]</div>
                            </div>
                            <div className="grid grid-cols-12 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors">
                                <div className="col-span-1 text-white/40">02</div>
                                <div className="col-span-4">unknown_entity_00</div>
                                <div className="col-span-4 text-white/60">--</div>
                                <div className="col-span-3 text-right text-red-400">[ NOT_FOUND ]</div>
                            </div>
                            <div className="grid grid-cols-12 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors animate-pulse">
                                <div className="col-span-1 text-white/40">03</div>
                                <div className="col-span-4">dev_ops_private</div>
                                <div className="col-span-4 text-white/60">...</div>
                                <div className="col-span-3 text-right text-yellow-400">[ SCANNING ]</div>
                            </div>
                            <div className="grid grid-cols-12 border-b border-white/10 p-3 text-sm font-mono items-center hover:bg-white/5 transition-colors opacity-40">
                                <div className="col-span-1 text-white/40">04</div>
                                <div className="col-span-4">system_root</div>
                                <div className="col-span-4 text-white/60"></div>
                                <div className="col-span-3 text-right text-white/40">[ QUEUED ]</div>
                            </div>
                        </div>
                        <div className="p-2 border-t border-white/20 bg-white/5 text-[10px] text-white/40 font-mono flex justify-between">
                            <span>PROCESS_ID: 9928_XJ</span>
                            <span>LATENCY: 42ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
