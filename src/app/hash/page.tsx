import { Metadata } from 'next'
import HashGenerator from './client'

export const metadata: Metadata = {
  title: 'Hash Generator (MD5, SHA-256)',
  description: 'Compute hashes using common algorithms like MD5, SHA-1, SHA-256, and SHA-512. Secure local hashing.',
  keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'sha512 hash', 'online hasher'],
  openGraph: {
    title: 'Hash Generator (MD5, SHA-256)',
    description: 'Compute hashes using common algorithms like MD5, SHA-1, SHA-256, and SHA-512. Secure local hashing.',
    url: 'https://labs.zekhoi.dev/hash',
    siteName: 'labs.zekhoi.dev',
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
