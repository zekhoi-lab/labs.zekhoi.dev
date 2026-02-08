import { Metadata } from 'next'
import UuidGenerator from './client'

export const metadata: Metadata = {
  title: 'UUID Generator | v4, v5, v6, v7',
  description: 'Generate cryptographically strong Universally Unique Identifiers (UUIDs) instantly. Supports v4 (random), v5 (name-based), v6 (time), and v7 (epoch).',
  keywords: ['uuid generator', 'uuid v4', 'uuid v7', 'guid generator', 'online uuid'],
  openGraph: {
    title: 'UUID Generator | v4, v5, v6, v7',
    description: 'Generate cryptographically strong Universally Unique Identifiers (UUIDs) instantly. Supports v4 (random), v5 (name-based), v6 (time), and v7 (epoch).',
    url: 'https://labs.zekhoi.dev/uuid',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/uuid',
  }
}

export default function Page() {
  return <UuidGenerator />
}
