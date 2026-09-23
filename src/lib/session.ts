// Signed session tokens. Uses Web Crypto so it works in both the proxy and server actions.

export const SESSION_COOKIE = 'auth_token'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days, in seconds

const encoder = new TextEncoder()

function getSecret(): string | undefined {
    // Falls back to the password so existing deployments keep working;
    // changing the password then also invalidates every issued session.
    return process.env.AUTH_SECRET || process.env.AUTH_PASSWORD || undefined
}

function toBase64Url(bytes: Uint8Array): string {
    let binary = ''
    for (const b of bytes) binary += String.fromCharCode(b)
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sign(payload: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    return toBase64Url(new Uint8Array(signature))
}

function constantTimeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    return diff === 0
}

export async function createSessionToken(): Promise<string> {
    const secret = getSecret()
    if (!secret) throw new Error('AUTH_SECRET or AUTH_PASSWORD must be set')

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
    const nonce = toBase64Url(crypto.getRandomValues(new Uint8Array(16)))
    const payload = `${expiresAt}.${nonce}`
    return `${payload}.${await sign(payload, secret)}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
    const secret = getSecret()
    if (!secret || !token) return false

    const parts = token.split('.')
    if (parts.length !== 3) return false

    const [expiresAt, nonce, signature] = parts
    const expiry = Number(expiresAt)
    if (!Number.isFinite(expiry) || expiry * 1000 < Date.now()) return false

    const expected = await sign(`${expiresAt}.${nonce}`, secret)
    return constantTimeEqual(signature, expected)
}
