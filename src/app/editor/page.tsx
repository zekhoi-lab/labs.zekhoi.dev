import { Metadata } from 'next'
import CodeEditor from './client'

export const metadata: Metadata = {
  title: 'Online Markdown Editor | Live Preview',
  description: 'A minimalist, distraction-free markdown editor. Write and preview markdown in real-time and copy it with one click.',
  keywords: ['online markdown editor', 'markdown preview', 'markdown live preview', 'distraction-free writer', 'markdown to html'],
  openGraph: {
    title: 'Online Markdown Editor | Live Preview',
    description: 'Write markdown with zero distractions. Instant live preview. No signup required.',
    url: 'https://labs.zekhoi.dev/editor',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Markdown Editor | Live Preview',
    description: 'A minimalist, distraction-free markdown editor. Write and preview markdown in real-time.',
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
