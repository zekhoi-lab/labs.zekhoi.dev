'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import ReactMarkdown from 'react-markdown'
import { GlitchText } from '@/components/glitch-text'
import Link from 'next/link'

const DEFAULT_MARKDOWN = `# Welcome to Labs Markdown Editor

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
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden">
      <Navbar 
        title="labs.zekhoi.dev" 
        breadcrumbs={[
            { label: 'Markdown Editor', href: '/editor' }
        ]}
      />
      
      {/* Mobile Tabs */}
      <div className="md:hidden flex h-12 border-b border-black dark:border-white shrink-0">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`flex-1 font-bold uppercase tracking-widest text-[10px] ${activeTab === 'edit' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
          >
              Edit
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex-1 font-bold uppercase tracking-widest text-[10px] ${activeTab === 'preview' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
          >
              Preview
          </button>
      </div>

      <main className="flex-1 w-full flex flex-col md:flex-row overflow-hidden">
          {/* Editor Pane */}
          <div className={`flex-1 flex-col border-r border-black dark:border-white ${activeTab === 'edit' ? 'flex' : 'hidden md:flex'}`}>
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
          <div className={`flex-1 flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
             <div className="h-10 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    <span>Preview</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="markdown-preview">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </div>
          </div>
      </main>
    </div>
  )
}
