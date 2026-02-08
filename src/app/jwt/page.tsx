import { Metadata } from 'next'
import JwtDebugger from './client'

export const metadata: Metadata = {
  title: 'JWT Debugger | Decode & Inspect Tokens',
  description: 'Decode, verify, and debug JSON Web Tokens (JWT) instantly. Inspect headers, payloads, and signatures. Offline-first and privacy-focused.',
  keywords: ['jwt debugger', 'decode jwt', 'jwt token', 'json web token', 'jwt inspector', 'verify jwt signature', 'developer tools'],
  openGraph: {
    title: 'JWT Debugger | Decode & Inspect Tokens',
    description: 'The fastest way to debug JWTs. Decode tokens, verify signatures, and inspect claims. No data leaves your browser.',
    url: 'https://labs.zekhoi.dev/jwt',
    siteName: 'Labs by zekhoi',
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
