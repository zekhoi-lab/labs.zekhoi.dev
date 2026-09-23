'use client'

import { useSyncExternalStore } from 'react'

// One shared clock that ticks every second while any component is subscribed
let now: number | null = null
let timer: ReturnType<typeof setInterval> | undefined
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
    listeners.add(listener)
    if (!timer) {
        now = Date.now()
        timer = setInterval(() => {
            now = Date.now()
            listeners.forEach(notify => notify())
        }, 1000)
    }
    listener()
    return () => {
        listeners.delete(listener)
        if (listeners.size === 0) {
            clearInterval(timer)
            timer = undefined
        }
    }
}

// The current time in ms, or null during prerender and hydration, so anything
// derived from it is only rendered in the browser (no hydration mismatch)
export function useNow(): number | null {
    return useSyncExternalStore(subscribe, () => now, () => null)
}
