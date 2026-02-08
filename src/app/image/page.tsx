import { Metadata } from 'next'
import ImageOptimizer from './client'

export const metadata: Metadata = {
  title: 'Image Optimizer | Compress PNG, JPG, WEBP',
  description: 'Compress and resize images locally. Reduce file size for the web without losing quality. Privacy-first: no uploads to servers.',
  keywords: ['image optimizer', 'image compressor', 'compress png', 'compress jpeg', 'resize image', 'reduce image size', 'webp converter'],
  openGraph: {
    title: 'Image Optimizer | Compress PNG, JPG, WEBP',
    description: 'Optimize images for the web in seconds. Compress PNGs, JPEGs, and WEBPs locally. 100% free and private.',
    url: 'https://labs.zekhoi.dev/image',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/image',
  }
}

export default function Page() {
  return <ImageOptimizer />
}
