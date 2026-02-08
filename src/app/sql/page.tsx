import { Metadata } from 'next'
import SqlFormatter from './client'

export const metadata: Metadata = {
  title: 'SQL Formatter | Beautify & Minify SQL',
  description: 'Format and beautify complex SQL queries instantly. Supports PostgreSQL, MySQL, SQLite, and Standard SQL. Improve readability.',
  keywords: ['sql formatter', 'sql beautifier', 'pretty print sql', 'sql minifier', 'format sql', 'db tools'],
  openGraph: {
    title: 'SQL Formatter | Beautify & Minify SQL',
    description: 'Clean up your SQL queries with one click. Supports multiple dialects and indentation styles. Fast and private.',
    url: 'https://labs.zekhoi.dev/sql',
    siteName: 'Labs by zekhoi',
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
