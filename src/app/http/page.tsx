import { Metadata } from 'next'
import HttpClient from './client'

export const metadata: Metadata = {
  title: 'Online HTTP Client',
  description: 'Test REST API endpoints. Send GET, POST, PUT, DELETE requests with custom headers and payloads directly from your browser.',
  keywords: ['http client', 'api tester', 'rest client', 'online postman', 'send api request'],
  openGraph: {
    title: 'Online HTTP Client',
    description: 'Test REST API endpoints. Send GET, POST, PUT, DELETE requests with custom headers and payloads directly from your browser.',
    url: 'https://labs.zekhoi.dev/http',
    siteName: 'labs.zekhoi.dev',
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
