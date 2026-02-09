'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function WebScraper() {
    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Web Scraper"
                description="Advanced content extraction engine with JavaScript rendering capabilities. Supports CSS selectors, XPath, and automated pagination handling."
                breadcrumbs={[
                    { label: 'Directory', href: '/private' },
                    { label: 'Web Scraper' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/60">Target URL</label>
                            <input
                                className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                placeholder="https://site.com/listing" type="text"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/60">Limit Params</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                    placeholder="Max Pages: 10" type="number"
                                />
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                    placeholder="Delay: 1000ms" type="number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-black border border-white/20 flex flex-col relative h-96">
                        <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            Config.json
                        </div>
                        <div className="flex-1 flex mt-6 font-mono text-xs overflow-hidden">
                            <div className="w-8 text-right text-white/30 select-none pr-2 pt-2 leading-6 border-r border-white/10 h-full bg-black">
                                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10<br />11<br />12
                            </div>
                            <textarea
                                className="flex-1 bg-transparent border-none text-white p-2 focus:ring-0 leading-6 resize-none font-mono placeholder:text-white/20 h-full w-full outline-none"
                                placeholder={`{
  "selectors": [
    {
      "id": "title",
      "type": "css",
      "selector": "h1.product-title"
    },
    {
      "id": "price",
      "type": "xpath",
      "selector": "//span[@class='price']"
    }
  ],
  "render_js": true
}`}
                            ></textarea>
                        </div>
                    </div>

                    <button className="fragment-card w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 border border-white">
                        <span>[ Start Extraction ]</span>
                        <span className="material-symbols-outlined text-sm">code</span>
                    </button>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full gap-6">
                    <div className="flex-1 border border-white/20 bg-black flex flex-col overflow-hidden min-h-[400px]">
                        <div className="border-b border-white/20 bg-white/5 p-3 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Data Preview</span>
                            <div className="flex gap-4 text-[10px] font-mono text-white/60">
                                <span>Rows: 0</span>
                                <span>Size: 0KB</span>
                            </div>
                        </div>
                        <div className="overflow-auto flex-1 p-0">
                            <table className="w-full text-left text-xs font-mono">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest bg-black sticky top-0">
                                        <th className="px-4 py-3 font-normal whitespace-nowrap">Timestamp</th>
                                        <th className="px-4 py-3 font-normal whitespace-nowrap">ID</th>
                                        <th className="px-4 py-3 font-normal whitespace-nowrap">Content</th>
                                        <th className="px-4 py-3 font-normal whitespace-nowrap">Source</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-white/40">14:02:11.052</td>
                                        <td className="px-4 py-3 text-green-400">title</td>
                                        <td className="px-4 py-3 text-white/80">iPhone 15 Pro Max - 256GB</td>
                                        <td className="px-4 py-3 text-white/40 truncate max-w-[150px]">index.html:42</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-white/40">14:02:11.089</td>
                                        <td className="px-4 py-3 text-blue-400">price</td>
                                        <td className="px-4 py-3 text-white/80">$1,199.00</td>
                                        <td className="px-4 py-3 text-white/40 truncate max-w-[150px]">main.js:105</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-white/40">14:02:11.120</td>
                                        <td className="px-4 py-3 text-purple-400">img</td>
                                        <td className="px-4 py-3 text-white/80 text-ellipsis overflow-hidden max-w-xs">https://store.com/assets/p12...</td>
                                        <td className="px-4 py-3 text-white/40 truncate max-w-[150px]">index.html:55</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/[0.02] border border-white/10 p-4">
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Requests/sec</span>
                            <span className="text-xl font-bold">0.0</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 p-4">
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Data Parsed</span>
                            <span className="text-xl font-bold">0 MB</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 p-4">
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Active Threads</span>
                            <span className="text-xl font-bold">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
