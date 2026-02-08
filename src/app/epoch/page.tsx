import { Metadata } from 'next'
import EpochConverter from './client'

export const metadata: Metadata = {
  title: 'Epoch Converter | Unix Timestamp Tool',
  description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds, milliseconds, microseconds, and nanoseconds. View Local and UTC time.',
  keywords: ['epoch converter', 'unix time', 'timestamp converter', 'unix timestamp', 'date to timestamp', 'epoch time'],
  openGraph: {
    title: 'Epoch Converter | Unix Timestamp Tool',
    description: 'Instantly convert between Unix timestamps and human-readable dates. Supports all precision levels. Simple and fast.',
    url: 'https://labs.zekhoi.dev/epoch',
    siteName: 'Labs by zekhoi',
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
