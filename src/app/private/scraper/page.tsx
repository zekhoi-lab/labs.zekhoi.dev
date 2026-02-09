'use client'

import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'


import { useState } from 'react'
import { scrapeWeb, ScrapeResult } from '../actions'

export default function WebScraper() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ScrapeResult | null>(null)

    const handleScrape = async () => {
        if (!url) return
        setLoading(true)
        setResult(null)
        try {
            const data = await scrapeWeb(url)
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
                title="Web Scraper"
                description="Advanced content extraction engine with JavaScript rendering capabilities. Supports CSS selectors, XPath, and automated pagination handling."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
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
                                placeholder="https://site.com/listing"
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/60">Limit Params</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                    placeholder="Max Pages: 1" type="number" disabled
                                />
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                    placeholder="Delay: 1000ms" type="number" disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-black border border-white/20 flex flex-col relative h-96">
                        <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            Output
                        </div>
                        <div className="p-4 font-mono text-xs overflow-auto h-full text-white/80 whitespace-pre-wrap">
                            {loading ? (
                                <span className="animate-pulse">Scraping target...</span>
                            ) : result ? (
                                JSON.stringify(result, null, 2)
                            ) : (
                                <span className="text-white/30">Ready to extract.</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleScrape}
                        disabled={loading}
                        className="fragment-card w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 border border-white disabled:opacity-50"
                    >
                        <span>{loading ? '[ Extracting... ]' : '[ Start Extraction ]'}</span>
                        <span className="material-symbols-outlined text-sm">code</span>
                    </button>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full gap-6">
                    <div className="flex-1 border border-white/20 bg-black flex flex-col overflow-hidden min-h-[400px]">
                        <div className="border-b border-white/20 bg-white/5 p-3 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Data Preview</span>
                            <div className="flex gap-4 text-[10px] font-mono text-white/60">
                                <span>Rows: {result?.links?.length || 0}</span>
                                <span>Size: {result?.size || 0}KB</span>
                            </div>
                        </div>
                        <div className="overflow-auto flex-1 p-0">
                            <table className="w-full text-left text-xs font-mono">
                                <thead>
                                    <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest bg-black sticky top-0">
                                        <th className="px-4 py-3 font-normal whitespace-nowrap">Timestamp</th>
                                        <th className="px-4 py-3 font-normal whitespace-nowrap">ID</th>
                                        <th className="px-4 py-3 font-normal whitespace-nowrap">Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {result?.success && (
                                        <>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 text-white/40">{result.timestamp}</td>
                                                <td className="px-4 py-3 text-green-400">Title</td>
                                                <td className="px-4 py-3 text-white/80">{result.title}</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 text-white/40">{result.timestamp}</td>
                                                <td className="px-4 py-3 text-blue-400">Description</td>
                                                <td className="px-4 py-3 text-white/80">{result.description}</td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/[0.02] border border-white/10 p-4">
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Requests/sec</span>
                            <span className="text-xl font-bold">1.0</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 p-4">
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Data Parsed</span>
                            <span className="text-xl font-bold">{result?.size || 0} KB</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 p-4">
                            <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Active Threads</span>
                            <span className="text-xl font-bold">{loading ? '1' : '0'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
