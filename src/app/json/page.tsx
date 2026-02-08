import { Metadata } from 'next'
import JsonFormatter from './client'

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator | Beautify & Minify',
  description: 'The ultimate online JSON tool. Validate, format, beautify, and minify JSON data. Features error highlighting, tree view, and dark mode. processed locally.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'json parser', 'debug json', 'offline json tool'],
  openGraph: {
    title: 'JSON Formatter & Validator | Beautify & Minify',
    description: 'Validate, format, and fix JSON instantly. Includes a powerful tree view and error detection. No servers, 100% privacy.',
    url: 'https://labs.zekhoi.dev/json',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/json',
  }
}

export default function Page() {
  return <JsonFormatter />
}
