'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

import { GlitchText } from '@/components/glitch-text'

export default function EpochConverter() {
  // Fix: Use lazy initializer for Date.now() to avoid impurity error
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000))
  const [displayUnit, setDisplayUnit] = useState<'seconds' | 'milliseconds'>('seconds')
  const [inputValue, setInputValue] = useState<string>('')
  const [convertedDate, setConvertedDate] = useState<Date | null>(null)
  const [detectedUnit, setDetectedUnit] = useState<'seconds' | 'milliseconds' | null>(null)
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
  const [humanToEpochOutput, setHumanToEpochOutput] = useState<{ seconds: number, milliseconds: number } | null>(null)

  // Update current epoch every second (or faster for ms)
  useEffect(() => {
    const update = () => {
        if (displayUnit === 'seconds') {
            setCurrentEpoch(Math.floor(Date.now() / 1000))
        } else {
            setCurrentEpoch(Date.now())
        }
    }
    
    update() // Call immediately on switch
    
    const timer = setInterval(update, displayUnit === 'seconds' ? 1000 : 50)
    return () => clearInterval(timer)
  }, [displayUnit])

  // Provide initial input value matching current slightly for demo if empty?
  useEffect(() => {
    // Only run once on mount
    if (!inputValue) {
         setInputValue(Math.floor(Date.now() / 1000).toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 

  useEffect(() => {
     if (inputValue) {
         let ts = parseInt(inputValue)
         if (!isNaN(ts)) {
            // Simple heuristic: > 10000000000 indicates ms (valid for dates after 1970-04-26)
            // Or typically 13 chars vs 10 chars.
            // 2024 is ~1700000000 (10 digits)
            // 2024 in ms is ~1700000000000 (13 digits)
            if (inputValue.length > 11) {
                setDetectedUnit('milliseconds')
            } else {
                ts = ts * 1000
                setDetectedUnit('seconds')
            }
            setConvertedDate(new Date(ts))
         } else {
             setConvertedDate(null)
             setDetectedUnit(null)
         }
     } else {
         setConvertedDate(null)
         setDetectedUnit(null)
     }
  }, [inputValue])

  const handleHumanDateConvert = () => {
      const { year, month, day, hour, minute, second } = humanDateInput
      const date = new Date(year, month - 1, day, hour, minute, second)
      setHumanToEpochOutput({
          seconds: Math.floor(date.getTime() / 1000),
          milliseconds: date.getTime()
      })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatWithTimezone = (date: Date) => {
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
      if (diff < 60 && diff > -60) return `${Math.abs(diff)} seconds ${diff < 0 ? 'from now' : 'ago'}`
      if (diff < 3600 && diff > -3600) return `${Math.floor(Math.abs(diff) / 60)} minutes ${diff < 0 ? 'from now' : 'ago'}`
      if (diff < 86400 && diff > -86400) return `${Math.floor(Math.abs(diff) / 3600)} hours ${diff < 0 ? 'from now' : 'ago'}`
      return `${Math.floor(Math.abs(diff) / 86400)} days ${diff < 0 ? 'from now' : 'ago'}`
  }

  const dateInfo = convertedDate ? formatWithTimezone(convertedDate) : null

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar 
        title="labs.zekhoi.dev" 
        icon="terminal" 
        breadcrumbs={[
            { label: 'Epoch Converter', href: '/epoch' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
              <GlitchText text="Epoch Converter" />
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Convert Unix timestamps to human-readable dates and vice versa.
            </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-black dark:bg-white text-white dark:text-black p-8 md:p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] relative">
                <div className="flex justify-center md:absolute md:top-4 md:right-4 gap-2 mb-2 md:mb-0">
                    <button 
                         onClick={() => setDisplayUnit('seconds')}
                         className={cn(
                             "text-[10px] uppercase font-bold tracking-wider px-2 py-1 transition-colors border",
                             displayUnit === 'seconds' 
                                ? "bg-white text-black border-white" 
                                : "text-gray-500 border-transparent hover:text-white dark:hover:text-black"
                         )}
                    >
                         Seconds
                    </button>
                    <button 
                         onClick={() => setDisplayUnit('milliseconds')}
                         className={cn(
                             "text-[10px] uppercase font-bold tracking-wider px-2 py-1 transition-colors border",
                             displayUnit === 'milliseconds' 
                                ? "bg-white text-black border-white" 
                                : "text-gray-500 border-transparent hover:text-white dark:hover:text-black"
                         )}
                    >
                         Milliseconds
                    </button>
                </div>

                <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-75 md:pt-0">Current Unix Epoch</p>
                <div className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter tabular-nums font-mono select-all overflow-hidden text-ellipsis">
                    {currentEpoch}
                </div>
                <div className="mt-4 text-sm opacity-50 font-mono">
                    {displayUnit} since Jan 01 1970 (UTC)
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center border border-black dark:border-white p-1 mb-6 gap-1">
                        <div className="flex-1 flex items-center min-w-0">
                            <input 
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 border-none focus:ring-0 font-mono text-lg p-2 bg-white dark:bg-black text-black dark:text-white min-w-0"
                                placeholder="Epoch timestamp..." 
                            />
                            {inputValue && detectedUnit && (
                                <span className="px-3 text-[10px] uppercase font-bold text-gray-400 whitespace-nowrap">
                                    {detectedUnit === 'seconds' ? 'Sec' : 'Ms'}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => setInputValue(currentEpoch.toString())}
                            className="text-xs uppercase font-bold tracking-wider px-4 py-3 sm:py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors bg-gray-50 dark:bg-gray-900 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-black dark:border-white sm:border-gray-100 dark:sm:border-gray-800 whitespace-nowrap"
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
                        <div className="flex flex-col gap-2">
                             <div className="bg-gray-50 dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 flex justify-between items-center group cursor-pointer hover:border-black dark:hover:border-white transition-colors" onClick={() => copyToClipboard(humanToEpochOutput.seconds.toString())}>
                                 <div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Epoch (Seconds)</span>
                                    <div className="font-mono font-bold text-sm">{humanToEpochOutput.seconds}</div>
                                 </div>
                                 <span className="material-symbols-outlined text-sm text-gray-400 group-hover:text-black dark:group-hover:text-white">content_copy</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 flex justify-between items-center group cursor-pointer hover:border-black dark:hover:border-white transition-colors" onClick={() => copyToClipboard(humanToEpochOutput.milliseconds.toString())}>
                                 <div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Epoch (Milliseconds)</span>
                                    <div className="font-mono font-bold text-sm">{humanToEpochOutput.milliseconds}</div>
                                 </div>
                                 <span className="material-symbols-outlined text-sm text-gray-400 group-hover:text-black dark:group-hover:text-white">content_copy</span>
                            </div>
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
