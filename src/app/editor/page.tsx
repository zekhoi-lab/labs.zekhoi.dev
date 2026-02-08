import { Metadata } from 'next'
import CodeEditor from './client'

export const metadata: Metadata = {
  title: 'Online Code Editor',
  description: 'Lightweight sandbox for writing and testing code snippets. Syntax highlighting for multiple languages.',
  keywords: ['online code editor', 'code playground', 'text editor', 'code snippet text'],
  openGraph: {
    title: 'Online Code Editor',
    description: 'Lightweight sandbox for writing and testing code snippets. Syntax highlighting for multiple languages.',
    url: 'https://labs.zekhoi.dev/editor',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/editor',
  }
}

export default function Page() {
  return <CodeEditor />
}
