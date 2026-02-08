import { Metadata } from 'next'
import UuidGenerator from './client'

export const metadata: Metadata = {
  title: 'UUID Generator | v4, v6, v7 Online Tool',
  description: 'Generate cryptographically strong UUIDs (v4, v6, v7) instantly in your browser. Features bulk generation, custom namespaces, and one-click copying. No ads.',
  keywords: ['uuid generator', 'generate uuid', 'uuid v4', 'uuid v7', 'guid generator', 'bulk uuid', 'developer tools'],
  openGraph: {
    title: 'UUID Generator | v4, v6, v7 Online Tool',
    description: 'Generate cryptographically strong UUIDs instantly. Supports v4 (random), v6 (time-ordered), and v7 (Unix Epoch). Free and privacy-focused.',
    url: 'https://labs.zekhoi.dev/uuid',
    siteName: 'Labs by zekhoi',
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
