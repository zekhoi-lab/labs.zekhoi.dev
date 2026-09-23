// IPv4 subnet maths on unsigned 32-bit integers (`>>> 0` keeps them unsigned)

export interface CidrInfo {
    address: string
    prefix: number
    network: string
    broadcast: string
    firstHost: string
    lastHost: string
    usableHosts: number
    totalAddresses: number
    netmask: string
    wildcard: string
    binaryAddress: string
    binaryNetmask: string
    type: string
}

export type CidrResult = { ok: true; info: CidrInfo } | { ok: false; error: string }

// Most specific first; the first range containing the address names it
const RANGES: [string, number, string][] = [
    ['127.0.0.0', 8, 'Loopback'],
    ['10.0.0.0', 8, 'Private (RFC 1918)'],
    ['172.16.0.0', 12, 'Private (RFC 1918)'],
    ['192.168.0.0', 16, 'Private (RFC 1918)'],
    ['169.254.0.0', 16, 'Link-local'],
    ['100.64.0.0', 10, 'Shared (CGNAT, RFC 6598)'],
    ['192.0.2.0', 24, 'Documentation (TEST-NET)'],
    ['198.51.100.0', 24, 'Documentation (TEST-NET)'],
    ['203.0.113.0', 24, 'Documentation (TEST-NET)'],
    ['198.18.0.0', 15, 'Benchmarking'],
    ['0.0.0.0', 8, 'This network'],
    ['224.0.0.0', 4, 'Multicast'],
    ['240.0.0.0', 4, 'Reserved'],
]

const prefixToMask = (prefix: number) => (prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0)

export function parseIpv4(text: string): number | null {
    const parts = text.split('.')
    if (parts.length !== 4) return null
    let value = 0
    for (const part of parts) {
        // No leading zeros: "010" is octal in some tools and ambiguous
        if (!/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255) return null
        value = value * 256 + Number(part)
    }
    return value >>> 0
}

export function formatIpv4(value: number): string {
    return [24, 16, 8, 0].map(shift => (value >>> shift) & 255).join('.')
}

const toBinary = (value: number) =>
    [24, 16, 8, 0].map(shift => ((value >>> shift) & 255).toString(2).padStart(8, '0')).join('.')

// A dotted mask is valid only if its ones are contiguous from the left
function maskToPrefix(mask: number): number | null {
    for (let prefix = 0; prefix <= 32; prefix++) {
        if (prefixToMask(prefix) === mask) return prefix
    }
    return null
}

function addressType(address: number): string {
    for (const [network, prefix, name] of RANGES) {
        const mask = prefixToMask(prefix)
        if (((address & mask) >>> 0) === parseIpv4(network)) return name
    }
    return 'Public'
}

// Accepts "a.b.c.d/n", "a.b.c.d/255.255.255.0", "a.b.c.d 255.255.255.0" or a bare address (/32)
export function calculateCidr(input: string): CidrResult {
    const match = /^\s*([\d.]+)\s*(?:(?:\/|\s)\s*([\d.]+))?\s*$/.exec(input)
    if (!match) return { ok: false, error: 'Enter an IPv4 address with a prefix, e.g. 192.168.1.0/24' }

    const address = parseIpv4(match[1])
    if (address === null) return { ok: false, error: `"${match[1]}" is not a valid IPv4 address` }

    let prefix = 32
    if (match[2] !== undefined) {
        if (match[2].includes('.')) {
            const mask = parseIpv4(match[2])
            const fromMask = mask === null ? null : maskToPrefix(mask)
            if (fromMask === null) return { ok: false, error: `"${match[2]}" is not a valid netmask` }
            prefix = fromMask
        } else {
            prefix = Number(match[2])
            if (!/^\d{1,2}$/.test(match[2]) || prefix > 32) return { ok: false, error: 'The prefix length must be between 0 and 32' }
        }
    }

    const mask = prefixToMask(prefix)
    const network = (address & mask) >>> 0
    const broadcast = (network | (~mask >>> 0)) >>> 0
    const totalAddresses = 2 ** (32 - prefix)

    // /31 point-to-point links use both addresses (RFC 3021); a /32 is one host
    const [firstHost, lastHost, usableHosts] =
        prefix >= 31 ? [network, broadcast, totalAddresses] : [network + 1, broadcast - 1, totalAddresses - 2]

    return {
        ok: true,
        info: {
            address: formatIpv4(address),
            prefix,
            network: formatIpv4(network),
            broadcast: formatIpv4(broadcast),
            firstHost: formatIpv4(firstHost),
            lastHost: formatIpv4(lastHost),
            usableHosts,
            totalAddresses,
            netmask: formatIpv4(mask),
            wildcard: formatIpv4(~mask >>> 0),
            binaryAddress: toBinary(address),
            binaryNetmask: toBinary(mask),
            type: addressType(address),
        },
    }
}
