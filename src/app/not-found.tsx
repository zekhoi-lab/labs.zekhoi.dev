import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col overflow-hidden relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="absolute inset-0 scanlines z-0 pointer-events-none"></div>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="absolute top-8 right-8 flex items-center gap-2 font-mono text-xs tracking-widest opacity-60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          SYSTEM_ERROR
        </div>
        <div className="w-full max-w-[420px] bg-white dark:bg-gray-900 border border-black dark:border-gray-700 p-8 sm:p-12 shadow-none relative">
          <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-l border-t border-black dark:border-white"></div>
          <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-r border-t border-black dark:border-white"></div>
          <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-l border-b border-black dark:border-white"></div>
          <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-r border-b border-black dark:border-white"></div>
          <div className="flex flex-col gap-8 items-center text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="material-symbols-outlined text-4xl text-black dark:text-white">warning</span>
              </div>
              <div className="relative">
                <h1 className="text-8xl font-bold tracking-tighter animate-flicker glitch-wrapper font-mono text-black dark:text-white">
                  404
                </h1>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm font-bold uppercase tracking-widest text-black dark:text-white font-mono border-b border-black dark:border-white inline-block pb-1">
                  ERROR: RESOURCE_NOT_FOUND
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono pt-4 leading-relaxed">
                  <span className="text-primary">&gt;</span> The requested sequence is missing from the server index.<br />
                  <span className="text-primary">&gt;</span> Please verify URL coordinates.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full mt-4">
              <Link href="/" className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group rounded-sm border border-transparent hover:border-primary/50">
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">keyboard_return</span>
                <span>RETURN_TO_BASE</span>
              </Link>
            </div>
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 w-full flex justify-between items-end text-[10px] font-mono text-gray-400">
              <div className="flex flex-col gap-1 text-left">
                <span>ERR_CODE: 0x404</span>
                <span>STACK: NULL</span>
              </div>
              <div>
                // END_OF_LINE
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 dark:from-black to-transparent -z-10"></div>
      </div>
    </div>
  )
}
