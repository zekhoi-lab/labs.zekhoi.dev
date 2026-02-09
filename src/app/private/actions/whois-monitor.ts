'use server'

import net from 'net'


export interface WhoisResult {
    success: boolean
    domain?: string
    registrar?: string
    expiry?: string
    nameservers?: string[]
    raw?: string
    error?: string
}

async function queryWhois(domain: string, server: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket()
        let data = ''

        socket.setTimeout(5000)
        socket.connect(43, server, () => {
            socket.write(domain + '\r\n')
        })

        socket.on('data', (chunk) => data += chunk.toString())
        socket.on('end', () => resolve(data))
        socket.on('error', (err) => reject(err))
        socket.on('timeout', () => {
            socket.destroy()
            reject(new Error('Timeout'))
        })
    })
}

export async function lookupWhois(domain: string): Promise<WhoisResult> {
    try {
        // Step 0: Robust Input Cleaning
        let target = domain.trim().toLowerCase()
        // Strip protocols
        target = target.replace(/^(https?:\/\/)?(www\.)?/, '')
        // Strip trailing paths or slashes
        target = target.split('/')[0].split('?')[0]
        // Strip common prefixes from pasted text
        if (target.startsWith('domain:')) target = target.replace('domain:', '').trim()

        if (!target) return { success: false, error: 'Invalid or empty domain' }

        const parts = target.split('.')
        if (parts.length < 2) return { success: false, error: 'Invalid domain format' }
        const tld = parts[parts.length - 1]

        // Step 1: Query IANA for the TLD to find the registry server
        const ianaData = await queryWhois(tld, 'whois.iana.org')

        // Improved referral discovery patterns
        const referralMatch = ianaData.match(/refer:\s*(.*)/i) ||
            ianaData.match(/whois server:\s*(.*)/i) ||
            ianaData.match(/whois:\s*(.*)/i)

        let targetServer = referralMatch && referralMatch[1].trim() ? referralMatch[1].trim() : ''

        // Fallback: If IANA has no whois server, try heuristic nic.[tld] or common servers
        if (!targetServer) {
            if (tld === 'app' || tld === 'dev' || tld === 'page') targetServer = 'whois.nic.google'
            else if (tld === 'work') targetServer = 'whois.nic.work'
            else if (tld === 'online') targetServer = 'whois.centralnic.com'
            else targetServer = `whois.nic.${tld}`
        }

        // Clean target server string
        targetServer = targetServer.replace('whois://', '').split('/')[0].split(':')[0].trim()

        // Step 2: Query the actual registry server with the full target
        const data = await queryWhois(target, targetServer)

        // Step 3: Comprehensive Parsing
        const expiryMatch = data.match(/Registry Expiry Date: (.*)/i) ||
            data.match(/Expiry Date: (.*)/i) ||
            data.match(/Registry Expiry: (.*)/i) ||
            data.match(/expires:\s*(.*)/i) ||
            data.match(/Expiration Date: (.*)/i)

        const registrarMatch = data.match(/Registrar: (.*)/i) ||
            data.match(/registrar:\s*(.*)/i) ||
            data.match(/Sponsoring Registrar: (.*)/i)

        const nsMatches = [...data.matchAll(/Name Server: (.*)/gi)].map(m => m[1]) ||
            [...data.matchAll(/nserver:\s*(.*)/gi)].map(m => m[1]) ||
            [...data.matchAll(/nameserver:\s*(.*)/gi)].map(m => m[1])

        return {
            success: true,
            domain: target,
            registrar: registrarMatch ? registrarMatch[1].trim() : 'Unknown',
            expiry: expiryMatch ? expiryMatch[1].trim() : 'Unknown',
            nameservers: nsMatches.slice(0, 4).map(ns => ns.trim().split(' ')[0]),
            raw: data
        }

    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
}
