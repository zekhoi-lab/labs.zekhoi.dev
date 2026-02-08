import { Metadata } from 'next'
import ColorConverter from './client'

export const metadata: Metadata = {
  title: 'Color Converter | HEX, RGB, HSL, CMYK',
  description: 'Convert colors between formats (HEX, RGB, HSL, CMYK) instantly. Generate palettes and copy values with one click. Visual color picker included.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker', 'cmyk converter', 'palette generator'],
  openGraph: {
    title: 'Color Converter | HEX, RGB, HSL, CMYK',
    description: 'Seamlessly convert between color formats. Visualize palettes and grab code-ready values instantly.',
    url: 'https://labs.zekhoi.dev/color',
    siteName: 'Labs by zekhoi',
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
