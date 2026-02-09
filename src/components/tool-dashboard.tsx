import { ReactNode } from 'react'
import { Navbar, NavbarProps } from '@/components/navbar'
import { ToolCard } from '@/components/tool-card'
import { Footer } from '@/components/footer'

interface Tool {
    title: string
    description: string
    icon: string
    href: string
    version?: string
}

interface ToolDashboardProps {
    title: ReactNode
    description: string
    tools: Tool[]
    theme?: 'default' | 'private'
    navbarProps?: Partial<NavbarProps>
}

export function ToolDashboard({
    title,
    description,
    tools,
    theme = 'default',
    navbarProps
}: ToolDashboardProps) {
    const isPrivate = theme === 'private'

    return (
        <div className={`min-h-screen flex flex-col relative font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black ${isPrivate
            ? 'bg-black text-white dark'
            : 'bg-white dark:bg-black text-black dark:text-white'
            }`}>
            <Navbar {...navbarProps} />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
                <div className="mb-16 space-y-4">
                    <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter uppercase ${isPrivate ? 'text-white' : 'text-black dark:text-white'
                        }`}>
                        {title}
                    </h1>
                    <p className={`max-w-2xl text-sm md:text-base leading-relaxed ${isPrivate ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                        <ToolCard
                            key={tool.href}
                            {...tool}
                        // Pass a "private" flag to ToolCard if needed for specific styling overrides,
                        // though currently ToolCard handles dark mode via class names which should work 
                        // if we force a dark theme wrapper.
                        />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
