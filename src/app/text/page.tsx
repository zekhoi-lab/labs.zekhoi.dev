import { Metadata } from 'next'
import TextUtilities from './client'

export const metadata: Metadata = {
  title: 'Text Utilities | Case Converter, Slug Generator & Word Counter',
  description: 'Convert text to camelCase, snake_case, kebab-case, Title Case, and more, make URL slugs, and count characters, words, lines, and bytes. Runs in your browser.',
  keywords: ['case converter', 'camelcase converter', 'snake case', 'slug generator', 'word counter', 'character counter'],
  openGraph: {
    title: 'Text Utilities | Case Converter, Slug Generator & Word Counter',
    description: 'Change case, make slugs, and count words and characters instantly. Nothing leaves your browser.',
    url: 'https://labs.zekhoi.dev/text',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/text',
  }
}

export default function Page() {
  return <TextUtilities />
}
