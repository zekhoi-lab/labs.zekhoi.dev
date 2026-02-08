import { Metadata } from 'next'
import DiffViewer from './client'

export const metadata: Metadata = {
  title: 'Text & Code Diff Viewer',
  description: 'Compare two text/code snippets to find differences. Highlights additions and deletions in side-by-side or unified view.',
  keywords: ['diff viewer', 'text compare', 'code comparison', 'diff checker', 'file difference'],
  openGraph: {
    title: 'Text & Code Diff Viewer',
    description: 'Compare two text/code snippets to find differences. Highlights additions and deletions in side-by-side or unified view.',
    url: 'https://labs.zekhoi.dev/diff',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/diff',
  }
}

export default function Page() {
  return <DiffViewer />
}
