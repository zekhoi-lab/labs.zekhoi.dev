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

export async function lookupWhois(domain: string): Promise<WhoisResult> {
    return new Promise<WhoisResult>((resolve) => {
        try {
            const tld = domain.split('.').pop()
            let server = 'whois.verisign-grs.com' // .com, .net
            if (tld === 'org') server = 'whois.pir.org'
            if (tld === 'io') server = 'whois.nic.io'
            if (tld === 'co') server = 'whois.nic.co'
            if (tld === 'ai') server = 'whois.nic.ai'

            const socket = new net.Socket()
            socket.connect(43, server, () => { // Fixed typo constnect -> connect manually if tool failed, but tool works. wait. typo in replacement content? NO. 'socket.connect' is correct in original. I carefully typed replacement. Wait. I see 'constnect' in my thought trace? No. 'socket.connect'. Ah, I should be careful.
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
