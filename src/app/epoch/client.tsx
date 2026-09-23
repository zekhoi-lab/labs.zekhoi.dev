'use client'

import { useState, useEffect, useMemo, useSyncExternalStore } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

import { GlitchText } from '@/components/glitch-text'
import { useCopy } from '@/lib/use-copy'

// The digit count picks the unit: seconds (up to 11 digits, valid until year 5138),
// then milliseconds, microseconds and nanoseconds.
const EPOCH_UNITS = [
  { name: 'seconds', label: 'Sec', maxDigits: 11, toMs: 1000 },
  { name: 'milliseconds', label: 'Ms', maxDigits: 14, toMs: 1 },
  { name: 'microseconds', label: 'µs', maxDigits: 17, toMs: 1 / 1000 },
  { name: 'nanoseconds', label: 'Ns', maxDigits: Infinity, toMs: 1 / 1_000_000 },
] as const

const fieldValue = (value: number) => (Number.isNaN(value) ? '' : value)

type DateParts = { year: number, month: number, day: number, hour: number, minute: number, second: number }

const EMPTY_DATE_PARTS: DateParts = { year: NaN, month: NaN, day: NaN, hour: NaN, minute: NaN, second: NaN }

const toDateParts = (date: Date): DateParts => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
})

// When the page mounted in the browser. The prerendered HTML carries no time at
// all (server snapshot is null), so hydration matches and the defaults fill in
// right after. Refreshed on every mount so revisits start from the current time.
let mountTime: number | null = null
const subscribeMountTime = (onChange: () => void) => {
  mountTime = Date.now()
  onChange()
  return () => {}
}
const getMountTime = () => mountTime

