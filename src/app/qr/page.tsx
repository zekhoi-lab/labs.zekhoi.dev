import { Metadata } from 'next'
import QrGenerator from './client'

export const metadata: Metadata = {
  title: 'QR Code Generator | Free, No Tracking',
  description: 'Turn text or a URL into a QR code with adjustable error correction, size, and margin. Download it as PNG or SVG. Generated in your browser.',
  keywords: ['qr code generator', 'qr code maker', 'url to qr code', 'svg qr code', 'png qr code', 'free qr code'],
  openGraph: {
    title: 'QR Code Generator | Free, No Tracking',
    description: 'Create QR codes from text or URLs and download them as PNG or SVG. Nothing leaves your browser.',
    url: 'https://labs.zekhoi.dev/qr',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/qr',
  }
}

export default function Page() {
  return <QrGenerator />
}
