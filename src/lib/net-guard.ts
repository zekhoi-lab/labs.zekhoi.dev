import { lookup } from 'dns/promises'
import net from 'net'

// Ranges that must never be reachable from the network tools (loopback,
// RFC1918, link-local / cloud metadata, CGNAT, multicast, reserved, etc).
const blockList = new net.BlockList()

const IPV4_RANGES: [string, number][] = [
    ['0.0.0.0', 8],
    ['10.0.0.0', 8],
    ['100.64.0.0', 10],
    ['127.0.0.0', 8],
    ['169.254.0.0', 16],
    ['172.16.0.0', 12],
    ['192.0.0.0', 24],
    ['192.0.2.0', 24],
    ['192.168.0.0', 16],
    ['198.18.0.0', 15],
    ['198.51.100.0', 24],
    ['203.0.113.0', 24],
    ['224.0.0.0', 4],
    ['240.0.0.0', 4],
]

const IPV6_RANGES: [string, number][] = [
    ['::', 128],
    ['::1', 128],
    ['64:ff9b::', 96],
    ['100::', 64],
    ['2001:db8::', 32],
    ['fc00::', 7],
    ['fe80::', 10],
    ['ff00::', 8],
]

for (const [addr, prefix] of IPV4_RANGES) blockList.addSubnet(addr, prefix, 'ipv4')
for (const [addr, prefix] of IPV6_RANGES) blockList.addSubnet(addr, prefix, 'ipv6')

export function isPrivateAddress(address: string): boolean {
    // Unwrap IPv4-mapped IPv6 (::ffff:127.0.0.1)
    const mapped = address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) address = mapped[1]

    const family = net.isIP(address)
    if (family === 4) return blockList.check(address, 'ipv4')
    if (family === 6) return blockList.check(address, 'ipv6')
    return true
}

/**
 * Resolves a hostname and rejects it if any resolved address is internal.
 * Returns a vetted address; connect to it directly (instead of the hostname)
 * so a second DNS lookup can't be rebound to an internal IP.
 */
export async function resolvePublicHost(host: string): Promise<string> {
    const hostname = host.trim().replace(/^\[|\]$/g, '')
    if (!hostname) throw new Error('Host is required')

    const addresses = net.isIP(hostname)
        ? [{ address: hostname }]
        : await lookup(hostname, { all: true, verbatim: true })

    if (addresses.length === 0) throw new Error(`Could not resolve ${hostname}`)

    for (const { address } of addresses) {
        if (isPrivateAddress(address)) {
            throw new Error(`Blocked: ${hostname} resolves to a private or reserved address`)
        }
    }

    return addresses[0].address
}

/**
 * fetch() that only talks to public hosts, re-checking every redirect hop.
 */
export async function safeFetch(url: string, init: RequestInit = {}, maxRedirects = 5): Promise<Response> {
    let current = new URL(url)

    for (let hop = 0; hop <= maxRedirects; hop++) {
        if (current.protocol !== 'http:' && current.protocol !== 'https:') {
            throw new Error(`Blocked: unsupported protocol ${current.protocol}`)
        }
        await resolvePublicHost(current.hostname)

        const res = await fetch(current, { ...init, redirect: 'manual' })
        const location = res.headers.get('location')

        if (res.status >= 300 && res.status < 400 && location) {
            current = new URL(location, current)
            continue
        }
        return res
    }

    throw new Error('Too many redirects')
}
