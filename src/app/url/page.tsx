import { Metadata } from 'next'
import UrlParser from './client'

export const metadata: Metadata = {
  title: 'URL Parser & Builder | Decode & Edit',
  description: 'Deconstruct, analyze, and modify URLs easily. View query parameters, protocols, and paths. Perfect for debugging complex links.',
  keywords: ['url parser', 'query string editor', 'url decoder', 'url builder', 'parse url', 'debug url'],
  openGraph: {
    title: 'URL Parser & Builder | Decode & Edit',
    description: 'Analyze and modify URLs instantly. Break down links into readable components. No headers required.',
    url: 'https://labs.zekhoi.dev/url',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/url',
  }
}

export default function Page() {
  return <UrlParser />
}
