import type { Metadata } from 'next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/query-provider'
import { themeInitScript } from '@/lib/theme'

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Labs by zekhoi | Essential Developer Utilities",
    template: "%s | Labs by zekhoi"
  },
  description: "A curated suite of in-browser developer tools. Generate UUIDs, format JSON, debug JWTs, and more—instantly and privately. No ads, no tracking.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Labs by zekhoi | Essential Developer Utilities",
    description: "Fast, privacy-focused developer tools. No ads, no tracking, just utilities built for speed.",
    creator: "@zekhoi",
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
    // The init script may add the `dark` class before hydration
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
      </head>
      <body
        className={`${geistMono.variable} ${spaceGrotesk.variable} antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
