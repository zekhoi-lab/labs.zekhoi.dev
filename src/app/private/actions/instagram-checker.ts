'use server'

import https from 'https'
import http from 'http'
import { HttpsProxyAgent } from 'https-proxy-agent'

export interface InstagramCheckResult {
    success: boolean
    username?: string
    error?: string
    isSuspended?: boolean
    status?: 'Active' | 'Not Found' | 'Error' | 'Queued' | 'Scanning'
    httpCode?: number
    message?: string
    proxyNode?: string // Displays Exit IP + Location info
    // Profile fields
    fullName?: string
    biography?: string
    profilePicUrl?: string
    followers?: number
    following?: number
    posts?: number
    isPrivate?: boolean
    isVerified?: boolean
}

interface InstagramUser {
    full_name: string
    biography: string
    profile_pic_url: string
    edge_followed_by?: { count: number }
    edge_follow?: { count: number }
    edge_owner_to_timeline_media?: { count: number }
    is_private: boolean
    is_verified: boolean
}

type InternalCheckResult = {
    exists: boolean
    user?: InstagramUser
    httpCode: number
    message?: string
    proxyNode?: string
}

/**
 * Normalizes proxy string to http://user:pass@host:port
 * Matches logic in proxy-validator.ts
 */
function normalizeProxy(proxy: string): string {
    const parts = proxy.trim().split(':')
    if (parts.length < 2) return ''

    const host = parts[0]
    const port = parts[1]

    if (parts.length === 4) {
        const user = parts[2]
        const pass = parts[3]
        return `http://${user}:${pass}@${host}:${port}`
    }

    return `http://${host}:${port}`
}

/**
 * Verifies the proxy by fetching the exit IP
 */
async function getExitIp(proxyUrl: string): Promise<string> {
    return new Promise((resolve) => {
        const agent = new HttpsProxyAgent(proxyUrl)
        const options = {
            method: 'GET',
            agent: agent,
            timeout: 5000
        }

        const req = https.get('https://api.ipify.org?format=json', options, (res) => {
            let data = ''
            res.on('data', (chunk) => data += chunk)
            res.on('end', () => {
                try {
                    const json = JSON.parse(data)
                    resolve(json.ip || 'Unknown Exit')
                } catch {
                    resolve('IP Check Failed')
                }
            })
        })

        req.on('error', () => resolve('Proxy Offline'))
        req.on('timeout', () => {
            req.destroy()
            resolve('Proxy Timeout')
        })
    })
}

async function fetchProfile(username: string, proxy?: string, count = 0): Promise<InternalCheckResult> {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`
    const normalizedProxy = proxy ? normalizeProxy(proxy) : undefined

    // Get Exit IP for verification if proxy is used
    let proxyNode = 'Direct'
    if (normalizedProxy) {
        proxyNode = await getExitIp(normalizedProxy)
        // If proxy is offline/timed out, don't even try IG
        if (proxyNode === 'Proxy Offline' || proxyNode === 'Proxy Timeout') {
            return { exists: false, httpCode: 0, message: proxyNode, proxyNode }
        }
    }

    const agent = normalizedProxy ? new HttpsProxyAgent(normalizedProxy) : undefined

    return new Promise((resolve) => {
        const options = {
            method: 'GET',
            headers: {
                'X-IG-App-ID': '936619743392459',
                'X-ASBD-ID': '359341',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0',
                'Accept': '*/*',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Sec-CH-UA': '"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
            },
            agent: agent,
            timeout: 20000
        }

        const req = https.request(url, options, (res) => {
            let data = ''
            res.on('data', (chunk) => data += chunk)
            res.on('end', () => {
                const httpCode = res.statusCode || 0

                // Status Logic Refinement
                if (httpCode === 429) {
                    resolve({ exists: false, httpCode, message: "Rate Limited (429)", proxyNode })
                    return
                }
                if (httpCode === 403 || httpCode === 401) {
                    resolve({ exists: false, httpCode, message: `Access Forbidden (${httpCode})`, proxyNode })
                    return
                }
                if (httpCode >= 500) {
                    resolve({ exists: false, httpCode, message: `Server Error (${httpCode})`, proxyNode })
                    return
                }
                if (httpCode === 404) {
                    resolve({ exists: false, httpCode, message: "User not found or suspended (404)", proxyNode })
                    return
                }

                if (!data) {
                    resolve({ exists: false, httpCode, message: `Empty response (${httpCode})`, proxyNode })
                    return
                }

                try {
                    const json = JSON.parse(data)
                    if (json && json.data && json.data.user) {
                        resolve({ exists: true, user: json.data.user as InstagramUser, httpCode, message: "Profile active", proxyNode })
                    } else {
                        // Sometimes 200 OK but "user not found" in JSON or "login required"
                        const isNoUser = json?.data?.user === null || json?.message === 'User not found'
                        resolve({
                            exists: false,
                            httpCode,
                            message: isNoUser ? "User not found" : "Blocked/Login Required",
                            proxyNode
                        })
                    }
                } catch {
                    resolve({ exists: false, httpCode, message: "Invalid JSON (Likely Blocked)", proxyNode })
                }
            })
        })

        req.on('error', async (e) => {
            if (count < 1) { // Retry once
                await new Promise(r => setTimeout(r, 1000))
                resolve(await fetchProfile(username, proxy, count + 1))
            } else {
                resolve({ exists: false, httpCode: 500, message: e.message, proxyNode })
            }
        })

        req.on('timeout', () => {
            req.destroy()
            resolve({ exists: false, httpCode: 408, message: "IG Request Timeout", proxyNode })
        })

        req.end()
    })
}

export async function checkInstagram(username: string, proxy?: string): Promise<InstagramCheckResult> {
    const { exists, user, httpCode, message, proxyNode } = await fetchProfile(username, proxy)

    if (!exists || !user) {
        // Differentiate between Not Found and Error/Rate Limit
        // HTTP 429, 403, 5xx, or 200 with a "Blocked/Login Required" message should be status: 'Error'
        const isError = httpCode === 429 || httpCode === 403 || httpCode >= 500 || httpCode === 0 || message?.includes('Blocked')

        return {
            success: true,
            username,
            isSuspended: httpCode === 404 || message === 'User not found',
            status: isError ? 'Error' : 'Not Found',
            httpCode,
            message,
            proxyNode
        }
    }

    return {
        success: true,
        username,
        isSuspended: false,
        status: 'Active',
        httpCode,
        message,
        proxyNode,
        fullName: user.full_name,
        biography: user.biography,
        profilePicUrl: user.profile_pic_url,
        followers: user.edge_followed_by?.count,
        following: user.edge_follow?.count,
        posts: user.edge_owner_to_timeline_media?.count,
        isPrivate: user.is_private,
        isVerified: user.is_verified
    }
}
