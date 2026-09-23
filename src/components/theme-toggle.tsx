'use client'

import { useSyncExternalStore } from 'react'
import { getThemePreference, setThemePreference, subscribeTheme, type ThemePreference } from '@/lib/theme'

const NEXT: Record<ThemePreference, ThemePreference> = { system: 'light', light: 'dark', dark: 'system' }
const ICON: Record<ThemePreference, string> = { system: 'contrast', light: 'light_mode', dark: 'dark_mode' }

export function ThemeToggle() {
  // The server can't know the stored choice, so the prerendered button says "system"
  const preference = useSyncExternalStore(subscribeTheme, getThemePreference, () => 'system' as const)

  return (
    <button
      type="button"
      onClick={() => setThemePreference(NEXT[preference])}
      className="flex items-center gap-1 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
      aria-label={`Theme: ${preference}. Switch to ${NEXT[preference]}`}
      title={`Theme: ${preference}`}
    >
      <span className="material-symbols-outlined text-base" aria-hidden="true">{ICON[preference]}</span>
      <span className="hidden sm:inline">{preference}</span>
    </button>
  )
}
