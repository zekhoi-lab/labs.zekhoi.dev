import { Metadata } from 'next'
import CodeEditor from './client'

export const metadata: Metadata = {
  title: 'Online Markdown Editor',
  description: 'Minimalist online markdown editor with live preview. Fast, distraction-free writing and testing for markdown snippets.',
  keywords: ['online markdown editor', 'markdown preview', 'markdown live preview', 'distraction-free writer'],
  openGraph: {
    title: 'Online Markdown Editor',
    description: 'Minimalist online markdown editor with live preview. Fast, distraction-free writing and testing for markdown snippets.',
    url: 'https://labs.zekhoi.dev/editor',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Markdown Editor',
    description: 'Minimalist online markdown editor with live preview. Fast, distraction-free writing and testing for markdown snippets.',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/editor',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function Page() {
  return <CodeEditor />
}
