import { Metadata } from 'next'
import SqlFormatter from './client'

export const metadata: Metadata = {
  title: 'SQL Formatter & Beautifier',
  description: 'Beautify and format complex SQL queries. Supports PostreSQL, MySQL, and Standard SQL dialects.',
  keywords: ['sql formatter', 'sql beautifier', 'pretty print sql', 'sql minifier', 'format sql'],
  openGraph: {
    title: 'SQL Formatter & Beautifier',
    description: 'Beautify and format complex SQL queries. Supports PostreSQL, MySQL, and Standard SQL dialects.',
    url: 'https://labs.zekhoi.dev/sql',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/sql',
  }
}

export default function Page() {
  return <SqlFormatter />
}
