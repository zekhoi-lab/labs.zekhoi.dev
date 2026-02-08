import { Navbar } from '@/components/navbar'
import { ToolCard } from '@/components/tool-card'
import { Footer } from '@/components/footer'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Access essential developer tools including UUID generator, Password generator, JSON formatter, and more.",
  alternates: {
    canonical: '/',
  },
}

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
          <ToolCard 
            title="UUID Generator" 
            description="Generate UUIDs instantly. Supports v4 (Random), v1, v6, and v7 (Timestamp)."
            icon="fingerprint"
            href="/uuid"
            version="v7"
          />
          <ToolCard 
            title="Password Gen" 
            description="Create strong, secure passwords with custom length, symbols, and complexity rules."
            icon="password"
            href="/password"
          />
          <ToolCard 
            title="JSON Formatter" 
            description="Validate, minify, and beautify JSON data. Includes error highlighting and tree view."
            icon="data_object"
            href="/json"
          />
          <ToolCard 
            title="Base64 Converter" 
            description="Encode and decode data to Base64 format. Supports text strings and file uploads."
            icon="code"
            href="/base64"
          />
          <ToolCard 
            title="JWT Debugger" 
            description="Decode and inspect JSON Web Tokens. Verify signatures and view payload claims."
            icon="verified_user"
            href="/jwt"
          />
          <ToolCard 
            title="Epoch Converter" 
            description="Convert Unix timestamps to human-readable dates and vice versa. Local & UTC support."
            icon="schedule"
            href="/epoch"
          />
          <ToolCard 
            title="Hash Generator" 
            description="Compute hashes using common algorithms like MD5, SHA-1, SHA-256, and SHA-512."
            icon="tag"
            href="/hash"
          />
          <ToolCard 
            title="Regex Tester" 
            description="Test regular expressions against strings in real-time. Includes cheat sheet."
            icon="regular_expression"
            href="/regex"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}