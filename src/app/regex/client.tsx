'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

import { GlitchText } from '@/components/glitch-text'
import { useCopy } from '@/lib/use-copy'
import { findMatches, type FindResult } from './find-matches'

type RegexFlags = { global: boolean, multiline: boolean, insensitive: boolean, dotAll: boolean, unicode: boolean, sticky: boolean }
// `text` is the test string the result was computed for
type RunResult = FindResult & { time: number, text: string }

const FLAG_OPTIONS: { key: keyof RegexFlags, label: string }[] = [
  { key: 'global', label: 'global (g)' },
  { key: 'multiline', label: 'multiline (m)' },
  { key: 'insensitive', label: 'insensitive (i)' },
  { key: 'dotAll', label: 'dotAll (s)' },
  { key: 'unicode', label: 'unicode (u)' },
  { key: 'sticky', label: 'sticky (y)' },
]

const TIMEOUT_MS = 1000
const TABLE_ROWS = 100
const TIMEOUT_MESSAGE = 'Timed out after 1 s — the pattern may backtrack catastrophically on this input'

// The worker runs findMatches from its own source text, so no bundler worker support is needed
const WORKER_SOURCE = `const findMatches = (${findMatches.toString()});
self.onmessage = (event) => {
  const { id, expression, flags, text } = event.data;
  const started = performance.now();
  const result = findMatches(expression, flags, text);
  self.postMessage({ id, result, time: Math.round((performance.now() - started) * 10) / 10 });
};`

let workerUrl: string | null = null
function createWorker() {
  workerUrl ??= URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }))
  return new Worker(workerUrl)
}

const toFlagString = (flags: RegexFlags) =>
  `${flags.global ? 'g' : ''}${flags.insensitive ? 'i' : ''}${flags.multiline ? 'm' : ''}${flags.dotAll ? 's' : ''}${flags.unicode ? 'u' : ''}${flags.sticky ? 'y' : ''}`

