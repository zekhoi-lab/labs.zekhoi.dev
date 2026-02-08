import { Metadata } from 'next'
import EpochConverter from './client'

export const metadata: Metadata = {
  title: 'Epoch & Unix Timestamp Converter',
  description: 'Convert Unix timestamps to human-readable dates and vice versa. Support for seconds, milliseconds, and microseconds.',
  keywords: ['epoch converter', 'unix timestamp', 'timestamp converter', 'epoch time', 'unix time'],
  openGraph: {
    title: 'Epoch & Unix Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. Support for seconds, milliseconds, and microseconds.',
    url: 'https://labs.zekhoi.dev/epoch',
    siteName: 'labs.zekhoi.dev',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/epoch',
  }
}

export default function Page() {
  return <EpochConverter />
}
