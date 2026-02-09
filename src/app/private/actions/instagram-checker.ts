'use server'

import axios from 'axios'
import axiosRetry from 'axios-retry'
import { HttpsProxyAgent } from 'https-proxy-agent'

// Configure axios-retry
axiosRetry(axios, { retries: 1, retryDelay: axiosRetry.exponentialDelay })

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
    // Formatted Metadata strings
    ogTitle?: string
    ogDescription?: string
    metaDescription?: string
}

type InternalCheckResult = {
    exists: boolean
    httpCode: number
    message?: string
    proxyNode?: string
}

/**
 * Normalizes proxy string to http://user:pass@host:port
 * Matches logic in proxy-validator.ts
 */
function normalizeProxy(proxy: string): string {
    let p = proxy.trim()
    if (!p) return ''

    // Strip http:// or https:// if user provided it
    p = p.replace(/^https?:\/\//i, '')

    const parts = p.split(':')
    if (parts.length < 2) return ''

    // Handle host:port:user:pass
    if (parts.length === 4) {
        const host = parts[0]
        const port = parts[1]
        const user = parts[2]
        const pass = parts[3]
        return `http://${user}:${pass}@${host}:${port}`
    }

    // Handle user:pass:host:port
    if (parts.length === 4 && parts[1].length > 5) { // heuristics for port length
        // unlikely user:pass:host:port but possible
    }

    return `http://${p}`
}

/**
 * Verifies the proxy by fetching the exit IP
 */
async function getExitIp(proxyUrl: string): Promise<string> {
    try {
        const agent = new HttpsProxyAgent(proxyUrl)
        const response = await axios.get('https://api.ipify.org?format=json', {
            httpsAgent: agent,
            timeout: 5000
        })
        return response.data.ip || 'Unknown Exit'
    } catch {
        // Distinguish between timeout and other errors
        return 'Proxy Offline'
    }
}

interface InstagramUser {
    id: string
    username: string
    full_name: string
    biography: string
    profile_pic_url: string
    edge_followed_by: { count: number }
    edge_follow: { count: number }
    edge_owner_to_timeline_media: { count: number }
    is_private: boolean
    is_verified: boolean
}

function formatStat(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    return num.toString()
}

async function fetchProfileApi(username: string, proxy?: string): Promise<InternalCheckResult & { user?: InstagramUser }> {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`
    const normalizedProxy = proxy ? normalizeProxy(proxy) : undefined
    const agent = normalizedProxy ? new HttpsProxyAgent(normalizedProxy) : undefined

    let proxyNode = 'Direct'
    if (normalizedProxy) {
        proxyNode = await getExitIp(normalizedProxy)
        if (proxyNode === 'Proxy Offline' || proxyNode === 'Proxy Timeout') {
            return { exists: false, httpCode: 0, message: proxyNode, proxyNode }
        }
    }

    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                'x-ig-app-id': '936619743392459',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'x-asbd-id': '129477',
                'x-ig-www-claim': '0',
                'x-requested-with': 'XMLHttpRequest',
                'Referer': `https://www.instagram.com/${username}/`,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                "Cookie": "csrftoken=yaHxTiXr5qArRN7_m5eQJ_; datr=CGiJaaPWgiF9okN_SuRAtlIQ; ig_did=0AEC0F57-7767-46E0-9A33-D76C7982715B; mid=aYloCAALAAH6-CGY4Igfset0bznl; wd=2001x1274"
            },
            timeout: 15000,
            validateStatus: (status) => status < 500
        })

        const httpCode = response.status
        const data = response.data

        if (httpCode === 404) {
            return { exists: false, httpCode, message: "404: Not Found", proxyNode }
        }

        if (data?.data?.user) {
            return { exists: true, httpCode, message: "Active", proxyNode, user: data.data.user }
        }

        return { exists: false, httpCode, message: "API Error (Structure Mismatch)", proxyNode }
    } catch (e: any) {
        return { exists: false, httpCode: 500, message: e.message, proxyNode }
    }
}

export async function checkInstagram(username: string, proxy?: string): Promise<InstagramCheckResult> {
    const apiRes = await fetchProfileApi(username, proxy)

    if (apiRes.exists && apiRes.user) {
        const user = apiRes.user
        const followers = user.edge_followed_by.count
        const following = user.edge_follow.count
        const posts = user.edge_owner_to_timeline_media.count

        // Generate Instagram-style metadata strings
        const ogTitle = `${user.full_name} (@${user.username}) • Instagram photos and videos`
        const ogDescription = `${formatStat(followers)} Followers, ${formatStat(following)} Following, ${formatStat(posts)} Posts - See Instagram photos and videos from ${user.full_name} (@${user.username})`

        return {
            success: true,
            username,
            isSuspended: false,
            status: 'Active',
            httpCode: apiRes.httpCode,
            message: "Success (API)",
            proxyNode: apiRes.proxyNode,
            fullName: user.full_name,
            biography: user.biography,
            followers,
            following,
            posts,
            isPrivate: user.is_private,
            isVerified: user.is_verified,
            profilePicUrl: user.profile_pic_url,
            ogTitle,
            ogDescription
        }
    }

    const { httpCode, message, proxyNode } = apiRes
    const isError = httpCode === 429 || httpCode === 403 || httpCode >= 500 || httpCode === 0 || message?.includes('Blocked')

    return {
        success: true,
        username,
        isSuspended: httpCode === 404 || message === '404: Not Found' || message === 'User not found',
        status: isError ? 'Error' : 'Not Found',
        httpCode,
        message,
        proxyNode
    }
}
