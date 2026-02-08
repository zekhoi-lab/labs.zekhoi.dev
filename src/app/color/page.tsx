import { Metadata } from 'next'
import ColorConverter from './client'

export const metadata: Metadata = {
  title: 'Color Converter (HEX, RGB, HSL)',
  description: 'Convert colors between HEX, RGB, HSL, and CMYK formats. Visualize colors and generate palettes.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker'],
  openGraph: {
    title: 'Color Converter (HEX, RGB, HSL)',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK formats. Visualize colors and generate palettes.',
    url: 'https://labs.zekhoi.dev/color',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/color',
  }
}

export default function Page() {
  return <ColorConverter />
}
