'use server'

import { requireAuth } from '@/lib/auth'
import { resolvePublicHost, safeFetch } from '@/lib/net-guard'

export interface HeaderAnalysisResult {
    success: boolean
    headers?: Record<string, string>
    issues?: string[]
    present?: string[]
    score?: number
    server?: string
    ip?: string
    status?: string
    error?: string
}

export async function analyzeHeaders(url: string): Promise<HeaderAnalysisResult> {
    await requireAuth()

    try {
        if (!url.startsWith('http')) url = 'https://' + url
        const ip = await resolvePublicHost(new URL(url).hostname)

        let res = await safeFetch(url, { method: 'HEAD', cache: 'no-store' })
        if (res.status === 405 || res.status === 501) {
            // Some servers reject HEAD; the headers of a GET are what we need
            res = await safeFetch(url, { method: 'GET', cache: 'no-store' })
            await res.body?.cancel()
        }
        const headers: Record<string, string> = {}
        res.headers.forEach((v, k) => (headers[k] = v))

        const securityHeaders: Record<string, string> = {
            'content-security-policy': 'Missing CSP',
            'strict-transport-security': 'Missing HSTS',
            'x-frame-options': 'Missing X-Frame-Options',
            'x-content-type-options': 'Missing X-Content-Type-Options',
            'referrer-policy': 'Missing Referrer-Policy',
            'permissions-policy': 'Missing Permissions-Policy',
        }

        const issues: string[] = []
        const present: string[] = []
        let score = 100

        for (const [header, msg] of Object.entries(securityHeaders)) {
            if (headers[header]) {
                present.push(header)
            } else {
                issues.push(msg)
                score -= 15
            }
        }

        return {
            success: true,
            headers,
            issues,
            present,
            score: Math.max(0, score),
            server: headers['server'] || 'Unknown',
            ip,
            status: `${res.status} ${res.statusText}`
        }
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
}
