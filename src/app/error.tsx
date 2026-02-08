'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white font-display min-h-screen flex flex-col overflow-hidden relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="absolute inset-0 scanlines z-0 pointer-events-none"></div>
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 font-mono text-xs tracking-widest z-20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        SYSTEM_OFFLINE
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[500px] bg-white dark:bg-black border border-black dark:border-white p-8 sm:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative">
          <div className="absolute top-[-1px] left-[-1px] w-3 h-3 border-l-2 border-t-2 border-black dark:border-white"></div>
          <div className="absolute top-[-1px] right-[-1px] w-3 h-3 border-r-2 border-t-2 border-black dark:border-white"></div>
          <div className="absolute bottom-[-1px] left-[-1px] w-3 h-3 border-l-2 border-b-2 border-black dark:border-white"></div>
          <div className="absolute bottom-[-1px] right-[-1px] w-3 h-3 border-r-2 border-b-2 border-black dark:border-white"></div>
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center text-center space-y-2 w-full">
              <span className="material-symbols-outlined text-4xl mb-2">dns</span>
              <h1 className="text-8xl sm:text-9xl font-bold tracking-tighter leading-none glitch-text relative select-none text-black dark:text-white" data-text="500">
                500
              </h1>
              <h2 className="text-sm font-mono font-bold tracking-[0.2em] uppercase mt-4 bg-black text-white dark:bg-white dark:text-black px-2 py-1">
                CRITICAL_SYSTEM_FAILURE
              </h2>
            </div>
            <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 font-mono text-[10px] sm:text-xs leading-relaxed text-gray-600 dark:text-gray-400 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-1 opacity-20 pointer-events-none select-none">
                <span className="material-symbols-outlined text-4xl">warning</span>
              </div>
              <p className="mb-2 border-b border-gray-200 dark:border-gray-800 pb-2 flex justify-between">
                <span>&gt; error.log</span>
                <span>root@labs.zekhoi</span>
              </p>
              <div className="space-y-1 opacity-80">
                <p className="text-red-600 font-bold">Error: {error.message || "Internal Server Error"}</p>
                <p>at /var/www/labs/core/kernel.js:402:12</p>
                <p>at processTicksAndRejections (internal/process/task_queues.js:97:5)</p>
                <p className="text-gray-400 dark:text-gray-500 break-all pt-2">Stack trace: 0x4F 0xA3 0x91 0x00 ... [BUFFER_OVERFLOW]</p>
                <p className="text-gray-400 dark:text-gray-500 break-all">Digest: {error.digest || "NULL"}</p>
              </div>
            </div>
            <button 
              onClick={() => reset()}
              className="w-full bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white py-3 px-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-3 group mt-2"
            >
              <span className="material-symbols-outlined text-lg group-hover:rotate-180 transition-transform duration-500">restart_alt</span>
              <span>REBOOT_SESSION</span>
            </button>
          </div>
          <div className="pt-6 mt-6 border-t border-dashed border-gray-300 dark:border-gray-700 flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-wide">
            <div>
              ID: ERR_500_ZK
            </div>
            <div className="flex items-center gap-1">
              <span>Attempting recovery</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
