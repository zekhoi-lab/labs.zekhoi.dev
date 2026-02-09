'use server'

import tls from 'tls'


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

export async function checkSSL(host: string): Promise<SSLResult> {
    return new Promise<SSLResult>((resolve) => {
        try {
            const socket = tls.connect({
                host,
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
                    issuer: cert.issuer.O || cert.issuer.CN,
                    subject: cert.subject.CN,
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
