export interface RegexMatch {
    index: number
    text: string
    // $1..$n; null for a group that didn't take part in the match
    groups: (string | null)[]
    named: Record<string, string | null> | null
}

export interface FindResult {
    matches: RegexMatch[]
    truncated: boolean
    error: string | null
}

// The regex tester's Web Worker is built from this function's source text,
// so it must not reference anything outside its own body.
export function findMatches(expression: string, flags: string, text: string): FindResult {
    const LIMIT = 10000

    let regex: RegExp
    try {
        regex = new RegExp(expression, flags)
    } catch (e) {
        return { matches: [], truncated: false, error: e instanceof Error ? e.message : String(e) }
    }

    const toMatch = (m: RegExpExecArray): RegexMatch => ({
        index: m.index,
        text: m[0],
        groups: m.slice(1).map(group => (group === undefined ? null : group)),
        named: m.groups
            ? Object.fromEntries(Object.entries(m.groups).map(([name, value]) => [name, value === undefined ? null : value]))
            : null,
    })

    if (!regex.global) {
        const m = regex.exec(text)
        return { matches: m ? [toMatch(m)] : [], truncated: false, error: null }
    }

    const matches: RegexMatch[] = []
    let m: RegExpExecArray | null
    while ((m = regex.exec(text)) !== null) {
        if (matches.length === LIMIT) return { matches, truncated: true, error: null }
        matches.push(toMatch(m))
        if (m[0] === '') {
            // Step past an empty match: a whole code point in unicode mode
            const code = text.codePointAt(regex.lastIndex)
            regex.lastIndex += regex.unicode && code !== undefined && code > 0xffff ? 2 : 1
        }
    }
    return { matches, truncated: false, error: null }
}
