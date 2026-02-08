import { Metadata } from 'next'
import HashGenerator from './client'

export const metadata: Metadata = {
  title: 'Hash Generator | MD5, SHA-256, SHA-512',
  description: 'Generate secure hashes efficiently. Supports MD5, SHA-1, SHA-256, and SHA-512. Fast, client-side, and privacy-focused.',
  keywords: ['hash generator', 'md5 hash', 'sha256 hash', 'sha512 generator', 'online hasher', 'cryptography tools'],
  openGraph: {
    title: 'Hash Generator | MD5, SHA-256, SHA-512',
    description: 'Compute cryptographic hashes instantly in your browser. Supports MD5, SHA-1, SHA-256, and more. 100% private.',
    url: 'https://labs.zekhoi.dev/hash',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/hash',
  }
}

export default function Page() {
  return <HashGenerator />
}
