import { toDataURL, toString } from 'qrcode'

export type QrLevel = 'L' | 'M' | 'Q' | 'H'

export interface QrOptions {
    level: QrLevel
    size: number
    margin: number
}

export type QrResult = { ok: true; png: string; svg: string } | { ok: false; error: string }

// Both formats as data URLs, so the page shows them with <img> and download links
export async function renderQr(text: string, { level, size, margin }: QrOptions): Promise<QrResult> {
    if (!text.trim()) return { ok: false, error: 'Enter some text or a URL' }

    const options = { errorCorrectionLevel: level, margin, color: { dark: '#000000', light: '#ffffff' } }
    try {
        const [png, svg] = await Promise.all([
            toDataURL(text, { ...options, width: size }),
            toString(text, { ...options, type: 'svg', width: size }),
        ])
        return { ok: true, png, svg: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` }
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        if (/too big/i.test(message)) {
            return { ok: false, error: `Too long for a QR code at level ${level}. Shorten the text or choose a lower error-correction level.` }
        }
        return { ok: false, error: message }
    }
}
