'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { format as formatSql } from 'sql-formatter'
import { GlitchText } from '@/components/glitch-text'
import { cn } from '@/lib/utils'

type Dialect = 'sql' | 'postgresql' | 'mysql' | 'sqlite' | 'mariadb' | 'bigquery'

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [dialect, setDialect] = useState<Dialect>('postgresql')
  const [error, setError] = useState('')

  const handleFormat = () => {
    try {
      setError('')
      const formatted = formatSql(input, {
        language: dialect,
        tabWidth: 2,
        keywordCase: 'upper',
      })
      setOutput(formatted)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleMinify = () => {
    try {
      setError('')
      // Basic minification: remove comments and extra whitespace
      // Note: This is a naive regex approach. 
      // A robust SQL minifier is complex. 
      // We'll trust sql-formatter for structure, maybe just formatting with linesAsSeparateStatements: false?
      // sql-formatter doesn't have a "minify" mode.
      // So we'll use a simple regex replacement for now.
      
      const minified = input
        .replace(/--.*$/gm, '') // Remove line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim()
      
      setOutput(minified)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        breadcrumbs={[
            { label: 'SQL Formatter', href: '/sql' }
        ]}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="SQL Formatter" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            Beautify, indent, and minify your SQL queries. Supports multiple dialects including PostgreSQL and MySQL.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">SQL Dialect</label>
              <select 
                value={dialect}
                onChange={(e) => setDialect(e.target.value as Dialect)}
                className="appearance-none bg-white dark:bg-black border border-black dark:border-white px-4 py-2 text-sm focus:ring-0 focus:border-black font-mono cursor-pointer outline-none text-black dark:text-white"
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
                <option value="sql">Standard SQL</option>
                <option value="mariadb">MariaDB</option>
                <option value="bigquery">BigQuery</option>
              </select>
            </div>
          </div>
        </div>

        <div className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black dark:border-white bg-black dark:bg-white",
            error ? "border-red-500" : ""
        )}>
          {/* Input */}
          <div className="relative bg-white dark:bg-black border-b lg:border-b-0 lg:border-r border-black dark:border-white">
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-1 uppercase tracking-widest">Input</span>
            </div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[500px] p-12 text-sm font-mono focus:ring-0 border-none outline-none leading-relaxed placeholder:text-gray-300 dark:placeholder:text-gray-700 bg-transparent text-black dark:text-white resize-none" 
              placeholder="SELECT * FROM users WHERE status='active'..."
              spellCheck={false}
            ></textarea>
          </div>

          {/* Output */}
          <div className="relative bg-gray-50 dark:bg-gray-900">
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-2 py-1 uppercase tracking-widest border border-black/10 dark:border-white/10">Output</span>
            </div>
             {error && (
                <div className="absolute top-4 right-4 z-10 bg-red-100 text-red-600 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  Error
                </div>
              )}
            <textarea 
              value={error || output}
              readOnly
              className={cn(
                "w-full min-h-[500px] p-12 text-sm font-mono focus:ring-0 border-none outline-none leading-relaxed bg-transparent cursor-default resize-none",
                error ? "text-red-500" : "text-black dark:text-white"
              )}
              placeholder="Beautified SQL will appear here..."
            ></textarea>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleFormat}
              className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">auto_fix_high</span>
              Format
            </button>
            <button 
              onClick={handleMinify}
              className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">compress</span>
              Minify
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigator.clipboard.writeText(output)}
              className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copy
            </button>
            <button 
               onClick={() => { setInput(''); setOutput(''); setError(''); }}
               className="bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Clear
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