export default function RegexTester() {
  const [expression, setExpression] = useState('([A-Z])\\w+')
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    multiline: true,
    insensitive: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  })
  const [testString, setTestString] = useState('The quick Brown Fox jumps over the lazy Dog.\nRegex is very powerful.\nzekhoi labs 2024.')
  const [result, setResult] = useState<RunResult | null>(null)
  const { copy, isCopied } = useCopy()
  const flagString = toFlagString(flags)

  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const jobRef = useRef(0)

  // Matching runs in a worker (debounced) and is abandoned after TIMEOUT_MS, so a
  // catastrophic pattern can't freeze the page. Only the callbacks set state.
  useEffect(() => {
    const debounce = setTimeout(() => {
      // A job still running is for stale input: kill its worker instead of queueing behind it
      if (pendingRef.current) {
        clearTimeout(pendingRef.current)
        pendingRef.current = null
        workerRef.current?.terminate()
        workerRef.current = null
      }
      const worker = workerRef.current ?? (workerRef.current = createWorker())
      const id = ++jobRef.current

      pendingRef.current = setTimeout(() => {
        pendingRef.current = null
        worker.terminate()
        if (workerRef.current === worker) workerRef.current = null
        setResult({ matches: [], truncated: false, error: TIMEOUT_MESSAGE, time: TIMEOUT_MS, text: testString })
      }, TIMEOUT_MS)

      worker.onmessage = (event: MessageEvent<{ id: number, result: FindResult, time: number }>) => {
        if (event.data.id !== id) return
        if (pendingRef.current) clearTimeout(pendingRef.current)
        pendingRef.current = null
        setResult({ ...event.data.result, time: event.data.time, text: testString })
      }
      worker.postMessage({ id, expression, flags: flagString, text: testString })
    }, 150)
    return () => clearTimeout(debounce)
  }, [expression, flagString, testString])

  // Stop any running match when leaving the page
  useEffect(() => {
    const worker = workerRef
    const pending = pendingRef
    return () => {
      if (pending.current) clearTimeout(pending.current)
      worker.current?.terminate()
    }
  }, [])

  // Highlight only a result that belongs to the text currently shown
  const matches = useMemo(() => (result && result.text === testString ? result.matches : []), [result, testString])

  const highlightedText = useMemo(() => {
      if (matches.length === 0) return testString

      let lastIndex = 0
      const parts = []

      for (const match of matches) {
          // Unmatched text before
          if (match.index > lastIndex) {
              parts.push(<span key={`text-${lastIndex}`}>{testString.slice(lastIndex, match.index)}</span>)
          }

          // Matched text
          parts.push(
            <span key={`match-${match.index}`} className="bg-gray-200 dark:bg-gray-700 border-b-2 border-black dark:border-white text-black dark:text-white">
                {match.text}
            </span>
          )

          lastIndex = match.index + match.text.length
      }

      // Remaining text
      if (lastIndex < testString.length) {
          parts.push(<span key={`text-end`}>{testString.slice(lastIndex)}</span>)
      }

      return parts
  }, [matches, testString])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        icon="terminal" 
        breadcrumbs={[
            { label: 'Regex Tester', href: '/regex' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="Regex Tester" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
            Test and validate regular expressions with real-time highlighting and reference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white dark:bg-black border border-black dark:border-white p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-stretch">
                        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-3 border-r border-black dark:border-white flex items-center justify-center font-bold text-gray-500 select-none">
                            /
                        </div>
                        <input 
                            type="text" 
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                            className="flex-1 border-none focus:ring-0 p-3 text-lg font-mono bg-white dark:bg-black placeholder-gray-300 text-black dark:text-white"
                            placeholder="expression..."
                        />
                        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-3 border-l border-black dark:border-white flex items-center justify-center font-bold text-gray-500 select-none">
                            /{flagString}
                        </div>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-500 flex justify-between items-center">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {FLAG_OPTIONS.map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer hover:text-black dark:hover:text-white">
                                    <input
                                        type="checkbox"
                                        checked={flags[key]}
                                        onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                                        className="rounded-none border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-0 w-3 h-3 bg-transparent"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider">Javascript Flavor</span>
                    </div>
                </div>

                <div className="flex flex-col flex-1 min-h-[500px] border border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-center justify-between border-b border-black dark:border-white p-3 bg-white dark:bg-black">
                        <h2 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">science</span>
                            Test String
                        </h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setTestString('')}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700" 
                                title="Clear"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                            <button 
                                onClick={() => copy(testString)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700" 
                                title="Copy"
                            >
                                <span className="material-symbols-outlined text-sm">{isCopied() ? 'check' : 'content_copy'}</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative flex-1 w-full h-full overflow-hidden">
                        {/* 
                            This is the tricky part. We want an editable textarea but also highlighted text.
                            Common technique: transparent textarea over a div.
                        */}
                        <textarea 
                            value={testString}
                            onChange={(e) => setTestString(e.target.value)}
                            className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-relaxed border-none focus:ring-0 resize-none z-10 bg-transparent text-transparent caret-black dark:caret-white selection:bg-gray-200 dark:selection:bg-gray-700"
                            spellCheck={false}
                        />
                        <div className="absolute inset-0 w-full h-full p-4 font-mono text-sm leading-relaxed z-0 whitespace-pre-wrap text-gray-400 pointer-events-none break-words">
                            {highlightedText}
                        </div>
                    </div>

                    <div className="border-t border-black dark:border-white p-2 bg-gray-50 dark:bg-gray-900 flex justify-between items-center text-xs">
                        <div className="flex gap-4 font-medium">
                            {result === null ? (
                                <span className="text-gray-400">Matching...</span>
                            ) : result.error ? (
                                <span className="text-red-600 font-bold">{result.error}</span>
                            ) : (
                                <>
                                    <span className="text-green-600 dark:text-green-400">{result.matches.length}{result.truncated ? '+' : ''} matches</span>
                                    <span className="text-gray-400">|</span>
                                    <span>{result.time}ms</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {matches.length > 0 && (
                    <div className="border border-black dark:border-white bg-white dark:bg-black overflow-x-auto">
                        <table aria-label="Matches" className="w-full text-xs font-mono">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-[10px] uppercase tracking-widest text-gray-500">
                                <tr>
                                    <th className="p-2 text-left w-10">#</th>
                                    <th className="p-2 text-left w-16">Index</th>
                                    <th className="p-2 text-left">Match</th>
                                    <th className="p-2 text-left">Groups</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.slice(0, TABLE_ROWS).map((match, i) => (
                                    <tr key={`${match.index}-${i}`} className="border-t border-gray-200 dark:border-gray-800 align-top">
                                        <td className="p-2 text-gray-400">{i + 1}</td>
                                        <td className="p-2 text-gray-500">{match.index}</td>
                                        <td className="p-2 font-bold whitespace-pre-wrap break-all">{match.text}</td>
                                        <td className="p-2 break-all">
                                            {match.groups.length === 0 && !match.named && <span className="text-gray-400">-</span>}
                                            {match.groups.map((group, g) => (
                                                <span key={g} className="inline-block mr-3">
                                                    <span className="text-gray-400">{'$' + (g + 1)}</span>{' '}
                                                    {group === null ? <span className="italic text-gray-400">undefined</span> : JSON.stringify(group)}
                                                </span>
                                            ))}
                                            {match.named && Object.entries(match.named).map(([name, value]) => (
                                                <span key={name} className="inline-block mr-3">
                                                    <span className="text-purple-600 dark:text-purple-400">{name}</span>{' '}
                                                    {value === null ? <span className="italic text-gray-400">undefined</span> : JSON.stringify(value)}
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {matches.length > TABLE_ROWS && (
                            <p className="p-2 border-t border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-widest text-gray-400">
                                {matches.length - TABLE_ROWS} more matches not listed
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="border border-black dark:border-white bg-white dark:bg-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-black dark:bg-white text-white dark:text-black">
                            <span className="material-symbols-outlined text-lg">school</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">Cheat Sheet</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Quick Reference</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        <CheatSheetSection title="Character Classes">
                            <CheatSheetItem code="." description="Any character" />
                            <CheatSheetItem code="\w" description="Word char" />
                            <CheatSheetItem code="\d" description="Digit" />
                            <CheatSheetItem code="\s" description="Whitespace" />
                            <CheatSheetItem code="[abc]" description="Any of a, b, or c" />
                            <CheatSheetItem code="[^abc]" description="Not a, b, or c" />
                        </CheatSheetSection>

                        <CheatSheetSection title="Quantifiers">
                            <CheatSheetItem code="*" description="0 or more" />
                            <CheatSheetItem code="+" description="1 or more" />
                            <CheatSheetItem code="?" description="0 or 1" />
                            <CheatSheetItem code="{3}" description="Exactly 3" />
                            <CheatSheetItem code="{3,}" description="3 or more" />
                        </CheatSheetSection>

                         <CheatSheetSection title="Anchors">
                            <CheatSheetItem code="^" description="Start of string" />
                            <CheatSheetItem code="$" description="End of string" />
                            <CheatSheetItem code="\b" description="Word boundary" />
                        </CheatSheetSection>

                        <CheatSheetSection title="Groups">
                            <CheatSheetItem code="(...)" description="Capture group" />
                            <CheatSheetItem code="(?:...)" description="Non-capturing" />
                        </CheatSheetSection>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:text-black dark:hover:text-white hover:underline flex items-center gap-1">
                            View full documentation
                            <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                        </a>
                    </div>
                </div>

                <div className="border border-black dark:border-white bg-gray-50 dark:bg-gray-900 p-6 opacity-75">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-gray-500">info</span>
                        <h3 className="font-bold text-sm uppercase tracking-wider">Match Info</h3>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                         <p>Matches are highlighted in the text area, and each match&apos;s capture groups are listed below it.</p>
                         <p>Matching runs in a background worker and stops after 1 second, so a runaway pattern can&apos;t freeze the page.</p>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function CheatSheetSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div>
            <h4 className="text-xs font-bold uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 pb-2 mb-3 text-gray-400">{title}</h4>
            <ul className="space-y-2 text-xs">
                {children}
            </ul>
        </div>
    )
}

function CheatSheetItem({ code, description }: { code: string, description: string }) {
    return (
        <li className="flex justify-between items-center group cursor-pointer">
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 border border-gray-200 dark:border-gray-700 group-hover:border-black dark:group-hover:border-white group-hover:bg-white dark:group-hover:bg-black transition-colors rounded-sm">{code}</code>
            <span className="text-gray-600 dark:text-gray-400">{description}</span>
        </li>
    )
}
