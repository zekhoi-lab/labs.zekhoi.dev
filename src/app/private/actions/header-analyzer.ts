'use server'

export async function analyzeHeaders(url: string) {
    try {
        if (!url.startsWith('http')) url = 'https://' + url
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' })
        const headers: Record<string, string> = {}
        res.headers.forEach((v, k) => (headers[k] = v))

        const securityHeaders = {
            'content-security-policy': 'Missing CSP',
            'strict-transport-security': 'Missing HSTS',
            'x-frame-options': 'Missing X-Frame-Options',
            'x-content-type-options': 'Missing X-Content-Type-Options',
            'referrer-policy': 'Missing Referrer-Policy',
            'permissions-policy': 'Missing Permissions-Policy',
        }

        const issues = []
        let score = 100

        for (const [header, msg] of Object.entries(securityHeaders)) {
            if (!headers[header]) {
                issues.push(msg)
                score -= 15
            }
        }

        return {
            success: true,
            headers,
            issues,
            score: Math.max(0, score),
            server: headers['server'] || 'Unknown',
            ip: 'Hidden',
            status: `${res.status} ${res.statusText}`
        }
    } catch (err) {
        return { success: false, error: String(err) }
    }
}
