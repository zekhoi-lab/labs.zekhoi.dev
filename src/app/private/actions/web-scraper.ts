'use server'

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
