'use server'

import http from 'http'
import { requireAuth } from '@/lib/auth'
import { resolvePublicHost } from '@/lib/net-guard'

export interface ProxyResult {
    proxy: string
    status: string
    latency: number
    speed: string
    country?: string
    city?: string
    ip?: string
}

// Only a latency tier: this check can't tell whether a proxy hides your IP
function speedTier(latency: number): string {
    return latency < 300 ? 'Fast' : latency < 1000 ? 'Medium' : 'Slow'
}

export async function validateProxy(proxy: string, timeout: number = 5000): Promise<ProxyResult> {
    await requireAuth()

    const parts = proxy.split(':')
    if (parts.length < 2) {
        return { proxy, status: 'Invalid Format', latency: 0, speed: 'Unknown', country: '-' }
    }

    const proxyHost = parts[0]
    const proxyPort = parseInt(parts[1])
    if (!Number.isInteger(proxyPort) || proxyPort < 1 || proxyPort > 65535) {
        return { proxy, status: 'Invalid Format', latency: 0, speed: 'Unknown', country: '-' }
    }

    let proxyAddress: string
    try {
        proxyAddress = await resolvePublicHost(proxyHost)
    } catch {
        return { proxy, status: 'Blocked (Private Address)', latency: 0, speed: '-', country: '-' }
    }
    let authHeader: string | undefined

    if (parts.length === 4) {
        const credentials = Buffer.from(`${parts[2]}:${parts[3]}`).toString('base64')
        authHeader = `Basic ${credentials}`
    }

    return new Promise((resolve) => {
        const start = Date.now()

        const options: http.RequestOptions = {
            hostname: proxyAddress,
            port: proxyPort,
            path: 'http://ip-api.com/json',
            method: 'GET',
            headers: {
                'Host': 'ip-api.com',
                ...(authHeader ? { 'Proxy-Authorization': authHeader } : {})
            },
            timeout: Math.min(Math.max(timeout, 1000), 30000)
        }

        const req = http.request(options, (res) => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk
            })

            res.on('end', () => {
                const latency = Date.now() - start

                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data)
                        if (json.status === 'fail') {
                            resolve({ proxy, status: 'Active (API Limit)', latency, speed: speedTier(latency), country: '-', city: '-' })
                            return
                        }

                        resolve({
                            proxy,
                            status: 'Active',
                            latency,
                            speed: speedTier(latency),
                            country: json.country || 'Unknown',
                            city: json.city || 'Unknown',
                            ip: json.query
                        })
                    } catch {
                        resolve({ proxy, status: 'Active (Parse Error)', latency, speed: 'Unknown', country: '-' })
                    }
                } else {
                    resolve({ proxy, status: `Dead (${res.statusCode})`, latency: 0, speed: '-', country: '-' })
                }
            })
        })

        req.on('error', () => {
            resolve({
                proxy,
                status: 'Dead',
                latency: 0,
                speed: '-',
                country: '-'
            })
        })

        req.on('timeout', () => {
            req.destroy()
            resolve({
                proxy,
                status: 'Timeout',
                latency: 0,
                speed: '-',
                country: '-'
            })
        })

        req.end()
    })
}
