'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
    window.addEventListener('online', callback)
    window.addEventListener('offline', callback)
    return () => {
        window.removeEventListener('online', callback)
        window.removeEventListener('offline', callback)
    }
}

// navigator.onLine, re-rendering when the browser goes online or offline.
// The server snapshot assumes online so prerendered HTML matches the common case.
export function useOnlineStatus(): boolean {
    return useSyncExternalStore(subscribe, () => navigator.onLine, () => true)
}
