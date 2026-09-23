// Light/dark theme: the `dark` class on <html> drives Tailwind's `dark:` variant.
// Not a 'use client' module: the root layout imports the init script string.

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'
const CHANGE_EVENT = 'themechange'
const DARK_QUERY = '(prefers-color-scheme: dark)'

// Inlined in <head> so the class is set before first paint (no flash of the wrong theme)
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');var d=t==='dark'||(t!=='light'&&window.matchMedia('${DARK_QUERY}').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

export function getThemePreference(): ThemePreference {
    try {
        const value = localStorage.getItem(STORAGE_KEY)
        return value === 'light' || value === 'dark' ? value : 'system'
    } catch {
        return 'system'
    }
}

function applyTheme(preference: ThemePreference) {
    const dark = preference === 'dark' || (preference === 'system' && window.matchMedia(DARK_QUERY).matches)
    document.documentElement.classList.toggle('dark', dark)
}

export function setThemePreference(preference: ThemePreference) {
    try {
        if (preference === 'system') localStorage.removeItem(STORAGE_KEY)
        else localStorage.setItem(STORAGE_KEY, preference)
    } catch {
        // Storage unavailable (private mode): the choice still applies to this page
    }
    applyTheme(preference)
    window.dispatchEvent(new Event(CHANGE_EVENT))
}

// For useSyncExternalStore: re-render on changes from this tab, other tabs, and
// the OS setting (which only matters while following the system theme)
export function subscribeTheme(callback: () => void) {
    const media = window.matchMedia(DARK_QUERY)
    const sync = () => {
        applyTheme(getThemePreference())
        callback()
    }
    window.addEventListener(CHANGE_EVENT, callback)
    window.addEventListener('storage', sync)
    media.addEventListener('change', sync)
    return () => {
        window.removeEventListener(CHANGE_EVENT, callback)
        window.removeEventListener('storage', sync)
        media.removeEventListener('change', sync)
    }
}
