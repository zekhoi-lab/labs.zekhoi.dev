'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Copies text and remembers which control did it for a moment, so that control
// can show a "copied" state. Pass a key when a page has several copy buttons.
export function useCopy(resetAfterMs = 2000) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    useEffect(() => {
        const pending = timer
        return () => clearTimeout(pending.current)
    }, [])

    const copy = useCallback(async (text: string, key = 'default') => {
        try {
            await navigator.clipboard.writeText(text)
        } catch {
            return // Clipboard blocked (permissions or an insecure context)
        }
        setCopiedKey(key)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopiedKey(null), resetAfterMs)
    }, [resetAfterMs])

    const isCopied = (key = 'default') => copiedKey === key

    return { copy, isCopied }
}
