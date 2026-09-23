'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToolCard, type ToolCardProps } from '@/components/tool-card'
import { filterTools } from '@/lib/tool-search'

export function ToolGrid({ tools }: { tools: ToolCardProps[] }) {
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const results = useMemo(() => filterTools(tools, query), [tools, query])

    // "/" (unless typing in another field) or Ctrl/⌘+K jumps to the search box
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const typing = (e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1 max-w-xl">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" aria-hidden="true">search</span>
                    <input
                        ref={inputRef}
                        type="search"
                        aria-label="Search tools"
                        placeholder="Search tools..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setQuery('')
                                e.currentTarget.blur()
                            }
                            if (e.key === 'Enter' && results[0]) router.push(results[0].href)
                        }}
                        className="w-full bg-white dark:bg-black border border-black dark:border-white pl-10 pr-12 py-3 text-sm font-mono text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
                    />
                    <kbd className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 border border-gray-300 dark:border-gray-700 px-1.5 py-0.5 text-[10px] text-gray-400">/</kbd>
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {query.trim() ? `${results.length} of ${tools.length} tools` : `${tools.length} tools`}
                </span>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map((tool) => (
                        <ToolCard key={tool.href} {...tool} />
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center text-sm uppercase tracking-widest text-gray-400">
                    No tools match &ldquo;{query.trim()}&rdquo;
                </div>
            )}
        </div>
    )
}
