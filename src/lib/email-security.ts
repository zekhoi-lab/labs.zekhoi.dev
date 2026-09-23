// Email authentication checks (SPF, DMARC, DKIM, MX) over an injectable resolver,
// so the rules can be tested without the network

export type CheckStatus = 'pass' | 'warn' | 'fail'

export interface TxtResolver {
    resolveTxt(name: string): Promise<string[][]>
}

export interface MxRecord {
    priority: number
    exchange: string
}

export interface SpfCheck { status: CheckStatus; record: string | null; lookups: number; notes: string[] }
export interface DmarcCheck { status: CheckStatus; record: string | null; policy: string | null; notes: string[] }
export interface DkimCheck { status: CheckStatus; found: string[]; checked: string[]; notes: string[] }
export interface MxCheck { status: CheckStatus; records: MxRecord[]; notes: string[] }

export const COMMON_DKIM_SELECTORS = ['default', 'google', 'selector1', 'selector2', 'k1', 's1', 's2', 'mail', 'dkim', 'cf2024-1']

const SPF_LOOKUP_LIMIT = 10
const MAX_INCLUDE_DEPTH = 5
const MAX_RESOLVED_INCLUDES = 10

const LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/

// "https://Example.com/path" → "example.com"; Unicode names become punycode
export function normalizeDomain(input: string): string | null {
    const trimmed = input.trim()
    if (!trimmed) return null
    let host: string
    try {
        host = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`).hostname
    } catch {
        return null
    }
    host = host.replace(/\.$/, '')
    if (host.length > 253 || !host.includes('.')) return null
    return host.split('.').every(label => LABEL.test(label)) ? host : null
}

// No record (ENODATA / ENOTFOUND) and failed lookups both read as "nothing there"
async function txt(name: string, resolver: TxtResolver): Promise<string[]> {
    try {
        return (await resolver.resolveTxt(name)).map(chunks => chunks.join(''))
    } catch {
        return []
    }
}

const spfRecords = (records: string[]) => records.filter(record => /^v=spf1(\s|$)/i.test(record))

// "include:x" or "redirect=x" → x
function lookupTarget(term: string): string | null {
    const match = /^[+\-~?]?include:(.+)$/i.exec(term) ?? /^redirect=(.+)$/i.exec(term)
    return match ? match[1] : null
}

interface CountState {
    visited: Set<string>
    resolved: number
    macro: boolean
}

// RFC 7208 §4.6.4: include, a, mx, ptr, exists, and redirect each cost a DNS
// lookup, including those inside included records; more than 10 is a permerror
async function countLookups(record: string, depth: number, state: CountState, resolver: TxtResolver): Promise<number> {
    let lookups = 0
    for (const term of record.split(/\s+/).slice(1)) {
        const target = lookupTarget(term)
        if (target !== null) {
            lookups++
            if (target.includes('%')) {
                state.macro = true
                continue
            }
            const key = target.toLowerCase()
            if (depth >= MAX_INCLUDE_DEPTH || state.visited.has(key) || state.resolved >= MAX_RESOLVED_INCLUDES) continue
            state.visited.add(key)
            state.resolved++
            const nested = spfRecords(await txt(target, resolver))
            if (nested.length === 1) lookups += await countLookups(nested[0], depth + 1, state, resolver)
        } else if (/^[+\-~?]?(a|mx|ptr)([:/]|$)/i.test(term) || /^[+\-~?]?exists:/i.test(term)) {
            lookups++
        }
    }
    return lookups
}

export async function analyzeSpf(domain: string, resolver: TxtResolver): Promise<SpfCheck> {
    const records = spfRecords(await txt(domain, resolver))
    if (records.length === 0) return { status: 'fail', record: null, lookups: 0, notes: ['No SPF record: any server can claim to send mail for this domain'] }
    if (records.length > 1) {
        return { status: 'fail', record: records[0], lookups: 0, notes: [`${records.length} SPF records found; only one is allowed, so receivers treat SPF as broken`] }
    }

    const record = records[0]
    const notes: string[] = []
    let status: CheckStatus

    const all = record.split(/\s+/).map(term => /^([+\-~?]?)all$/i.exec(term)).find(Boolean)
    const qualifier = all ? (all[1] || '+') : null
    if (qualifier === '-') {
        status = 'pass'
        notes.push('Ends in -all: mail from servers not listed is rejected')
    } else if (qualifier === '~') {
        status = 'pass'
        notes.push('Ends in ~all (softfail): mail from servers not listed is accepted but marked')
    } else if (qualifier === '+' || qualifier === '?') {
        status = 'fail'
        notes.push(`Ends in ${qualifier === '+' ? '+all' : '?all'}: any server is allowed to send mail for this domain`)
    } else if (record.split(/\s+/).some(term => /^redirect=/i.test(term))) {
        status = 'warn'
        notes.push('No "all" mechanism; the policy comes from the redirect= target')
    } else {
        status = 'fail'
        notes.push('No "all" mechanism: servers not listed get a neutral result')
    }

    const state: CountState = { visited: new Set([domain.toLowerCase()]), resolved: 0, macro: false }
    const lookups = await countLookups(record, 0, state, resolver)
    if (lookups > SPF_LOOKUP_LIMIT) {
        status = 'fail'
        notes.push(`${lookups} DNS lookups; SPF allows at most ${SPF_LOOKUP_LIMIT}, so evaluation fails (permerror)`)
    }
    if (state.macro) notes.push('Uses SPF macros (%{…}); lookups inside macro includes are not counted')

    return { status, record, lookups, notes }
}

export async function analyzeDmarc(domain: string, resolver: TxtResolver): Promise<DmarcCheck> {
    const records = (await txt(`_dmarc.${domain}`, resolver)).filter(record => /^v=DMARC1\s*(;|$)/i.test(record))
    if (records.length === 0) return { status: 'fail', record: null, policy: null, notes: [`No DMARC record at _dmarc.${domain}`] }
    if (records.length > 1) return { status: 'fail', record: records[0], policy: null, notes: ['Multiple DMARC records; receivers ignore all of them'] }

    const record = records[0]
    const tags = new Map(
        record.split(';').map(part => part.trim()).filter(part => part.includes('=')).map(part => {
            const i = part.indexOf('=')
            return [part.slice(0, i).trim().toLowerCase(), part.slice(i + 1).trim()] as const
        })
    )
    const policy = tags.get('p')?.toLowerCase() ?? null
    const notes: string[] = []
    let status: CheckStatus

    if (policy === 'reject' || policy === 'quarantine') {
        status = 'pass'
        notes.push(`p=${policy}: mail failing authentication is ${policy === 'reject' ? 'rejected' : 'sent to spam'}`)
    } else if (policy === 'none') {
        status = 'warn'
        notes.push('p=none: monitoring only; failing mail is still delivered')
    } else {
        status = 'fail'
        notes.push('Missing or invalid policy (p=)')
    }
    const pct = tags.get('pct')
    if (pct && pct !== '100') notes.push(`Applies to ${pct}% of failing mail`)
    if (!tags.has('rua')) notes.push('No aggregate reports (rua) configured')

    return { status, record, policy, notes }
}

export async function checkDkim(domain: string, selectors: string[], resolver: TxtResolver): Promise<DkimCheck> {
    const extra = selectors.map(s => s.trim().toLowerCase()).filter(s => /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/.test(s))
    const checked = [...new Set([...extra, ...COMMON_DKIM_SELECTORS])]
    const results = await Promise.all(checked.map(async selector => ({
        selector,
        hasKey: (await txt(`${selector}._domainkey.${domain}`, resolver)).some(record => /(^|;)\s*p=/i.test(record)),
    })))
    const found = results.filter(r => r.hasKey).map(r => r.selector)
    return found.length > 0
        ? { status: 'pass', found, checked, notes: [] }
        : { status: 'warn', found, checked, notes: ['No DKIM key found among the checked selectors. Senders choose their own selectors, so this does not prove DKIM is missing.'] }
}

export function analyzeMx(records: MxRecord[]): MxCheck {
    const sorted = [...records].sort((a, b) => a.priority - b.priority)
    if (sorted.length === 0) {
        return { status: 'warn', records: [], notes: ['No MX records: mail can only fall back to the A record, and usually bounces'] }
    }
    if (sorted.length === 1 && (sorted[0].exchange === '' || sorted[0].exchange === '.')) {
        return { status: 'pass', records: sorted, notes: ['Null MX: the domain explicitly accepts no mail'] }
    }
    return { status: 'pass', records: sorted, notes: [] }
}
