import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  icon: string
  href: string
  version?: string
}

export function ToolCard({ title, description, icon, href, version }: ToolCardProps) {
  return (
    <Link href={href} className="fragment-card bg-white dark:bg-black border border-black dark:border-white p-6 flex flex-col gap-4 h-full group hover:shadow-none transition-all">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {version && (
          <span className="text-[10px] bg-gray-100 dark:bg-gray-900 px-2 py-1 uppercase tracking-wider text-black dark:text-white border border-transparent dark:border-gray-800">
            {version}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-black dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto pt-4 flex items-center text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-black dark:text-white">
        <span>Launch</span>
        <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
      </div>
    </Link>
  )
}
