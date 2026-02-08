'use client'

import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  title?: string
  icon?: string
  statusLabel?: string
  statusColor?: string
  searchPlaceholder?: string
  statusHref?: string
}

export function Navbar({ 
  title = "labs.zekhoi.dev", 
  icon = "terminal", 
  statusLabel, 
  statusColor = "green-500",
  searchPlaceholder = "Search tools (cmd + k)",
  statusHref
}: NavbarProps) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const currentStatusLabel = statusLabel || (isOnline ? 'System Normal' : 'System Offline')
  const currentStatusColor = isOnline ? statusColor : 'red-500'

  const StatusContent = () => (
    <div className={cn(
      "hidden sm:flex items-center gap-2",
      statusHref && "cursor-pointer hover:opacity-80 transition-opacity"
    )}>
      <div className={cn(
        "w-2 h-2 rounded-full",
        isOnline ? `bg-${currentStatusColor} animate-pulse` : "bg-red-500"
      )}></div>
      <span>{currentStatusLabel}</span>
    </div>
  )

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity flex items-center gap-2 text-black dark:text-white">
            <span className="material-symbols-outlined text-xl">{icon}</span>
            {title}
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input 
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white focus:ring-0 pl-10 pr-4 py-1.5 text-sm placeholder:text-gray-400 transition-colors outline-none font-mono rounded-none text-black dark:text-white" 
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {statusHref ? (
            <Link href={statusHref}>
              <StatusContent />
            </Link>
          ) : (
            <StatusContent />
          )}
          <form action={logout}>
            <button type="submit" className="hover:text-black dark:hover:text-white transition-colors uppercase">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
