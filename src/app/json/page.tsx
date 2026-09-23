import { Metadata } from 'next'
import JsonFormatter from './client'

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator | Beautify & Minify',
  description: 'Validate, format, beautify, and minify JSON data with clear error messages. Load a file and download the result. Processed locally in your browser.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'json parser', 'debug json', 'offline json tool'],
  openGraph: {
    title: 'JSON Formatter & Validator | Beautify & Minify',
    description: 'Validate, format, and minify JSON instantly, with error detection. No servers, 100% privacy.',
    url: 'https://labs.zekhoi.dev/json',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/json',
  }
}

export default function Page() {
  return <JsonFormatter />
}
