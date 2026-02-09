'use server'

import { HttpsProxyAgent } from 'https-proxy-agent'
import { Agent } from 'https'

export interface ProxyResult {
    proxy: string
    status: string
    latency: number
    anonymity: string
    country?: string
    city?: string
    ip?: string
}

export async function validateProxy(proxy: string): Promise<ProxyResult> {
    const parts = proxy.split(':')
    if (parts.length < 2) {
        return { proxy, status: 'Invalid Format', latency: 0, anonymity: 'Unknown', country: '-' }
    }

    // Construct proxy URL
    let proxyUrl = `http://${proxy}`
    // If username/password provided (IP:PORT:USER:PASS)
    if (parts.length === 4) {
        proxyUrl = `http://${parts[2]}:${parts[3]}@${parts[0]}:${parts[1]}`
    }

    const agent = new HttpsProxyAgent(proxyUrl)
    const start = Date.now()

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        //ip-api.com is http only for free tier, perfect for testing proxy connectivity
        const fetchOptions: RequestInit & { agent?: Agent } = {
            agent: agent,
            signal: controller.signal,
            cache: 'no-store'
        }

        const res = await fetch('http://ip-api.com/json', fetchOptions)

        clearTimeout(timeoutId)

        const latency = Date.now() - start

        if (res.ok) {
            const data = await res.json()
            return {
                proxy,
                status: 'Active',
                latency,
                anonymity: latency < 300 ? 'Elite' : latency < 1000 ? 'Anonymous' : 'Transparent',
                country: data.country || 'Unknown',
                city: data.city || 'Unknown',
                ip: data.query // The IP seen by the endpoint (exit IP)
            }
        } else {
            return { proxy, status: 'Dead (HTTP Error)', latency: 0, anonymity: '-', country: '-' }
        }
    } catch (error: unknown) {
        const err = error as Error
        return {
            proxy,
            status: err.name === 'AbortError' ? 'Timeout' : 'Dead',
            latency: 0,
            anonymity: '-',
            country: '-'
        }
    }
}
