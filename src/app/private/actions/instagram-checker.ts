'use server'

import axios from 'axios'
import axiosRetry from 'axios-retry'
import { HttpsProxyAgent } from 'https-proxy-agent'
import * as cheerio from 'cheerio'

// Configure axios-retry
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on 429 (Rate Limit) in addition to default network/5xx errors
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429
    }
})

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

async function fetchProfileApi(username: string, proxy?: string): Promise<InternalCheckResult & { htmlData?: any }> {
    const url = `https://www.instagram.com/${username}/`
    const normalizedProxy = proxy ? normalizeProxy(proxy) : undefined
    const agent = normalizedProxy ? new HttpsProxyAgent(normalizedProxy) : undefined
    const proxyNode = normalizedProxy ? 'Proxy' : 'Direct'

    try {
        const response = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.7",
                "Cache-Control": "max-age=0",
                Cookie: "csrftoken=8itmfqOZ9pW8bR42I3y9Wk; ig_did=0C826C21-17C3-444A-ABB7-EBABD37214D7; mid=ZvL-IgAEAAGfkZ0euP6AF4ra66Mr; wd=911x794",
                Priority: "u=0, i",
                Referer: `https://www.instagram.com/${username}/`,
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            },
            timeout: 5000,
            validateStatus: (status) => status < 500
        })

        const httpCode = response.status
        const html = response.data

        if (httpCode === 404) {
            return { exists: false, httpCode, message: "404: Not Found", proxyNode }
        }

        if (httpCode === 429) {
            return { exists: false, httpCode, message: "Rate Limited (429)", proxyNode }
        }

        const $ = cheerio.load(html)
        const redirectUrl = $("link[rel='alternate']").attr("href")
        const isRedirected = redirectUrl?.includes("instagram.com/accounts/login")

        if (isRedirected) {
            return { exists: false, httpCode, message: "Blocked (Login Wall)", proxyNode }
        }

        // Extract metadata as fallback for status
        const ogTitle = $('meta[property="og:title"]').attr('content')
        const ogDescription = $('meta[property="og:description"]').attr('content')
        const metaDescription = $('meta[name="description"]').attr('content')

        // If og:title contains "Page Not Found" or is missing, it's likely the account doesn't exist
        if (ogTitle?.toLowerCase().includes('page not found') || ogTitle?.toLowerCase().includes('not found')) {
            return { exists: false, httpCode, message: "User not found", proxyNode }
        }

        if (ogTitle || ogDescription || metaDescription) {
            return {
                exists: true,
                httpCode,
                message: "Active",
                proxyNode,
                htmlData: { ogTitle, ogDescription, metaDescription }
            }
        }

        // If no metadata found at all on a 200 page, it's either suspended or deleted
        return { exists: false, httpCode, message: "User not found", proxyNode }
    } catch (e: any) {
        return { exists: false, httpCode: 500, message: e.message, proxyNode }
    }
}

export async function checkInstagram(username: string, proxy?: string): Promise<InstagramCheckResult> {
    const apiRes = await fetchProfileApi(username, proxy)

    if (apiRes.exists && apiRes.htmlData) {
        const ogTitle = apiRes.htmlData.ogTitle || ''
        const ogDesc = apiRes.htmlData.ogDescription || apiRes.htmlData.metaDescription || ''

        // Clean Title: "Name (@user) • Instagram..." -> "Name"
        const fullName = ogTitle.split(' (@')[0].split(' • ')[0]

        // Clean Description: "Followers, Following, Posts - See..." -> "Followers, Following, Posts"
        const cleanDesc = ogDesc.split(' - ')[0]

        return {
            success: true,
            username,
            isSuspended: false,
            status: 'Active',
            httpCode: apiRes.httpCode,
            message: "Success (HTML)",
            proxyNode: apiRes.proxyNode,
            fullName,
            ogTitle: apiRes.htmlData.ogTitle, // Keep original for reference if needed
            ogDescription: cleanDesc
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
