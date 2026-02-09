'use client'

import { ReactNode } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface PrivateToolLayoutProps {
    children: ReactNode
    rightContent?: ReactNode
}

export function PrivateToolLayout({ children, rightContent }: PrivateToolLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col relative font-mono selection:bg-white selection:text-black bg-black text-white dark">
            <Navbar
                title="labs.zekhoi.dev"
                icon="terminal"
                rightContent={
                    rightContent || (
                        <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="text-white/80">Secure Session</span>
                            </div>
                            <button className="hover:underline">Logout</button>
                        </div>
                    )
                }
            />
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
                {children}
            </main>
            <Footer />
        </div>
    )
}
