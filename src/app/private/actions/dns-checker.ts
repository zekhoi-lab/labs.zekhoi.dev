'use server'

import { Resolver } from 'dns/promises'
import type { CaaRecord } from 'dns'
import { requireAuth } from '@/lib/auth'
import {
    analyzeDmarc, analyzeMx, analyzeSpf, checkDkim, normalizeDomain,
    type DkimCheck, type DmarcCheck, type MxCheck, type MxRecord, type SpfCheck,
} from '@/lib/email-security'

export interface DnsRecords {
    a: string[]
    aaaa: string[]
    cname: string[]
    mx: MxRecord[]
    ns: string[]
    txt: string[]
    caa: string[]
}

export interface DnsCheckResult {
    success: boolean
    domain?: string
    records?: DnsRecords
    email?: { spf: SpfCheck, dmarc: DmarcCheck, dkim: DkimCheck, mx: MxCheck }
    error?: string
}

// No record of a type is normal; failed lookups (timeouts, SERVFAIL) also show as empty
async function lookup<T>(query: () => Promise<T[]>): Promise<{ values: T[], notFound: boolean }> {
    try {
        return { values: await query(), notFound: false }
    } catch (e) {
        return { values: [], notFound: (e as NodeJS.ErrnoException).code === 'ENOTFOUND' }
    }
}

// { critical: 0, issue: 'letsencrypt.org' } → '0 issue "letsencrypt.org"'
function formatCaa(record: CaaRecord): string {
    const [tag, value] = Object.entries(record).find(([key]) => key !== 'critical') ?? ['', '']
    return `${record.critical} ${tag} "${value}"`
}

export async function checkDns(input: string, dkimSelectors: string = ''): Promise<DnsCheckResult> {
    await requireAuth()

    const domain = normalizeDomain(input)
    if (!domain) return { success: false, error: 'Enter a valid domain name, e.g. example.com' }

    // Only DNS resolvers are queried; nothing connects to the domain itself
    const resolver = new Resolver({ timeout: 3000, tries: 2 })
    const [a, aaaa, cname, mx, ns, txt, caa] = await Promise.all([
        lookup(() => resolver.resolve4(domain)),
        lookup(() => resolver.resolve6(domain)),
        lookup(() => resolver.resolveCname(domain)),
        lookup(() => resolver.resolveMx(domain)),
        lookup(() => resolver.resolveNs(domain)),
        lookup(() => resolver.resolveTxt(domain)),
        lookup(() => resolver.resolveCaa(domain)),
    ])
    if ([a, aaaa, cname, mx, ns, txt, caa].every(result => result.notFound)) {
        return { success: false, error: `${domain} does not exist (NXDOMAIN)` }
    }

    const [spf, dmarc, dkim] = await Promise.all([
        analyzeSpf(domain, resolver),
        analyzeDmarc(domain, resolver),
        // At most 10 extra selectors, so one request can't fan out into hundreds of lookups
        checkDkim(domain, dkimSelectors.split(',').slice(0, 10), resolver),
    ])

    return {
        success: true,
        domain,
        records: {
            a: a.values,
            aaaa: aaaa.values,
            cname: cname.values,
            mx: mx.values,
            ns: ns.values,
            txt: txt.values.map(chunks => chunks.join('')),
            caa: caa.values.map(formatCaa),
        },
        email: { spf, dmarc, dkim, mx: analyzeMx(mx.values) },
    }
}
