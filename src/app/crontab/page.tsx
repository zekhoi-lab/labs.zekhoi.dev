'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import cronstrue from 'cronstrue'
import { CronExpressionParser } from 'cron-parser'
import { cn } from '@/lib/utils'

export default function CrontabGenerator() {
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [weekday, setWeekday] = useState('*')
  
  const [cronString, setCronString] = useState('* * * * *')
  const [description, setDescription] = useState('')
  const [nextRuns, setNextRuns] = useState<string[]>([])
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    const str = `${minute} ${hour} ${day} ${month} ${weekday}`
    setCronString(str)

    try {
      const desc = cronstrue.toString(str)
      setDescription(desc)
      
      const interval = CronExpressionParser.parse(str)
      const runs = []
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toString())
      }
      setNextRuns(runs)
      setIsValid(true)
    } catch {
      setDescription('Invalid Cron Expression')
      setNextRuns([])
      setIsValid(false)
    }
  }, [minute, hour, day, month, weekday])

  const applyPreset = (preset: string) => {
    switch (preset) {
      case '@hourly':
        setMinute('0'); setHour('*'); setDay('*'); setMonth('*'); setWeekday('*');
        break;
      case '@daily':
        setMinute('0'); setHour('0'); setDay('*'); setMonth('*'); setWeekday('*');
        break;
      case '@weekly':
        setMinute('0'); setHour('0'); setDay('*'); setMonth('*'); setWeekday('0');
        break;
      case '@monthly':
        setMinute('0'); setHour('0'); setDay('1'); setMonth('*'); setWeekday('*');
        break;
      case '@yearly':
        setMinute('0'); setHour('0'); setDay('1'); setMonth('1'); setWeekday('*');
        break;
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar title="labs.zekhoi.dev" />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 border border-black dark:border-white text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-black text-black dark:text-white">
            <span className="material-symbols-outlined text-xs">schedule</span> Tool ID: CRON-GEN
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Crontab Generator</h1>
          <div className="bg-black dark:bg-white text-white dark:text-black p-6 border border-black dark:border-white flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">Next Execution</p>
              <p className="text-lg md:text-xl font-medium italic">“{description}”</p>
            </div>
            <div className="hidden md:block">
              <span className="material-symbols-outlined text-4xl opacity-50">auto_awesome</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Minute', val: minute, set: setMinute, hint: '0-59 or *' },
            { label: 'Hour', val: hour, set: setHour, hint: '0-23 or *' },
            { label: 'Day (Month)', val: day, set: setDay, hint: '1-31 or *' },
            { label: 'Month', val: month, set: setMonth, hint: '1-12 or *' },
            { label: 'Weekday', val: weekday, set: setWeekday, hint: '0-6 (Sun-Sat)' },
          ].map((field) => (
             <div key={field.label} className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{field.label}</label>
                <input 
                  className={cn(
                    "cron-input w-full border border-black dark:border-white bg-white dark:bg-black p-4 font-mono text-center text-xl transition-all outline-none text-black dark:text-white",
                    !isValid && "border-red-500"
                  )}
                  type="text" 
                  value={field.val}
                  onChange={(e) => field.set(e.target.value)}
                />
                <p className="text-[9px] text-gray-400 uppercase text-center">{field.hint}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Generated Cron Expression</label>
          <div className="relative group">
            <div className="w-full bg-white dark:bg-black border border-black dark:border-white p-8 md:p-12 text-center">
              <span className="text-4xl md:text-6xl font-bold tracking-widest select-all text-black dark:text-white">{cronString}</span>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(cronString)}
              className="action-button absolute right-4 bottom-4 md:right-8 md:bottom-8 bg-black dark:bg-white text-white dark:text-black px-6 py-3 flex items-center gap-2 font-bold uppercase text-xs tracking-widest transition-all"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copy
            </button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-gray-400">Quick Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['@hourly', '@daily', '@weekly', '@monthly'].map(preset => (
                <button 
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className="action-button border border-black dark:border-white p-4 text-xs font-bold uppercase tracking-widest bg-white dark:bg-black text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-left"
                >
                  {preset}
                </button>
             ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
