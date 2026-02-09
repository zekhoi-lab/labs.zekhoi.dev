'use server'

import http from 'http'

export interface ProxyResult {
    proxy: string
    status: string
    latency: number
    anonymity: string
    country?: string
    city?: string
    ip?: string
}

export async function validateProxy(proxy: string, timeout: number = 5000): Promise<ProxyResult> {
    const parts = proxy.split(':')
    if (parts.length < 2) {
        return { proxy, status: 'Invalid Format', latency: 0, anonymity: 'Unknown', country: '-' }
    }

    const proxyHost = parts[0]
    const proxyPort = parseInt(parts[1])
    let authHeader: string | undefined

    if (parts.length === 4) {
        const credentials = Buffer.from(`${parts[2]}:${parts[3]}`).toString('base64')
        authHeader = `Basic ${credentials}`
    }

    return new Promise((resolve) => {
        const start = Date.now()

        const options: http.RequestOptions = {
            hostname: proxyHost,
            port: proxyPort,
            path: 'http://ip-api.com/json',
            method: 'GET',
            headers: {
                'Host': 'ip-api.com',
                ...(authHeader ? { 'Proxy-Authorization': authHeader } : {})
            },
            timeout: timeout
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
                            resolve({ proxy, status: 'Active (API Limit)', latency, anonymity: 'Anonymous', country: '-', city: '-' })
                            return
                        }

                        resolve({
                            proxy,
                            status: 'Active',
                            latency,
                            anonymity: latency < 300 ? 'Elite' : latency < 1000 ? 'Anonymous' : 'Transparent',
                            country: json.country || 'Unknown',
                            city: json.city || 'Unknown',
                            ip: json.query
                        })
                    } catch (_e) {
                        resolve({ proxy, status: 'Active (Parse Error)', latency, anonymity: 'Unknown', country: '-' })
                    }
                } else {
                    resolve({ proxy, status: `Dead (${res.statusCode})`, latency: 0, anonymity: '-', country: '-' })
                }
            })
        })

        req.on('error', (_err) => {
            resolve({
                proxy,
                status: 'Dead',
                latency: 0,
                anonymity: '-',
                country: '-'
            })
        })

        req.on('timeout', () => {
            req.destroy()
            resolve({
                proxy,
                status: 'Timeout',
                latency: 0,
                anonymity: '-',
                country: '-'
            })
        })

        req.end()
    })
}