export default function EpochConverter() {
  const mountedAt = useSyncExternalStore(subscribeMountTime, getMountTime, () => null)
  // Set by the ticking effect below; null until then (and in the prerendered HTML)
  const [currentEpoch, setCurrentEpoch] = useState<number | null>(null)
  const [displayUnit, setDisplayUnit] = useState<'seconds' | 'milliseconds'>('seconds')
  // null until edited: defaults to the mount time
  const [inputValue, setInputValue] = useState<string | null>(null)
  const epochInput = inputValue ?? (mountedAt === null ? '' : Math.floor(mountedAt / 1000).toString())
  const [humanDateInput, setHumanDateInput] = useState<DateParts | null>(null)
  const humanDate = humanDateInput ?? (mountedAt === null ? EMPTY_DATE_PARTS : toDateParts(new Date(mountedAt)))
  const [humanToEpochOutput, setHumanToEpochOutput] = useState<{ seconds: number, milliseconds: number } | null>(null)
  const [humanDateError, setHumanDateError] = useState<string | null>(null)

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

  const { convertedDate, detectedUnit, inputError } = useMemo(() => {
      const trimmed = epochInput.trim()
      if (!trimmed) {
          return { convertedDate: null, detectedUnit: null, inputError: null }
      }
      if (!/^-?\d+$/.test(trimmed)) {
          return { convertedDate: null, detectedUnit: null, inputError: 'Enter a whole number' }
      }
      const digits = trimmed.replace('-', '').length
      const unit = EPOCH_UNITS.find(u => digits <= u.maxDigits) ?? EPOCH_UNITS[EPOCH_UNITS.length - 1]
      const date = new Date(Number(trimmed) * unit.toMs)
      // Dates beyond ±8.64e15 ms are invalid; toISOString() would throw on them
      if (isNaN(date.getTime())) {
          return { convertedDate: null, detectedUnit: unit, inputError: 'Timestamp is out of range' }
      }
      return { convertedDate: date, detectedUnit: unit, inputError: null }
  }, [epochInput])

  const handleHumanDateConvert = () => {
      const { year, month, day, hour, minute, second } = humanDate
      const date = new Date(year, month - 1, day, hour, minute, second)
      if (Object.values(humanDate).some(Number.isNaN) || isNaN(date.getTime())) {
          setHumanToEpochOutput(null)
          setHumanDateError('Fill in every field with a valid number')
          return
      }
      setHumanDateError(null)
      setHumanToEpochOutput({
          seconds: Math.floor(date.getTime() / 1000),
          milliseconds: date.getTime()
      })
  }

  const { copy, isCopied } = useCopy()

  const formatWithTimezone = (date: Date) => {
      return {
          gmt: date.toUTCString(),
          local: date.toLocaleString() + ' ' + (/\((.*)\)/.exec(new Date().toString())?.[1] || ''),
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
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl">
                Convert Unix timestamps to human-readable dates and vice versa.
            </p>
        </div>

        <div className="mb-16">
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
                    {currentEpoch ?? '—'}
                </div>
                <div className="mt-4 text-sm opacity-50 font-mono">
                    {displayUnit} since Jan 01 1970 (UTC)
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                                value={epochInput} 
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 border-none focus:ring-0 font-mono text-lg p-2 bg-white dark:bg-black text-black dark:text-white min-w-0"
                                placeholder="Epoch timestamp..." 
                            />
                            {epochInput && detectedUnit && (
                                <span className="px-3 text-[10px] uppercase font-bold text-gray-400 whitespace-nowrap">
                                    {detectedUnit.label}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => setInputValue(String(currentEpoch ?? Math.floor(Date.now() / 1000)))}
                            className="text-xs uppercase font-bold tracking-wider px-4 py-3 sm:py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors bg-gray-50 dark:bg-gray-900 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-black dark:border-white sm:border-gray-100 dark:sm:border-gray-800 whitespace-nowrap"
                        >
                            Current
                        </button>
                    </div>

                    {inputError && (
                        <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-4">{inputError}</p>
                    )}

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
                                value={fieldValue(humanDate.year)}
                                onChange={(e) => setHumanDateInput({...humanDate, year: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mon</label>
                             <input 
                                type="number" 
                                value={fieldValue(humanDate.month)}
                                onChange={(e) => setHumanDateInput({...humanDate, month: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Day</label>
                             <input 
                                type="number" 
                                value={fieldValue(humanDate.day)}
                                onChange={(e) => setHumanDateInput({...humanDate, day: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Hr</label>
                             <input 
                                type="number" 
                                value={fieldValue(humanDate.hour)}
                                onChange={(e) => setHumanDateInput({...humanDate, hour: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Min</label>
                             <input 
                                type="number" 
                                value={fieldValue(humanDate.minute)}
                                onChange={(e) => setHumanDateInput({...humanDate, minute: parseInt(e.target.value)})}
                                className="w-full border border-black dark:border-white p-2 text-center font-mono focus:ring-0 focus:bg-gray-50 dark:focus:bg-gray-900 bg-white dark:bg-black text-black dark:text-white" 
                             />
                        </div>
                        <div className="space-y-1">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sec</label>
                             <input 
                                type="number" 
                                value={fieldValue(humanDate.second)}
                                onChange={(e) => setHumanDateInput({...humanDate, second: parseInt(e.target.value)})}
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

                    {humanDateError && (
                        <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-6">{humanDateError}</p>
                    )}

                    {humanToEpochOutput && (
                        <div className="flex flex-col gap-2">
                             <div className="bg-gray-50 dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 flex justify-between items-center group cursor-pointer hover:border-black dark:hover:border-white transition-colors" onClick={() => copy(humanToEpochOutput.seconds.toString(), 'seconds')}>
                                 <div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Epoch (Seconds)</span>
                                    <div className="font-mono font-bold text-sm">{humanToEpochOutput.seconds}</div>
                                 </div>
                                 <span className="material-symbols-outlined text-sm text-gray-400 group-hover:text-black dark:group-hover:text-white">{isCopied('seconds') ? 'check' : 'content_copy'}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 flex justify-between items-center group cursor-pointer hover:border-black dark:hover:border-white transition-colors" onClick={() => copy(humanToEpochOutput.milliseconds.toString(), 'milliseconds')}>
                                 <div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Epoch (Milliseconds)</span>
                                    <div className="font-mono font-bold text-sm">{humanToEpochOutput.milliseconds}</div>
                                 </div>
                                 <span className="material-symbols-outlined text-sm text-gray-400 group-hover:text-black dark:group-hover:text-white">{isCopied('milliseconds') ? 'check' : 'content_copy'}</span>
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
