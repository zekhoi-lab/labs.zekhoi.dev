import { Metadata } from 'next'
import Base64Converter from './client'

export const metadata: Metadata = {
  title: 'Base64 Converter | Encode & Decode Online',
  description: 'The fastest Base64 encoder and decoder. Convert text, images, and files instantly. key features: file drop support, URL safety, and privacy.',
  keywords: ['base64 encode', 'base64 decode', 'base64 converter', 'image to base64', 'file to base64', 'developer tools'],
  openGraph: {
    title: 'Base64 Converter | Encode & Decode Online',
    description: 'Encode and decode Base64 data instantly. Supports large files, images, and text. No data leaves your browser.',
    url: 'https://labs.zekhoi.dev/base64',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/base64',
  }
}

export default function Page() {
  return <Base64Converter />
}
