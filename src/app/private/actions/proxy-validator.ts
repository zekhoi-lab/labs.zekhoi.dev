'use server'

import net from 'net'


export interface ProxyResult {
    proxy: string
    status: string
    latency: number
    anonymity: string
    country?: string
}

export async function validateProxy(proxy: string): Promise<ProxyResult> {
    return new Promise<ProxyResult>((resolve) => {
        const parts = proxy.split(':')
        const host = parts[0]
        const port = parts[1]

        if (!host || !port) {
            resolve({ proxy, status: 'Invalid Format', latency: 0, anonymity: 'Unknown', country: '-' })
            return
        }

        const start = Date.now()
        const socket = new net.Socket()
        socket.setTimeout(3000)

        socket.on('connect', async () => {
            const latency = Date.now() - start
            socket.destroy()

            let country = 'Unknown'
            try {
                const geoRes = await fetch(`http://ip-api.com/json/${host}`)
                if (geoRes.ok) {
                    const geoData = await geoRes.json()
                    country = geoData.country || 'Unknown'
                }
            } catch {
                // Ignore geo fetch errors
            }

            resolve({
                proxy,
                status: 'Active',
                latency,
                anonymity: latency < 100 ? 'Elite' : latency < 500 ? 'Anonymous' : 'Transparent',
                country
            })
        })

        socket.on('timeout', () => {
            socket.destroy()
            resolve({ proxy, status: 'Timeout', latency: 0, anonymity: '-', country: '-' })
        })

        socket.on('error', () => {
            resolve({ proxy, status: 'Dead', latency: 0, anonymity: '-', country: '-' })
        })

        socket.connect(Number(port), host)
    })
}
