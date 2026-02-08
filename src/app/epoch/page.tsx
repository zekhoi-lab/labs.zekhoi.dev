'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

export default function EpochConverter() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000))
  const [inputValue, setInputValue] = useState<string>('')
  const [convertedDate, setConvertedDate] = useState<Date | null>(null)
  const [humanDateInput, setHumanDateInput] = useState<{
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
  }>({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
      second: new Date().getSeconds()
  })
  const [humanToEpochOutput, setHumanToEpochOutput] = useState<number | null>(null)

  // Update current epoch every second
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentEpoch(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Provide initial input value matching current slightly for demo if empty?
  // Or just let user type.
  useEffect(() => {
      if (!inputValue) {
           setInputValue(Math.floor(Date.now() / 1000).toString())
      }
  }, []) // Start with something

  useEffect(() => {
     if (inputValue) {
         // Check if it's seconds or milliseconds
         // Most epoch converters handle both.
         // If length > 11, likely ms.
         let ts = parseInt(inputValue)
         if (!isNaN(ts)) {
            if (inputValue.length > 11) {
                // assume ms
            } else {
                ts = ts * 1000
            }
            setConvertedDate(new Date(ts))
         } else {
             setConvertedDate(null)
         }
     } else {
         setConvertedDate(null)
     }
  }, [inputValue])

  const handleHumanDateConvert = () => {
      const { year, month, day, hour, minute, second } = humanDateInput
      // Date constructor is 0-indexed for month
      const date = new Date(year, month - 1, day, hour, minute, second)
      setHumanToEpochOutput(Math.floor(date.getTime() / 1000))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatWithTimezone = (date: Date) => {
      // Manual formatting to match design or use intl
      // Design shows: "Mon, 11 Dec 2023 14:30:00 GMT" and Local
      return {
          gmt: date.toUTCString(),
          local: date.toLocaleString() + ' ' + /\((.*)\)/.exec(new Date().toString())?.[1] || '',
          iso: date.toISOString(),
          relative: getRelativeTime(date)
      }
  }

  const getRelativeTime = (date: Date) => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
      if (diff < 60) return `${diff} seconds ago`
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
      return `${Math.floor(diff / 86400)} days ago`
  }

  const dateInfo = convertedDate ? formatWithTimezone(convertedDate) : null

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar title="labs.zekhoi.dev" icon="terminal" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Epoch Converter</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Convert Unix timestamps to human-readable dates and vice versa.
            </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-black dark:bg-white text-white dark:text-black p-8 md:p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-75">Current Unix Epoch</p>
                <div className="text-5xl md:text-7xl font-bold tracking-tighter tabular-nums font-mono select-all">
                    {currentEpoch}
                </div>
                <div className="mt-4 text-sm opacity-50 font-mono">
                    seconds since Jan 01 1970 (UTC)
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Timestamp to Date */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-black dark:bg-white text-white dark:text-black">
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none">Timestamp to Date</h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Convert epoch to human readable</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-black border border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="flex items-center border border-black dark:border-white p-1 mb-6">
                        <input 
                            type="text" 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 border-none focus:ring-0 font-mono text-lg p-2 bg-white dark:bg-black text-black dark:text-white"
                            placeholder="Epoch timestamp..." 
                        />
                        <button 
                            onClick={() => setInputValue(currentEpoch.toString())}
                            className="text-xs uppercase font-bold tracking-wider px-3 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                            Current
                        </button>
                    </div>

                    {dateInfo && (
                        <div className="space-y-4 text-sm font-mono border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">GMT / UTC</span>
                                <div className="font-bold border-b border-gray-200 dark:border-gray-800 pb-1">{dateInfo.gmt}</div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Your Local Time</span>
                                <div className="font-bold border-b border-gray-200 dark:border-gray-800 pb-1">{dateInfo.local}</div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">ISO 8601</span>
                                <div className="text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 pb-1">{dateInfo.iso}</div>
                            </div>
                             <div>
                                <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Relative</span>
                                <div className="text-gray-600 dark:text-gray-300 italic">{dateInfo.relative}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Date to Timestamp */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-black dark:bg-white text-white dark:text-black">
                        <span className="material-symbols-outlined text-lg">schedule</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none">Date to Timestamp</h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Convert human readable to epoch</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-black border border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Year</label>
                             <input 
                                type="number" 
                                value={humanDateInput.year}
                                onChange={(e) => setHumanDateInput({...humanDateInput, year: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mon</label>
                             <input 
                                type="number" 
                                value={humanDateInput.month}
                                onChange={(e) => setHumanDateInput({...humanDateInput, month: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Day</label>
                             <input 
                                type="number" 
                                value={humanDateInput.day}
                                onChange={(e) => setHumanDateInput({...humanDateInput, day: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Hr</label>
                             <input 
                                type="number" 
                                value={humanDateInput.hour}
                                onChange={(e) => setHumanDateInput({...humanDateInput, hour: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Min</label>
                             <input 
                                type="number" 
                                value={humanDateInput.minute}
                                onChange={(e) => setHumanDateInput({...humanDateInput, minute: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sec</label>
                             <input 
                                type="number" 
                                value={humanDateInput.second}
                                onChange={(e) => setHumanDateInput({...humanDateInput, second: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                    </div>

                    <button 
                        onClick={handleHumanDateConvert}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-3 font-bold uppercase tracking-widest hover:opacity-80 transition-opacity mb-6"
                    >
                        Convert to Epoch
                    </button>

                    {humanToEpochOutput && (
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 border border-black dark:border-white flex justify-between items-center group cursor-pointer" onClick={() => copyToClipboard(humanToEpochOutput.toString())}>
                             <div>
                                <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Epoch Timestamp</span>
                                <div className="font-mono font-bold text-xl">{humanToEpochOutput}</div>
                             </div>
                             <span className="material-symbols-outlined text-gray-400 group-hover:text-black dark:group-hover:text-white">content_copy</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
