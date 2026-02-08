import { Metadata } from 'next'
import HttpClient from './client'

export const metadata: Metadata = {
  title: 'Online HTTP Client | Test API Endpoints',
  description: 'Test REST APIs directly in your browser. Send GET, POST, PUT, DELETE requests. Inspect headers, JSON payloads, and response times.',
  keywords: ['http client', 'api tester', 'rest client', 'postman alternative', 'send api request', 'debug api'],
  openGraph: {
    title: 'Online HTTP Client | Test API Endpoints',
    description: 'The lightweight way to test APIs. Debug endpoints, analyze responses, and fix issues faster. Free and open source.',
    url: 'https://labs.zekhoi.dev/http',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/http',
  }
}

export default function Page() {
  return <HttpClient />
}
