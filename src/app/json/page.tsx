import { Metadata } from 'next'
import JsonFormatter from './client'

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description: 'Validate, format, beautify, and minify JSON data. Free online JSON parser with error highlighting and tree view.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json minify', 'online json tool'],
  openGraph: {
    title: 'JSON Formatter & Validator',
    description: 'Validate, format, beautify, and minify JSON data. Free online JSON parser with error highlighting and tree view.',
    url: 'https://labs.zekhoi.dev/json',
    siteName: 'labs.zekhoi.dev',
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
