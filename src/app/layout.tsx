import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Noto_Sans, Geist, Geist_Mono, Space_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/query-provider'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Labs by zekhoi | Essential Developer Utilities",
    template: "%s | Labs by zekhoi"
  },
  description: "A curate suite of offline-first developer tools. Generate UUIDs, format JSON, debug JWTs, and more—instantly and securely. No ads, no tracking.",
  keywords: [
    "developer tools",
    "web utilities",
    "json formatter",
    "jwt debugger",
    "uuid generator",
    "base64 converter",
    "offline tools",
    "privacy focused",
    "open source"
  ],
  authors: [{ name: "zekhoi", url: "https://zekhoi.dev" }],
  creator: "zekhoi",
  metadataBase: new URL("https://labs.zekhoi.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://labs.zekhoi.dev",
    title: "Labs by zekhoi | Essential Developer Utilities",
    description: "Fast, privacy-focused developer tools. No ads, no tracking, just utilities built for speed.",
    siteName: "Labs by zekhoi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Labs by zekhoi - Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Labs by zekhoi | Essential Developer Utilities",
    description: "Fast, privacy-focused developer tools. No ads, no tracking, just utilities built for speed.",
    creator: "@zekhoi",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${notoSans.variable} ${spaceMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
