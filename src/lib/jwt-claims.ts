// JWT time claims (RFC 7519): NumericDate values in seconds since the epoch

export type TimeClaimName = 'exp' | 'nbf' | 'iat'

export interface TimeClaim {
    name: TimeClaimName
    seconds: number
    iso: string
}

const TIME_CLAIMS: TimeClaimName[] = ['exp', 'nbf', 'iat']

export function readTimeClaims(payload: unknown): TimeClaim[] {
    if (payload === null || typeof payload !== 'object') return []
    const claims = payload as Record<string, unknown>

    return TIME_CLAIMS.flatMap(name => {
        const seconds = claims[name]
        if (typeof seconds !== 'number') return []
        const date = new Date(seconds * 1000)
        return Number.isNaN(date.getTime()) ? [] : [{ name, seconds, iso: date.toISOString() }]
    })
}

// null when the token carries no time claims at all
export function timeStatus(payload: unknown, nowMs: number): 'expired' | 'not-yet-valid' | 'valid' | null {
    const claims = readTimeClaims(payload)
    if (claims.length === 0) return null
    const now = nowMs / 1000
    const exp = claims.find(c => c.name === 'exp')
    const nbf = claims.find(c => c.name === 'nbf')
    if (exp && now >= exp.seconds) return 'expired'
    if (nbf && now < nbf.seconds) return 'not-yet-valid'
    return 'valid'
}
