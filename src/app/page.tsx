import { ToolDashboard } from '@/components/tool-dashboard'
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
    description: "Generate v4, v5, v6, and v7 UUIDs in your browser, with one-click copying and a recent history.",
    icon: "fingerprint",
    href: "/uuid",
    version: "v4-v7"
  },
  {
    title: "Password Generator",
    description: "Create secure, random passwords with adjustable length and complexity. Ensure safety with client-side generation.",
    icon: "password",
    href: "/password"
  },
  {
    title: "JSON Formatter",
    description: "Validate, minify, and beautify JSON with clear error messages. Load a file, then copy or download the result.",
    icon: "data_object",
    href: "/json"
  },
  {
    title: "YAML ↔ JSON",
    description: "Convert YAML to JSON and back as you type, with the line and column of any syntax error.",
    icon: "sync_alt",
    href: "/yaml"
  },
  {
    title: "Base64 Converter",
    description: "Encode and decode text to and from Base64, with full UTF-8 support for emoji and special characters.",
    icon: "code",
    href: "/base64"
  },
  {
    title: "JWT Debugger",
    description: "Decode and inspect JSON Web Tokens. View header and payload claims and verify HS256/384/512 signatures.",
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
    description: "Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes with the Web Crypto API. Fast and entirely client-side.",
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
    title: "Text Utilities",
    description: "Convert text to camelCase, snake_case, kebab-case, Title Case, and more, make URL slugs, and count words and characters.",
    icon: "text_fields",
    href: "/text"
  },
  {
    title: "Diff Viewer",
    description: "Compare text or code line by line in a side-by-side view. Upload a file or swap the two sides.",
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
    title: "CIDR Calculator",
    description: "Work out the network, broadcast, host range, netmask, and wildcard of any IPv4 block.",
    icon: "lan",
    href: "/cidr"
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL, and check luminance and contrast against black and white.",
    icon: "colorize",
    href: "/color"
  },
  {
    title: "Markdown Editor",
    description: "Write and preview markdown in real-time. A distraction-free environment with instant rendering.",
    icon: "edit_note",
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
    description: "Build and validate cron schedules field by field. Translates cron syntax into plain English and lists the next runs.",
    icon: "event_repeat",
    href: "/crontab"
  },
  {
    title: "Image Optimizer",
    description: "Compress and resize images for the web. Reduce file size without sacrificing visible quality.",
    icon: "image",
    href: "/image"
  },
  {
    title: "QR Code Generator",
    description: "Turn text or a URL into a QR code with adjustable error correction, size, and margin. Download as PNG or SVG.",
    icon: "qr_code_2",
    href: "/qr"
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
    <ToolDashboard
      title={<GlitchText text="Developer Tools" />}
      description="A curated collection of essential utilities for your daily workflow. Built for speed, privacy, and minimalism—no ads, no tracking, just tools."
      tools={TOOLS}
    />
  );
}