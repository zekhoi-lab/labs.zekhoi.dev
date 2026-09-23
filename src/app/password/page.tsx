import { Metadata } from 'next'
import PasswordGenerator from './client'

export const metadata: Metadata = {
  title: 'Strong Password Generator | Secure & Random',
  description: 'Generate cryptographically strong random passwords instantly. Customize the length and character sets. 100% client-side.',
  keywords: ['password generator', 'strong password', 'random password', 'secure password', 'password creator', 'client-side password'],
  openGraph: {
    title: 'Strong Password Generator | Secure & Random',
    description: 'Create strong random passwords locally in your browser with the Web Crypto API. No servers, no logs.',
    url: 'https://labs.zekhoi.dev/password',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/password',
  }
}

export default function Page() {
  return <PasswordGenerator />
}
