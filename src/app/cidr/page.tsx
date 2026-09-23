import { Metadata } from 'next'
import CidrCalculator from './client'

export const metadata: Metadata = {
  title: 'CIDR Calculator | IPv4 Subnet Calculator',
  description: 'Calculate the network, broadcast, host range, netmask, and wildcard of any IPv4 CIDR block or netmask. Runs entirely in your browser.',
  keywords: ['cidr calculator', 'subnet calculator', 'ipv4 subnet', 'netmask calculator', 'ip range calculator', 'network tools'],
  openGraph: {
    title: 'CIDR Calculator | IPv4 Subnet Calculator',
    description: 'Network, broadcast, usable host range, netmask, and wildcard for any IPv4 CIDR block. Free and private.',
    url: 'https://labs.zekhoi.dev/cidr',
    siteName: 'Labs by zekhoi',
    locale: 'en_US',
    type: 'website',
    images: '/opengraph-image',
  },
  alternates: {
    canonical: 'https://labs.zekhoi.dev/cidr',
  }
}

export default function Page() {
  return <CidrCalculator />
}
