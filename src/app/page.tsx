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
    <div className="min-h-screen flex flex-col relative">
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
            description="Generate random v4 UUIDs instantly. Supports bulk generation and multiple formats."
            icon="fingerprint"
            href="#"
            version="v4"
          />
          <ToolCard 
            title="Password Gen" 
            description="Create strong, secure passwords with custom length, symbols, and complexity rules."
            icon="password"
            href="#"
          />
          <ToolCard 
            title="JSON Formatter" 
            description="Validate, minify, and beautify JSON data. Includes error highlighting and tree view."
            icon="data_object"
            href="#"
          />
          <ToolCard 
            title="Base64 Converter" 
            description="Encode and decode data to Base64 format. Supports text strings and file uploads."
            icon="code"
            href="#"
          />
          <ToolCard 
            title="JWT Debugger" 
            description="Decode and inspect JSON Web Tokens. Verify signatures and view payload claims."
            icon="verified_user"
            href="#"
          />
          <ToolCard 
            title="Epoch Converter" 
            description="Convert Unix timestamps to human-readable dates and vice versa. Local & UTC support."
            icon="schedule"
            href="#"
          />
          <ToolCard 
            title="Hash Generator" 
            description="Compute hashes using common algorithms like MD5, SHA-1, SHA-256, and SHA-512."
            icon="tag"
            href="#"
          />
          <ToolCard 
            title="Regex Tester" 
            description="Test regular expressions against strings in real-time. Includes cheat sheet."
            icon="regular_expression"
            href="#"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}