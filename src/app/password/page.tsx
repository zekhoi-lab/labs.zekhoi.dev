import { Metadata } from 'next'
import PasswordGenerator from './client'

export const metadata: Metadata = {
  title: 'Secure Password Generator',
  description: 'Create strong, secure passwords locally in your browser. Customize length, characters, and complexity settings.',
  keywords: ['password generator', 'secure password', 'random password', 'strong password maker'],
  openGraph: {
    title: 'Secure Password Generator',
    description: 'Create strong, secure passwords locally in your browser. Customize length, characters, and complexity settings.',
    url: 'https://labs.zekhoi.dev/password',
    siteName: 'labs.zekhoi.dev',
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
