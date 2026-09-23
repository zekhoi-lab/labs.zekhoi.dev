import { Metadata } from 'next'
import ColorConverter from './client'

export const metadata: Metadata = {
  title: 'Color Converter | HEX, RGB, HSL',
  description: 'Convert colors between HEX, RGB, and HSL instantly, check luminance and contrast against black and white, and copy values with one click.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker', 'cmyk converter', 'palette generator'],
  openGraph: {
    title: 'Color Converter | HEX, RGB, HSL',
    description: 'Convert between HEX, RGB, and HSL and grab code-ready values instantly.',
    url: 'https://labs.zekhoi.dev/color',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/color',
  }
}

export default function Page() {
  return <ColorConverter />
}
