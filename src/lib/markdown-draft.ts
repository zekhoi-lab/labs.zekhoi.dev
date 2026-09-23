// The markdown editor's draft in localStorage. It is read once and then kept in
// memory, so it can serve as a stable useSyncExternalStore snapshot.

const KEY = 'markdown-draft'

// undefined: not read yet; null: nothing saved
let cached: string | null | undefined

export function readDraft(): string | null {
    if (cached === undefined) {
        try {
            cached = localStorage.getItem(KEY)
        } catch {
            cached = null
        }
    }
    return cached
}

export function saveDraft(text: string) {
    cached = text
    try {
        localStorage.setItem(KEY, text)
    } catch {
        // Storage full or blocked: the draft still lasts for this visit
    }
}

export function clearDraft() {
    cached = null
    try {
        localStorage.removeItem(KEY)
    } catch {
        // Nothing to clean up if storage is blocked
    }
}
