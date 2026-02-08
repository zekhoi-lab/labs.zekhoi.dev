import { Metadata } from 'next'
import Base64Converter from './client'

export const metadata: Metadata = {
  title: 'Base64 Encode & Decode',
  description: 'Fast and secure Base64 encoder and decoder. Supports UTF-8 characters and file inputs. Process data locally.',
  keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'string to base64', 'base64 to text'],
  openGraph: {
    title: 'Base64 Encode & Decode',
    description: 'Fast and secure Base64 encoder and decoder. Supports UTF-8 characters and file inputs. Process data locally.',
    url: 'https://labs.zekhoi.dev/base64',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/base64',
  }
}

export default function Page() {
  return <Base64Converter />
}
