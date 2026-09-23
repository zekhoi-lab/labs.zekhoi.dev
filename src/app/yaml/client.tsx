'use client'

import { useMemo, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GlitchText } from '@/components/glitch-text'
import { cn } from '@/lib/utils'
import { useCopy } from '@/lib/use-copy'
import { jsonToYaml, yamlToJson } from '@/lib/yaml-json'

type Direction = 'yaml-to-json' | 'json-to-yaml'

const DIRECTIONS: { value: Direction, label: string }[] = [
  { value: 'yaml-to-json', label: 'YAML → JSON' },
  { value: 'json-to-yaml', label: 'JSON → YAML' },
]

const SAMPLE = `name: labs.zekhoi.dev
tools:
  - uuid
  - json
  - yaml
settings:
  theme: system
  private: false
`

export default function YamlConverter() {
  const [direction, setDirection] = useState<Direction>('yaml-to-json')
  const [input, setInput] = useState(SAMPLE)
  const [indent, setIndent] = useState(2)
  const { copy, isCopied } = useCopy()

  const result = useMemo(
    () => (direction === 'yaml-to-json' ? yamlToJson(input, indent) : jsonToYaml(input, indent)),
    [direction, input, indent]
  )
  const [from, to] = direction === 'yaml-to-json' ? ['YAML', 'JSON'] : ['JSON', 'YAML']

  // Switching direction carries a valid result over as the new input
  const changeDirection = (next: Direction) => {
    if (next === direction) return
    if (result.ok && result.output) setInput(result.output)
    setDirection(next)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar
        title="labs.zekhoi.dev"
        icon="terminal"
        breadcrumbs={[
            { label: 'YAML ↔ JSON', href: '/yaml' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="YAML ↔ JSON" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed">
            Convert YAML to JSON and back as you type. Syntax errors show their line and column. Nothing leaves your browser.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex border border-black dark:border-white p-1 bg-gray-100 dark:bg-gray-900">
            {DIRECTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => changeDirection(value)}
                className={cn(
                  "px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all",
                  direction === value
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Indent
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value))}
              className="bg-white dark:bg-black border border-black dark:border-white px-3 py-2 text-sm text-black dark:text-white focus:ring-0"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col border border-black dark:border-white bg-white dark:bg-black min-h-[480px]">
            <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
              <span>Input ({from})</span>
              <button type="button" onClick={() => setInput('')} className="text-gray-500 hover:text-black dark:hover:text-white">Clear</button>
            </div>
            <textarea
              aria-label={`Input ${from}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              placeholder={`Paste ${from} here...`}
              className="flex-1 p-4 resize-none border-none focus:ring-0 font-mono text-xs md:text-sm leading-relaxed bg-transparent text-black dark:text-white"
            />
          </div>

          <div className="flex flex-col border border-black dark:border-white bg-white dark:bg-black min-h-[480px]">
            <div className="p-3 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
              <span>Output ({to})</span>
              <button
                type="button"
                onClick={() => result.ok && copy(result.output)}
                disabled={!result.ok || !result.output}
                className="flex items-center gap-1 text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-sm">{isCopied() ? 'check' : 'content_copy'}</span>
                {isCopied() ? 'Copied' : 'Copy'}
              </button>
            </div>
            {result.ok ? (
              <textarea
                aria-label={`Output ${to}`}
                readOnly
                value={result.output}
                spellCheck={false}
                placeholder={`${to} will appear here...`}
                className="flex-1 p-4 resize-none border-none focus:ring-0 font-mono text-xs md:text-sm leading-relaxed bg-transparent text-black dark:text-white"
              />
            ) : (
              <div className="flex-1 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-mono text-sm">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <span className="material-symbols-outlined">error</span>
                  Invalid {from}
                </div>
                {result.line !== null && result.column !== null && (
                  <div className="mb-2 font-bold">Line {result.line}, column {result.column}</div>
                )}
                <div className="break-words">{result.error}</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
