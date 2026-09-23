'use client'

import { useMemo, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GlitchText } from '@/components/glitch-text'
import { useCopy } from '@/lib/use-copy'
import {
  slugify, textStats, toCamelCase, toConstantCase, toKebabCase, toPascalCase,
  toSentenceCase, toSnakeCase, toTitleCase,
} from '@/lib/text-case'

// Shown in their own casing, so the label doubles as an example
const CONVERSIONS: [string, (text: string) => string][] = [
  ['lowercase', text => text.toLowerCase()],
  ['UPPERCASE', text => text.toUpperCase()],
  ['Title Case', toTitleCase],
  ['Sentence case', toSentenceCase],
  ['camelCase', toCamelCase],
  ['PascalCase', toPascalCase],
  ['snake_case', toSnakeCase],
  ['kebab-case', toKebabCase],
  ['CONSTANT_CASE', toConstantCase],
  ['Slug', slugify],
]

export default function TextUtilities() {
  const [text, setText] = useState('Hello World from labs.zekhoi.dev')
  const { copy, isCopied } = useCopy()
  const stats = useMemo(() => textStats(text), [text])
  const results = useMemo(() => CONVERSIONS.map(([name, convert]) => [name, convert(text)] as const), [text])

  const statRows: [string, string][] = [
    ['Characters', String(stats.characters)],
    ['Without spaces', String(stats.charactersNoSpaces)],
    ['Words', String(stats.words)],
    ['Lines', String(stats.lines)],
    ['Bytes (UTF-8)', String(stats.bytes)],
    ['Reading time', stats.readingMinutes === 0 ? '-' : `${stats.readingMinutes} min`],
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar
        title="labs.zekhoi.dev"
        icon="terminal"
        breadcrumbs={[
            { label: 'Text Utilities', href: '/text' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="Text Utilities" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed">
            Change the case of any text, turn it into a URL slug, and count its characters, words, lines, and bytes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
              <label htmlFor="text-input" className="text-xs font-bold uppercase tracking-widest text-gray-500">Text</label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full bg-white dark:bg-black border border-black dark:border-white p-4 text-sm font-mono text-black dark:text-white focus:outline-none focus:ring-0 resize-y"
              />
            </div>

            <table className="w-full border border-black dark:border-white text-sm">
              <tbody>
                {results.map(([name, value]) => (
                  <tr key={name} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                    <th scope="row" className="w-40 p-3 text-left text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-900 align-top">{name}</th>
                    <td className="p-3 font-mono break-all whitespace-pre-wrap">{value || <span className="text-gray-400">-</span>}</td>
                    <td className="w-12 p-3 text-right align-top">
                      <button
                        type="button"
                        onClick={() => copy(value, name)}
                        disabled={!value}
                        className="text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30"
                        aria-label={`Copy ${name}`}
                      >
                        <span className="material-symbols-outlined text-sm">{isCopied(name) ? 'check' : 'content_copy'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Statistics</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              {statRows.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="text-right font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
