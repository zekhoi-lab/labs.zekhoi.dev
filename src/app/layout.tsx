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
    default: "labs.zekhoi.dev | Developer Utilities",
    template: "%s | labs.zekhoi.dev"
  },
  description: "Essential offline-first developer utilities. UUID generator, JSON formatter, JWT debugger, and more. Optimized for speed, privacy, and minimalism.",
  keywords: ["developer tools", "json formatter", "jwt debugger", "uuid generator", "web utilities", "offline tools", "privacy focused"],
  authors: [{ name: "Zekhoi", url: "https://zekhoi.dev" }],
  creator: "Zekhoi",
  metadataBase: new URL("https://labs.zekhoi.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://labs.zekhoi.dev",
    title: "labs.zekhoi.dev | Developer Utilities",
    description: "Fast, privacy-focused developer tools. No ads, no tracking, just utilities.",
    siteName: "labs.zekhoi.dev",
    images: [
      {
        url: "/og-image.png", // Assuming an OG image exists or will be added, otherwise this acts as a placeholder
        width: 1200,
        height: 630,
        alt: "labs.zekhoi.dev - Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "labs.zekhoi.dev | Developer Utilities",
    description: "Fast, privacy-focused developer tools. No ads, no tracking, just utilities.",
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
  },
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
