import { Metadata } from 'next'
import DiffViewer from './client'

export const metadata: Metadata = {
  title: 'Diff Viewer & Text Compare Tool',
  description: 'Compare text and code to find differences instantly, line by line in a side-by-side view. Runs in your browser.',
  keywords: ['diff viewer', 'text compare', 'code comparison', 'diff checker', 'file difference', 'online diff tool'],
  openGraph: {
    title: 'Diff Viewer & Text Compare Tool',
    description: 'The easiest way to compare text and code. Spot differences in seconds with our privacy-focused diff tool.',
    url: 'https://labs.zekhoi.dev/diff',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/diff',
  }
}

export default function Page() {
  return <DiffViewer />
}
