import { Metadata } from 'next'
import CrontabGenerator from './client'

export const metadata: Metadata = {
  title: 'Crontab Generator | Visualize Cron Schedule',
  description: 'Create and validate cron schedules easily. Translate complex cron expressions into human-readable text. Visual editor included.',
  keywords: ['crontab generator', 'cron schedule', 'cron expression', 'cron validator', 'cron job maker', 'schedule tasks'],
  openGraph: {
    title: 'Crontab Generator | Visualize Cron Schedule',
    description: 'Build perfect cron schedules every time. Visualize, validate, and translate cron syntax instantly.',
    url: 'https://labs.zekhoi.dev/crontab',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/crontab',
  }
}

export default function Page() {
  return <CrontabGenerator />
}
