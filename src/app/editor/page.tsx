'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

const DEFAULT_MARKDOWN = `# Welcome to Labs Code Editor

This is a **minimalist** markdown editor with live preview.
Calculated for speed and focus.

## Features
- live **preview**
- distraction free
- _fast_ updates

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

> "Simplicity is the ultimate sophistication."
> — Leonardo da Vinci
`

export default function Editor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden">
      <Navbar title="labs.zekhoi.dev" />
      
      <div className="border-b border-black dark:border-white bg-white dark:bg-black flex items-center justify-between px-6 py-2 sticky top-[64px] z-40">
        <div className="flex items-center gap-4">
             <Link href="/" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white inline-flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-xs">arrow_back</span>
                Dashboard
            </Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-sm font-medium tracking-tight">Markdown Preview</span>
        </div>
      </div>

      <main className="flex-1 w-full flex overflow-hidden h-[calc(100vh-110px)]">
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-r border-black dark:border-white">
            <div className="h-10 border-b border-black dark:border-white bg-white dark:bg-black flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    <span>Editor</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setMarkdown('')}
                            className="hover:text-black dark:hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                        <button 
                            onClick={() => navigator.clipboard.writeText(markdown)}
                            className="hover:text-black dark:hover:text-white transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                </div>
                <div className="text-[10px] text-gray-400">
                    UTF-8 • Markdown
                </div>
            </div>
            <textarea 
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 w-full p-6 text-sm resize-none focus:ring-0 border-none outline-none font-mono leading-relaxed bg-white dark:bg-black text-black dark:text-white"
                placeholder="Type markdown here..."
                spellCheck={false}
            />
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
             <div className="h-10 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    <span>Preview</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="markdown-preview">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </div>
        </div>
      </main>
    </div>
  )
}
