import { Metadata } from 'next'
import Base64Converter from './client'

export const metadata: Metadata = {
  title: 'Base64 Converter | Encode & Decode Online',
  description: 'Encode and decode Base64 in your browser. Full UTF-8 support for emoji and special characters, and your data never leaves the page.',
  keywords: ['base64 encode', 'base64 decode', 'base64 converter', 'image to base64', 'file to base64', 'developer tools'],
  openGraph: {
    title: 'Base64 Converter | Encode & Decode Online',
    description: 'Encode and decode Base64 text instantly, with UTF-8 support. No data leaves your browser.',
    url: 'https://labs.zekhoi.dev/base64',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/base64',
  }
}

export default function Page() {
  return <Base64Converter />
}
