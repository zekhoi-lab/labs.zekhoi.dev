export function Footer() {
  return (
    <footer className="border-t border-black dark:border-white mt-auto py-8 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">
        <p>© {new Date().getFullYear()} labs.zekhoi.dev</p>
      </div>
    </footer>
  )
}
