import { Metadata } from 'next'
import YamlConverter from './client'

export const metadata: Metadata = {
  title: 'YAML to JSON Converter | Convert JSON to YAML Online',
  description: 'Convert YAML to JSON and JSON to YAML in your browser, with the line and column of any syntax error. Nothing leaves your browser.',
  keywords: ['yaml to json', 'json to yaml', 'yaml converter', 'yaml validator', 'convert yaml online', 'developer tools'],
  openGraph: {
    title: 'YAML to JSON Converter | Convert JSON to YAML Online',
    description: 'Convert between YAML and JSON instantly, with clear syntax errors. Runs entirely in your browser.',
    url: 'https://labs.zekhoi.dev/yaml',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/yaml',
  }
}

export default function Page() {
  return <YamlConverter />
}
