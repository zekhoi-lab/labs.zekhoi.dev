'use client'

import { useSyncExternalStore } from 'react'

// Decorative "PROCESS_ID" labels. Generated once per suffix on the client so
// the value is stable across re-renders and doesn't cause hydration mismatches.
const ids = new Map<string, string>()

const subscribe = () => () => {}

export function useProcessId(suffix: string): string {
    return useSyncExternalStore(
        subscribe,
        () => {
            if (!ids.has(suffix)) ids.set(suffix, `${Math.floor(Math.random() * 9000) + 1000}_${suffix}`)
            return ids.get(suffix)!
        },
        () => `0000_${suffix}`
    )
}
