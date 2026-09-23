'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useOnlineStatus } from '@/lib/use-online-status'

import { Breadcrumb, BreadcrumbItem } from '@/components/breadcrumb'

export interface NavbarProps {
  title?: string
  icon?: string
  statusLabel?: string
  breadcrumbs?: BreadcrumbItem[]
  centerContent?: React.ReactNode
  rightContent?: React.ReactNode
}

export function Navbar({
  title = "labs.zekhoi.dev",
  icon = "terminal",
  statusLabel,
  breadcrumbs,
  centerContent,
  rightContent,
}: NavbarProps) {
  const isOnline = useOnlineStatus()
  const currentStatusLabel = statusLabel || (isOnline ? 'System Normal' : 'System Offline')

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity flex items-center gap-2 text-black dark:text-white">
            <span className="material-symbols-outlined text-xl">{icon}</span>
            {title}
          </Link>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-gray-300 dark:border-gray-700 h-6">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          {centerContent}
        </div>

        <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
          <StatusContent
            isOnline={isOnline}
            currentStatusLabel={currentStatusLabel}
          />
          {rightContent}
        </div>
      </div>
    </nav>
  )
}

function StatusContent({
  isOnline,
  currentStatusLabel,
}: {
  isOnline: boolean
  currentStatusLabel: string
}) {
  return (
    <div className={cn(
      "hidden sm:flex items-center gap-2",
    )}>
      <div className={cn(
        "w-2 h-2 rounded-full",
        isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
      )}></div>
      <span>{currentStatusLabel}</span>
    </div>
  )
}
