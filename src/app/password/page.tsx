import { Metadata } from 'next'
import PasswordGenerator from './client'

export const metadata: Metadata = {
  title: 'Strong Password Generator | Secure & Random',
  description: 'Generate uncrackable, cryptographically strong passwords instantly. Customize length, symbols, and ambiguity. 100% client-side for maximum security.',
  keywords: ['password generator', 'strong password', 'random password', 'secure password', 'password creator', 'client-side password'],
  openGraph: {
    title: 'Strong Password Generator | Secure & Random',
    description: 'Create military-grade passwords locally in your browser. No servers, no logs, just security. Fully customizable.',
    url: 'https://labs.zekhoi.dev/password',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/password',
  }
}

export default function Page() {
  return <PasswordGenerator />
}
