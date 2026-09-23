'use server'

import net from 'net'
import { requireAuth } from '@/lib/auth'
import { resolvePublicHost } from '@/lib/net-guard'


export interface PortScanResult {
    port: number
    status: 'open' | 'closed'
    service?: string
    error?: string
}

export async function scanPort(host: string, port: number): Promise<PortScanResult> {
    await requireAuth()

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        return { port, status: 'closed', error: 'Invalid port' }
    }

    let address: string
    try {
        address = await resolvePublicHost(host)
    } catch (err) {
        return { port, status: 'closed', error: err instanceof Error ? err.message : String(err) }
    }

    return new Promise<PortScanResult>((resolve) => {
        const socket = new net.Socket()
        socket.setTimeout(2000)

        socket.on('connect', () => {
            socket.destroy()
            resolve({ port, status: 'open', service: getService(port) })
        })

        socket.on('timeout', () => {
            socket.destroy()
            resolve({ port, status: 'closed' })
        })

        socket.on('error', () => {
            resolve({ port, status: 'closed' })
        })

        socket.connect(port, address)
    })
}

function getService(port: number) {
    const services: Record<number, string> = {
        21: 'ftp', 22: 'ssh', 23: 'telnet', 25: 'smtp', 53: 'dns',
        80: 'http', 110: 'pop3', 143: 'imap', 443: 'https',
        3306: 'mysql', 5432: 'postgresql', 6379: 'redis',
        8080: 'http-proxy', 27017: 'mongodb'
    }
    return services[port] || 'unknown'
}
