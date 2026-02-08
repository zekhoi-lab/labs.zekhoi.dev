import { Metadata } from 'next'
import DiffViewer from './client'

export const metadata: Metadata = {
  title: 'Diff Viewer & Text Compare Tool',
  description: 'Compare text and code files to find differences instantly. Supports side-by-side and unified views. Highlight syntax for better readability.',
  keywords: ['diff viewer', 'text compare', 'code comparison', 'diff checker', 'file difference', 'online diff tool'],
  openGraph: {
    title: 'Diff Viewer & Text Compare Tool',
    description: 'The easiest way to compare text and code. Spot differences in seconds with our privacy-focused diff tool.',
    url: 'https://labs.zekhoi.dev/diff',
    siteName: 'Labs by zekhoi',
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
