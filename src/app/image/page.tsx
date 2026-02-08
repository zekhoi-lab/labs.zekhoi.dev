import { Metadata } from 'next'
import ImageOptimizer from './client'

export const metadata: Metadata = {
  title: 'Image Optimizer & Compressor',
  description: 'Compress and resize images (JPEG, PNG, WEBP) for the web. Reduce file size without significant quality loss locally.',
  keywords: ['image optimizer', 'image compressor', 'compress png', 'compress jpeg', 'resize image'],
  openGraph: {
    title: 'Image Optimizer & Compressor',
    description: 'Compress and resize images (JPEG, PNG, WEBP) for the web. Reduce file size without significant quality loss locally.',
    url: 'https://labs.zekhoi.dev/image',
    siteName: 'labs.zekhoi.dev',
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
