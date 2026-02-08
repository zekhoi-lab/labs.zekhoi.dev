import { Metadata } from 'next'
import UrlParser from './client'

export const metadata: Metadata = {
  title: 'URL Parser & Builder',
  description: 'Deconstruct URLs into protocol, host, path, and query parameters. Edit components to rebuild URLs easily.',
  keywords: ['url parser', 'query string editor', 'url decoder', 'url builder', 'parse url'],
  openGraph: {
    title: 'URL Parser & Builder',
    description: 'Deconstruct URLs into protocol, host, path, and query parameters. Edit components to rebuild URLs easily.',
    url: 'https://labs.zekhoi.dev/url',
    siteName: 'labs.zekhoi.dev',
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
