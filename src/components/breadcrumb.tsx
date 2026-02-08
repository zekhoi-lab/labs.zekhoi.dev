import Link from 'next/link'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={index}>
              {index > 0 && (
                <li className="text-gray-400 dark:text-gray-600 select-none" aria-hidden="true">
                  /
                </li>
              )}
              <li className={cn(
                "flex items-center",
                isLast ? "font-bold text-black dark:text-white" : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              )}>
                {item.href && !isLast ? (
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
