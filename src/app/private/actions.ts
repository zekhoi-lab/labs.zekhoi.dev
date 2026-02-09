'use server'

import net from 'net'
import tls from 'tls'

// --- Header Analyzer ---
export async function analyzeHeaders(url: string) {
    try {
        if (!url.startsWith('http')) url = 'https://' + url
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' })
        const headers: Record<string, string> = {}
        res.headers.forEach((v, k) => (headers[k] = v))

        const securityHeaders = {
            'content-security-policy': 'Missing CSP',
            'strict-transport-security': 'Missing HSTS',
            'x-frame-options': 'Missing X-Frame-Options',
            'x-content-type-options': 'Missing X-Content-Type-Options',
            'referrer-policy': 'Missing Referrer-Policy',
            'permissions-policy': 'Missing Permissions-Policy',
        }

        const issues = []
        let score = 100

        for (const [header, msg] of Object.entries(securityHeaders)) {
            if (!headers[header]) {
                issues.push(msg)
                score -= 15
            }
        }

        return {
            success: true,
            headers,
            issues,
            score: Math.max(0, score),
            server: headers['server'] || 'Unknown',
            ip: 'Hidden',
            status: `${res.status} ${res.statusText}`
        }
    } catch (err) {
        return { success: false, error: String(err) }
    }
}

// --- Port Scanner ---
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

// --- SSL Checker ---
export async function checkSSL(host: string) {
    return new Promise<any>((resolve) => {
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
                    protocol: socket.getProtocol(),
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

// --- Web Scraper ---
export async function scrapeWeb(url: string) {
    try {
        if (!url.startsWith('http')) url = 'https://' + url
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZekhoiBot/1.0)' }
        })
        const html = await res.text()

        // Extract Title
        const titleMatch = html.match(/<title>(.*?)<\/title>/i)
        const title = titleMatch ? titleMatch[1] : 'No title found'

        // Extract Meta Description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i)
        const description = descMatch ? descMatch[1] : 'No description found'

        // Extract Links (limit to 10)
        const linkMatches = [...html.matchAll(/<a[^>]+href=["'](.*?)["']/gi)].slice(0, 10)
        const links = linkMatches.map(m => m[1])

        return {
            success: true,
            title,
            description,
            links,
            size: (html.length / 1024).toFixed(2),
            timestamp: new Date().toLocaleTimeString()
        }
    } catch (err) {
        return { success: false, error: String(err) }
    }
}

// --- Email Breach (Simulated) ---
export async function checkEmailBreach(email: string) {
    // In a real app, this would query HaveIBeenPwned API or similar
    await new Promise(r => setTimeout(r, 1500))

    // Deterministic simulation based on email length
    const isBreached = email.length % 2 === 0

    if (isBreached) {
        return {
            success: true,
            breached: true,
            count: 3,
            sources: [
                { name: 'LinkedIn', date: '2021-06-22', data: ['Email', 'Passwords'] },
                { name: 'Adobe', date: '2013-10-04', data: ['Email', 'Password Hints'] },
                { name: 'Canva', date: '2019-05-24', data: ['Email', 'Names', 'Cities'] }
            ]
        }
    } else {
        return {
            success: true,
            breached: false,
            count: 0,
            sources: []
        }
    }
}

// --- Instagram Checker (Simulated) ---
export async function checkInstagram(username: string) {
    // In a real app, this would use private Instagram API or scraping
    await new Promise(r => setTimeout(r, 2000))

    if (username.toLowerCase() === 'error') {
        return { success: false, error: 'User not found or private profile' }
    }

    return {
        success: true,
        username,
        followers: Math.floor(Math.random() * 50000) + 500,
        following: Math.floor(Math.random() * 1000) + 50,
        posts: Math.floor(Math.random() * 500) + 10,
        isPrivate: Math.random() > 0.8,
        isVerified: Math.random() > 0.9,
        bio: 'Digital Creator | Tech Enthusiast | Building things',
        engagement: (Math.random() * 5 + 1).toFixed(2) + '%'
    }
}

// --- Proxy Validator ---
export async function validateProxy(proxy: string) {
    return new Promise<any>((resolve) => {
        const parts = proxy.split(':')
        const host = parts[0]
        const port = parts[1]

        if (!host || !port) {
            resolve({ proxy, status: 'Invalid Format', latency: 0, anonymity: 'Unknown' })
            return
        }

        const start = Date.now()
        const socket = new net.Socket()
        socket.setTimeout(3000)

        socket.on('connect', () => {
            const latency = Date.now() - start
            socket.destroy()
            resolve({
                proxy,
                status: 'Active',
                latency,
                anonymity: latency < 100 ? 'Elite' : latency < 500 ? 'Anonymous' : 'Transparent',
                country: 'Unknown'
            })
        })

        socket.on('timeout', () => {
            socket.destroy()
            resolve({ proxy, status: 'Timeout', latency: 0, anonymity: '-' })
        })

        socket.on('error', () => {
            resolve({ proxy, status: 'Dead', latency: 0, anonymity: '-' })
        })

        socket.connect(Number(port), host)
    })
}

// --- WHOIS Monitor ---
export async function lookupWhois(domain: string) {
    return new Promise<any>((resolve) => {
        try {
            const tld = domain.split('.').pop()
            let server = 'whois.verisign-grs.com' // .com, .net
            if (tld === 'org') server = 'whois.pir.org'
            if (tld === 'io') server = 'whois.nic.io'
            if (tld === 'co') server = 'whois.nic.co'
            if (tld === 'ai') server = 'whois.nic.ai'

            const socket = new net.Socket()
            socket.connect(43, server, () => {
                socket.write(domain + '\r\n')
            })

            let data = ''
            socket.on('data', (chunk) => data += chunk.toString())

            socket.on('end', () => {
                const expiryMatch = data.match(/Registry Expiry Date: (.*)/i) || data.match(/Expiry Date: (.*)/i)
                const registrarMatch = data.match(/Registrar: (.*)/i)
                const nsMatches = [...data.matchAll(/Name Server: (.*)/gi)].map(m => m[1])

                resolve({
                    success: true,
                    domain,
                    registrar: registrarMatch ? registrarMatch[1].trim() : 'Unknown',
                    expiry: expiryMatch ? expiryMatch[1].trim() : 'Unknown',
                    nameservers: nsMatches.slice(0, 2),
                    raw: data
                })
            })

            socket.on('error', (err) => {
                resolve({ success: false, error: err.message })
            })

            socket.setTimeout(5000, () => {
                socket.destroy()
                resolve({ success: false, error: 'Timeout' })
            })

        } catch (err) {
            resolve({ success: false, error: String(err) })
        }
    })
}
