'use server'

import net from 'net'
import tls from 'tls'
import { requireAuth } from '@/lib/auth'
import { resolvePublicHost } from '@/lib/net-guard'


export interface SSLResult {
    success: boolean
    authorized?: boolean
    validationError?: string | null
    daysRemaining?: number
    validFrom?: string | null
    validTo?: string | null
    issuer?: string | null
    subject?: string | null
    altNames?: string[]
    chain?: string[]
    protocol?: string
    grade?: string
    error?: string
}

// Readable text for the verification codes Node/OpenSSL report most often
const VALIDATION_ERRORS: Record<string, string> = {
    CERT_HAS_EXPIRED: 'Certificate has expired',
    CERT_NOT_YET_VALID: 'Certificate is not valid yet',
    CERT_REVOKED: 'Certificate has been revoked',
    DEPTH_ZERO_SELF_SIGNED_CERT: 'Self-signed certificate',
    SELF_SIGNED_CERT_IN_CHAIN: 'Self-signed certificate in chain',
    UNABLE_TO_VERIFY_LEAF_SIGNATURE: 'Incomplete chain: unable to verify the certificate',
    UNABLE_TO_GET_ISSUER_CERT_LOCALLY: 'Issuer certificate is not trusted',
    ERR_TLS_CERT_ALTNAME_INVALID: 'Hostname does not match the certificate',
}

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value
}

function certName(cert: tls.PeerCertificate): string {
    return first(cert.subject?.CN) || first(cert.subject?.O) || 'Unknown'
}

// Leaf first. A self-signed root points issuerCertificate back at itself.
function certChain(cert: tls.DetailedPeerCertificate): string[] {
    const chain: string[] = []
    const seen = new Set<string>()
    let current: tls.DetailedPeerCertificate | undefined = cert
    while (current?.fingerprint256 && !seen.has(current.fingerprint256) && chain.length < 10) {
        seen.add(current.fingerprint256)
        chain.push(certName(current))
        current = current.issuerCertificate
    }
    return chain
}

function describeAuthorizationError(error: unknown): string {
    // Typed as Error, but Node reports the verification code as a string
    const code = typeof error === 'string' ? error : (error as { code?: string; message?: string })?.code ?? String(error)
    return VALIDATION_ERRORS[code] ?? code
}

export async function checkSSL(host: string): Promise<SSLResult> {
    await requireAuth()

    host = host.trim()
    let address: string
    try {
        address = await resolvePublicHost(host)
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : String(err) }
    }

    return new Promise<SSLResult>((resolve) => {
        try {
            const socket = tls.connect({
                host: address,
                port: 443,
                // SNI must be a hostname; for IP targets Node checks the IP against the certificate
                servername: net.isIP(host) ? undefined : host,
                // Connect even to invalid certificates so they can be reported, then read socket.authorized
                rejectUnauthorized: false
            }, () => {
                const cert = socket.getPeerCertificate(true)
                if (!cert || !cert.valid_to) {
                    socket.destroy()
                    resolve({ success: false, error: 'The server did not present a certificate' })
                    return
                }

                const validTo = new Date(cert.valid_to)
                const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const authorized = socket.authorized

                socket.end()
                resolve({
                    success: true,
                    authorized,
                    validationError: authorized ? null : describeAuthorizationError(socket.authorizationError),
                    daysRemaining,
                    validFrom: cert.valid_from,
                    validTo: cert.valid_to,
                    issuer: first(cert.issuer.O) || first(cert.issuer.CN),
                    subject: first(cert.subject.CN),
                    altNames: cert.subjectaltname ? cert.subjectaltname.split(', ').map(name => name.replace(/^DNS:/, '')) : [],
                    chain: certChain(cert),
                    protocol: socket.getProtocol() || undefined,
                    grade: !authorized ? 'F' : daysRemaining > 60 ? 'A+' : daysRemaining > 30 ? 'B' : 'C'
                })
            })

            socket.on('error', (err) => {
                resolve({ success: false, error: err.message })
            })

            socket.setTimeout(5000, () => {
                socket.destroy()
                resolve({ success: false, error: 'Connection timed out' })
            })
        } catch (err) {
            resolve({ success: false, error: String(err) })
        }
    })
}
