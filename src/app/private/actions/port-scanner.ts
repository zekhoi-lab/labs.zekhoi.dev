'use server'

import net from 'net'

export async function scanPort(host: string, port: number) {
    return new Promise<{ port: number, status: 'open' | 'closed', service?: string }>((resolve) => {
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

        socket.connect(port, host)
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
