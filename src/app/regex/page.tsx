import { Metadata } from 'next'
import RegexTester from './client'

export const metadata: Metadata = {
  title: 'Regex Tester & Debugger',
  description: 'Test and validate regular expressions against text strings in real-time. Includes regex cheat sheet and highlighting.',
  keywords: ['regex tester', 'regex debugger', 'regular expression', 'regex playground', 'js regex'],
  openGraph: {
    title: 'Regex Tester & Debugger',
    description: 'Test and validate regular expressions against text strings in real-time. Includes regex cheat sheet and highlighting.',
    url: 'https://labs.zekhoi.dev/regex',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/regex',
  }
}

export default function Page() {
  return <RegexTester />
}
