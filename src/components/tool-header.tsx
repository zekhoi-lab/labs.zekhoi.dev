'use client'

import { GlitchText } from '@/components/glitch-text'
import Link from 'next/link'

interface Breadcrumb {
    label: string
    href?: string
}

interface ToolHeaderProps {
    title: string
    description: string
    breadcrumbs: Breadcrumb[]
    meta?: React.ReactNode
}

export function ToolHeader({ title, description, breadcrumbs, meta }: ToolHeaderProps) {
    return (
        <div className="mb-12 space-y-4">
            <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-[0.2em] mb-2 font-mono">
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && <span>/</span>}
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:text-white transition-colors">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-white">{crumb.label}</span>
                        )}
                    </div>
                ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
                <GlitchText text={title} />
            </h1>
            <p className="text-white/60 max-w-2xl text-sm leading-relaxed font-mono">
                {description}
            </p>
            {meta && <div className="mt-4">{meta}</div>}
        </div>
    )
}
