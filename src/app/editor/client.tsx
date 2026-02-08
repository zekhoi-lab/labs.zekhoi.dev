'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import ReactMarkdown from 'react-markdown'
import { GlitchText } from '@/components/glitch-text'

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
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        breadcrumbs={[
            { label: 'Markdown Editor', href: '/editor' }
        ]}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
        <div className="shrink-0 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
              <GlitchText text="Markdown Editor" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
              Professional grade markdown visualization with zero latency.
            </p>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex h-12 border border-black dark:border-white shrink-0">
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

        <div className="flex-1 w-full flex flex-col md:flex-row border border-black dark:border-white bg-white dark:bg-black min-h-[600px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            {/* Editor Pane */}
            <div className={`flex-1 flex-col border-r border-black dark:border-white ${activeTab === 'edit' ? 'flex' : 'hidden md:flex'}`}>
              <div className="h-10 border-b border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex items-center px-4 justify-between shrink-0">
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
                  className="flex-1 w-full p-6 text-sm resize-none focus:ring-0 border-none outline-none font-mono leading-relaxed bg-transparent text-black dark:text-white"
                  placeholder="Type markdown here..."
                  spellCheck={false}
              />
            </div>

            {/* Preview Pane */}
            <div className={`flex-1 flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
               <div className="h-10 border-b border-black dark:border-white flex items-center px-4 justify-between shrink-0">
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                      <span>Preview</span>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <div className="markdown-preview max-w-none prose dark:prose-invert">
                      <ReactMarkdown>{markdown}</ReactMarkdown>
                  </div>
              </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
