import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-black dark:border-white mt-auto py-8 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">
        <p>© {new Date().getFullYear()} labs.zekhoi.dev</p>
        <div className="flex items-center gap-6">
            <Link href="https://github.com/zekhoi" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                GitHub
            </Link>
            <Link href="https://linkedin.com/in/khoironiks" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">
                LinkedIn
            </Link>
        </div>
      </div>
    </footer>
  )
}
