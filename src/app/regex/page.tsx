import { Metadata } from 'next'
import RegexTester from './client'

export const metadata: Metadata = {
  title: 'Regex Tester | Debug & Test Regular Expressions',
  description: 'Test regular expressions in real-time. Features syntax highlighting, match detection, and a built-in cheat sheet. Perfect for learning and debugging.',
  keywords: ['regex tester', 'regex debugger', 'regular expression tester', 'regex cheat sheet', 'javascript regex'],
  openGraph: {
    title: 'Regex Tester | Debug & Test Regular Expressions',
    description: 'Valid, test, and debug regex patterns instantly. Includes a helpful cheat sheet and real-time matching.',
    url: 'https://labs.zekhoi.dev/regex',
    siteName: 'Labs by zekhoi',
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
