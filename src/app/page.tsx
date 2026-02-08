'use client'


import { Navbar } from '@/components/navbar'
import { ToolCard } from '@/components/tool-card'
import { Footer } from '@/components/footer'

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
    description: "Generate random v4 UUIDs instantly. Supports bulk generation and multiple formats.",
    icon: "fingerprint",
    href: "/uuid",
    version: "v4"
  },
  {
    title: "Password Gen",
    description: "Create strong, secure passwords with custom length, symbols, and complexity rules.",
    icon: "password",
    href: "/password"
  },
  {
    title: "JSON Formatter",
    description: "Validate, minify, and beautify JSON data. Includes error highlighting and tree view.",
    icon: "data_object",
    href: "/json"
  },
  {
    title: "Base64 Converter",
    description: "Encode and decode data to Base64 format. Supports text strings and file uploads.",
    icon: "code",
    href: "/base64"
  },
  {
    title: "JWT Debugger",
    description: "Decode and inspect JSON Web Tokens. Verify signatures and view payload claims.",
    icon: "verified_user",
    href: "/jwt"
  },
  {
    title: "Epoch Converter",
    description: "Convert Unix timestamps to human-readable dates and vice versa. Local & UTC support.",
    icon: "schedule",
    href: "/epoch"
  },
  {
    title: "Hash Generator",
    description: "Compute hashes using common algorithms like MD5, SHA-1, SHA-256, and SHA-512.",
    icon: "tag",
    href: "/hash"
  },
  {
    title: "Regex Tester",
    description: "Test regular expressions against strings in real-time. Includes cheat sheet.",
    icon: "regular_expression",
    href: "/regex"
  },
  {
    title: "Diff Viewer",
    description: "Compare two pieces of code or text to find differences. Supports side-by-side and unified views.",
    icon: "compare",
    href: "/diff"
  },
  {
    title: "URL Parser",
    description: "Deconstruct URLs into protocol, host, path, and query parameters for easier debugging.",
    icon: "link",
    href: "/url"
  },
  {
    title: "Color Converter",
    description: "Convert between HEX, RGB, HSL, and CMYK formats. Includes palette generator.",
    icon: "colorize",
    href: "/color"
  },
  {
    title: "Markdown Editor",
    description: "Minimalist markdown editor with live preview and distraction-free writing experience.",
    icon: "terminal",
    href: "/editor"
  },
  {
    title: "HTTP Client",
    description: "Test API endpoints by sending GET, POST, PUT, and DELETE requests with custom headers.",
    icon: "public",
    href: "/http"
  },
  {
    title: "Crontab Generator",
    description: "Create and validate cron schedules using a simple, human-readable interface.",
    icon: "schedule",
    href: "/crontab"
  },
  {
    title: "Image Optimizer",
    description: "Compress and resize images for the web without losing significant quality.",
    icon: "image",
    href: "/image"
  },
  {
    title: "SQL Formatter",
    description: "Beautify complex SQL queries for better readability across various SQL dialects.",
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
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black dark:text-white">Developer Tools</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Essential utilities for daily development workflows. 
            Optimized for speed, privacy, and minimalism. No ads, no tracking, just tools.
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