'use client'


import { Navbar } from '@/components/navbar'
import { ToolCard } from '@/components/tool-card'
import { Footer } from '@/components/footer'
import { GlitchText } from '@/components/glitch-text'

interface Tool {
  title: string
  description: string
  icon: string
  href: string
  version?: string
}

const TOOLS: Tool[] = [
  {
    title: "UUID Generator",
    description: "Instantly generate cryptographically strong v4 UUIDs. Supports bulk generation, custom formatting, and one-click copying.",
    icon: "fingerprint",
    href: "/uuid",
    version: "v4"
  },
  {
    title: "Password Generator",
    description: "Create secure, random passwords with adjustable length and complexity. Ensure safety with client-side generation.",
    icon: "password",
    href: "/password"
  },
  {
    title: "JSON Formatter",
    description: "Validate, minify, and beautify JSON. Features syntax highlighting, error detection, and collapsible tree views.",
    icon: "data_object",
    href: "/json"
  },
  {
    title: "Base64 Converter",
    description: "Seamlessly encode and decode text or files to Base64. Handles large inputs with ease and privacy.",
    icon: "code",
    href: "/base64"
  },
  {
    title: "JWT Debugger",
    description: "Decode and inspect JSON Web Tokens (JWTs). Verify signatures and visualize header/payload claims clearly.",
    icon: "verified_user",
    href: "/jwt"
  },
  {
    title: "Epoch Converter",
    description: "Convert between Unix timestamps and human-readable dates. Supports local time, UTC, and various formats.",
    icon: "schedule",
    href: "/epoch"
  },
  {
    title: "Hash Generator",
    description: "Compute secure hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms. Fast and entirely client-side.",
    icon: "tag",
    href: "/hash"
  },
  {
    title: "Regex Tester",
    description: "Test and debug regular expressions in real-time. Includes a handy cheat sheet and match highlighting.",
    icon: "regular_expression",
    href: "/regex"
  },
  {
    title: "Diff Viewer",
    description: "Compare text or code snippets to spot differences. Offers side-by-side and unified views with syntax highlighting.",
    icon: "compare",
    href: "/diff"
  },
  {
    title: "URL Parser",
    description: "Break down URLs into their components: protocol, host, path, and query params. Decodes encoded characters automatically.",
    icon: "link",
    href: "/url"
  },
  {
    title: "Color Converter",
    description: "Translate colors between HEX, RGB, HSL, and CMYK. visualize palettes and fine-tune values effortlessly.",
    icon: "colorize",
    href: "/color"
  },
  {
    title: "Markdown Editor",
    description: "Write and preview markdown in real-time. A distraction-free environment with instant rendering.",
    icon: "terminal",
    href: "/editor"
  },
  {
    title: "HTTP Client",
    description: "Test API endpoints directly from your browser. Send GET, POST, PUT, DELETE requests and inspect responses.",
    icon: "public",
    href: "/http"
  },
  {
    title: "Crontab Generator",
    description: "Construct and verify cron schedules with a visual interface. Translates complex cron syntax into plain English.",
    icon: "schedule",
    href: "/crontab"
  },
  {
    title: "Image Optimizer",
    description: "Compress and resize images for the web. Reduce file size without sacrificing visible quality.",
    icon: "image",
    href: "/image"
  },
  {
    title: "SQL Formatter",
    description: "Beautify complex SQL queries. Standardize indentations and spacing for better readability.",
    icon: "database",
    href: "/sql"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black dark:text-white uppercase">
            <GlitchText text="Developer Tools" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
            A curated collection of essential utilities for your daily workflow.
            Built for speed, privacy, and minimalism—no ads, no tracking, just tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.href}
              {...tool}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}