import { Metadata } from 'next'
import CrontabGenerator from './client'

export const metadata: Metadata = {
  title: 'Crontab Generator & Validator',
  description: 'Create and validate cron schedules with a simple interface. Translate cron expressions to human-readable text.',
  keywords: ['crontab generator', 'cron schedule', 'cron expression', 'cron validator', 'cron job maker'],
  openGraph: {
    title: 'Crontab Generator & Validator',
    description: 'Create and validate cron schedules with a simple interface. Translate cron expressions to human-readable text.',
    url: 'https://labs.zekhoi.dev/crontab',
    siteName: 'labs.zekhoi.dev',
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
