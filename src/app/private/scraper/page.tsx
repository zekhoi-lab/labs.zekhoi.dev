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
                    <div className="bg-black border border-white/20 p-4 h-[300px] flex flex-col relative">
                        <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            Target Configuration
                        </div>
                        <div className="flex-1 flex flex-col gap-6 mt-8">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Target URL</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:ring-0 px-4 py-3 text-sm text-white placeholder:text-white/20 font-mono outline-none"
                                    placeholder="https://site.com/listing"
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/60">Parameters</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        className="w-full bg-white/5 border border-white/10 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                        placeholder="Pages: 1" type="number" disabled
                                    />
                                    <input
                                        className="w-full bg-white/5 border border-white/10 focus:border-white focus:ring-0 px-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                        placeholder="Delay: 1s" type="number" disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-white/20 p-4 flex-1 flex flex-col relative min-h-[300px]">
                        <div className="absolute top-0 left-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            JSON Output
                        </div>
                        <div className="flex-1 mt-6 overflow-auto font-mono text-xs text-white/60 whitespace-pre-wrap scrollbar-thin">
                            {loading ? (
                                <span className="animate-pulse">Fetching content...</span>
                            ) : result ? (
                                JSON.stringify(result, null, 2)
                            ) : (
                                <span className="text-white/20">Waiting for extraction...</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleScrape}
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 border border-white disabled:opacity-50 fragment-card"
                    >
                        <span>{loading ? '[ EXTRACTING... ]' : '[ START EXTRACTION ]'}</span>
                        <span className="material-symbols-outlined text-sm">code</span>
                    </button>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="flex items-center justify-between border border-white/20 bg-black p-3 mb-4 text-xs font-mono uppercase tracking-wider">
                        <div className="flex gap-4">
                            <span className="text-white">STATUS: <span className="text-white/60">{loading ? 'Running' : 'Idle'}</span></span>
                            <span className="text-white/20">{'//'}</span>
                            <span className="text-white">SIZE: <span className="text-white/60">{result?.size || 0} KB</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 bg-white ${loading ? 'animate-pulse' : ''}`}></span>
                            <span>{result?.success ? 'SUCCESS' : loading ? 'PROCESSING' : 'WAITING'}</span>
                        </div>
                    </div>

                    <div className="border border-white/20 bg-black flex-1 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto scrollbar-thin">
                            <div className="min-w-[700px]">
                                <div className="grid grid-cols-12 gap-x-4 border-b border-white/20 p-3 text-xs font-bold uppercase tracking-wider text-white/60">
                                    <div className="col-span-3">Field</div>
                                    <div className="col-span-9">Content</div>
                                </div>
                                <div className="overflow-y-auto max-h-[calc(100vh-400px)] min-h-[300px] p-0 scrollbar-thin">
                                    {result?.success ? (
                                        <>
                                            <div className="grid grid-cols-12 gap-x-4 border-b border-white/10 p-3 text-sm font-mono hover:bg-white/5">
                                                <div className="col-span-3 text-white/60 truncate min-w-0" title="Title">Title</div>
                                                <div className="col-span-9 text-white/80 truncate min-w-0" title={result.title}>{result.title}</div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-x-4 border-b border-white/10 p-3 text-sm font-mono hover:bg-white/5">
                                                <div className="col-span-3 text-white/60 truncate min-w-0" title="Description">Description</div>
                                                <div className="col-span-9 text-white/80 truncate min-w-0" title={result.description}>{result.description}</div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-x-4 border-b border-white/10 p-3 text-sm font-mono hover:bg-white/5">
                                                <div className="col-span-3 text-white/60 truncate min-w-0" title="Links Found">Links Found</div>
                                                <div className="col-span-9 text-white/80 truncate min-w-0" title={`${(result.links || []).length} URLs extracted`}>{(result.links || []).length} URLs extracted</div>
                                            </div>
                                            {(result.links || []).slice(0, 10).map((link, i) => (
                                                <div key={i} className="grid grid-cols-12 border-b border-white/10 p-3 text-sm font-mono hover:bg-white/5">
                                                    <div className="col-span-3 text-white/40 truncate min-w-0" title={`Link #${i + 1}`}>Link #{i + 1}</div>
                                                    <div className="col-span-9 text-blue-400 truncate underline cursor-pointer min-w-0" title={link}>{link}</div>
                                                </div>
                                            ))}
                                            {(result.links || []).length > 10 && (
                                                <div className="p-4 text-center text-white/40 italic text-xs">
                                                    ... and {(result.links || []).length - 10} more links
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="p-8 text-center text-white/20 italic">
                                            No data extracted yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-2 border-t border-white/20 bg-white/5 text-[10px] text-white/40 font-mono flex justify-between">
                            <span>PROCESS_ID: {Math.floor(Math.random() * 9000) + 1000}_SC</span>
                            <span>RENDER: JSDOM</span>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateToolLayout>
    )
}
