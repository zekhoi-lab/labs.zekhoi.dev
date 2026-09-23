'use server'

import tls from 'tls'
import { requireAuth } from '@/lib/auth'
import { resolvePublicHost } from '@/lib/net-guard'


export interface SSLResult {
    success: boolean
    daysRemaining?: number
    validFrom?: string | null
    validTo?: string | null
    issuer?: string | null
    subject?: string | null
    protocol?: string
    grade?: string
    error?: string
}

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value
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
                servername: host,
                rejectUnauthorized: false
            }, () => {
                const cert = socket.getPeerCertificate(true)
                const validTo = new Date(cert.valid_to)
                const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

                socket.end()
                resolve({
                    success: true,
                    daysRemaining,
                    validFrom: cert.valid_from,
                    validTo: cert.valid_to,
                    issuer: first(cert.issuer.O) || first(cert.issuer.CN),
                    subject: first(cert.subject.CN),
                    protocol: socket.getProtocol() || undefined,
                    grade: daysRemaining > 60 ? 'A+' : daysRemaining > 30 ? 'B' : 'F'
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
