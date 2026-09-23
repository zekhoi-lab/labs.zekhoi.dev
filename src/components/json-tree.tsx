'use client'

import { useState } from 'react'

// Children rendered per node until "Show more" is clicked, so huge arrays open fast
const CHUNK = 200

export function JsonTree({ value }: { value: unknown }) {
    return (
        <div className="font-mono text-xs md:text-sm leading-relaxed">
            <JsonNode label={null} value={value} depth={0} />
        </div>
    )
}

function Label({ label }: { label: string | number | null }) {
    if (label === null) return null
    // Array indices are plain numbers, object keys are shown as JSON strings
    return typeof label === 'number'
        ? <span className="text-gray-400">{label}: </span>
        : <span className="font-bold text-black dark:text-white">{JSON.stringify(label)}: </span>
}

function Primitive({ value }: { value: unknown }) {
    if (value === null) return <span className="text-gray-500">null</span>
    if (typeof value === 'boolean') return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>
    if (typeof value === 'number') return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>
    return <span className="text-purple-600 dark:text-purple-400 break-all">{JSON.stringify(value)}</span>
}

function JsonNode({ label, value, depth }: { label: string | number | null, value: unknown, depth: number }) {
    // Nodes deeper than 2 levels start collapsed; collapsed nodes render no children
    const [open, setOpen] = useState(depth < 2)
    const [visible, setVisible] = useState(CHUNK)

    if (value === null || typeof value !== 'object') {
        return (
            <div className="pl-5">
                <Label label={label} />
                <Primitive value={value} />
            </div>
        )
    }

    const isArray = Array.isArray(value)
    const entries: [string | number, unknown][] = isArray
        ? value.map((item, index) => [index, item])
        : Object.entries(value)
    const [openChar, closeChar] = isArray ? ['[', ']'] : ['{', '}']

    return (
        <div>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-900"
            >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">{open ? 'expand_more' : 'chevron_right'}</span>
                <Label label={label} />
                <span>{open ? openChar : `${openChar}…${closeChar}`}</span>
                <span className="ml-2 text-[10px] uppercase tracking-widest text-gray-400">
                    {entries.length} {isArray ? (entries.length === 1 ? 'item' : 'items') : (entries.length === 1 ? 'key' : 'keys')}
                </span>
            </button>
            {open && (
                <>
                    <div className="ml-2 pl-3 border-l border-gray-200 dark:border-gray-800">
                        {entries.slice(0, visible).map(([key, child]) => (
                            <JsonNode key={key} label={key} value={child} depth={depth + 1} />
                        ))}
                        {entries.length > visible && (
                            <button
                                type="button"
                                onClick={() => setVisible(entries.length)}
                                className="pl-5 text-[10px] uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white"
                            >
                                Show {entries.length - visible} more
                            </button>
                        )}
                    </div>
                    <div className="pl-5">{closeChar}</div>
                </>
            )}
        </div>
    )
}
