import { Metadata } from 'next'
import JwtDebugger from './client'

export const metadata: Metadata = {
  title: 'JWT Debugger & Decoder',
  description: 'Decode, inspect, and debug JSON Web Tokens (JWT) in real-time. Verify signatures (HS256) and view payload claims.',
  keywords: ['jwt debugger', 'jwt decoder', 'json web token', 'jwt verify', 'inspect jwt'],
  openGraph: {
    title: 'JWT Debugger & Decoder',
    description: 'Decode, inspect, and debug JSON Web Tokens (JWT) in real-time. Verify signatures (HS256) and view payload claims.',
    url: 'https://labs.zekhoi.dev/jwt',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/jwt',
  }
}

export default function Page() {
  return <JwtDebugger />
}
