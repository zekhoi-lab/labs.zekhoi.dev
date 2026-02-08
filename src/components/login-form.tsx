'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

type LoginState = 'idle' | 'loading' | 'invalid' | 'limit' | 'success'

import { useMutation } from '@tanstack/react-query'

export function LoginForm() {
  const [state, setState] = useState<LoginState>('idle')
  const [password, setPassword] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [timeLeft, setTimeLeft] = useState(60)
  const [latency, setLatency] = useState(12)
  const [progress, setProgress] = useState(0)
  const [clientIp, setClientIp] = useState('127.0.0.1')
  const [errorId, setErrorId] = useState('ERR-0000')
  const [sessionId, setSessionId] = useState('SID-0000')
  const [errorMessage, setErrorMessage] = useState('ERROR_INVALID_TOKEN')
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      setState('loading')
      setProgress(0)

      const startTime = Date.now()
      const duration = 1500 // Match the auth delay

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min(100, Math.floor((elapsed / duration) * 100))
        setProgress(newProgress)
        
        if (newProgress >= 100) {
          clearInterval(progressInterval)
        }
      }, 50)
      
      return { progressInterval }
    },
    onSuccess: (result, _variables, context) => {
      clearInterval(context?.progressInterval)
      
      if (result.success) {
        setState('success')
        router.push('/')
      } else {
        if (result.error === 'limit') {
          setState('limit')
          setTimeLeft(60)
        } else {
          setAttempts(result.attempts || attempts + 1)
          setErrorMessage('ERROR_INVALID_TOKEN')
          setState('invalid')
        }
      }
    },
    onError: (error, _variables, context) => {
      clearInterval(context?.progressInterval)
      console.error('Login error:', error)
      setErrorMessage('ERROR_SYSTEM_FAILURE')
      setState('invalid')
    }
  })

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (state === 'limit') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setState('idle')
            setAttempts(0)
            return 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)

  }, [state])

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * (45 - 10 + 1) + 10))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Generate static random IDs on mount
    setErrorId(`ERR-${Math.floor(Math.random() * 9000 + 1000)}`)
    setSessionId(`SID-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`)

    // Fetch real IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setClientIp(data.ip))
      .catch(() => setClientIp('127.0.0.1')) // Fallback
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (state === 'loading' || state === 'limit') return

    if (!password.trim()) {
      setErrorMessage('ERROR_MISSING_INPUT')
      setState('invalid')
      return
    }

    mutation.mutate(password)
  }

  // Handle typing to clear invalid state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state === 'invalid') setState('idle')
    setPassword(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSubmit()
    }
  }

  // --- RENDER HELPERS ---

  if (state === 'limit') {
    return (
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 font-mono text-xs tracking-widest opacity-80 text-red-600 dark:text-red-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          SYSTEM_LOCKED
        </div>
        <div className="w-full max-w-[420px] bg-white dark:bg-gray-900 border border-black dark:border-gray-700 p-6 sm:p-12 shadow-none relative overflow-hidden">
          <div className="absolute inset-0 z-20 pointer-events-none opacity-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1))] bg-[length:100%_3px]"></div>
          <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-l border-t border-red-600 dark:border-red-500"></div>
          <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-r border-t border-red-600 dark:border-red-500"></div>
          <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-l border-b border-red-600 dark:border-red-500"></div>
          <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-r border-b border-red-600 dark:border-red-500"></div>
          
          <div className="flex flex-col gap-8 relative z-10">
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 text-red-600 dark:text-red-500">
                <span className="material-symbols-outlined text-4xl animate-pulse-fast">lock_clock</span>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 mb-2">
                <h1 className="text-xl font-bold font-mono tracking-tighter text-red-700 dark:text-red-400">
                  ACCESS_SUSPENDED
                </h1>
              </div>
              <p className="text-xs uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 font-mono leading-relaxed">
                // Too many failed attempts detected.<br/>
                // Rate limiter active on IP: {clientIp}
              </p>
            </div>
            
            <div className="text-center py-4 border-y border-dashed border-gray-300 dark:border-gray-700">
              <span className="text-xs font-mono text-gray-500 dark:text-gray-500 block mb-1">COOLDOWN SEQUENCE ACTIVE</span>
              <div className="font-mono text-3xl font-bold tracking-widest text-gray-900 dark:text-gray-100">
                RETRY_IN: <span className="text-red-600 dark:text-red-500">{timeLeft}S</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 opacity-50 grayscale pointer-events-none select-none">
              <div className="group relative">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-800 dark:text-gray-200">
                  &gt; Access Key [LOCKED]
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400 material-symbols-outlined text-lg">block</span>
                  <div className="w-full h-[46px] border border-gray-300 dark:border-gray-600 flex items-center px-4 font-mono text-sm text-gray-400 bg-[repeating-linear-gradient(45deg,#f3f4f6_0,#f3f4f6_10px,#e5e7eb_10px,#e5e7eb_20px)] dark:bg-[repeating-linear-gradient(45deg,#1f2937_0,#1f2937_10px,#111827_10px,#111827_20px)]">
                    ████████████████
                  </div>
                </div>
              </div>
              <button className="w-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-3 px-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-sm border border-gray-300 dark:border-gray-700 cursor-not-allowed">
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>Input_Disabled</span>
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end text-[10px] font-mono text-gray-400">
              <div className="flex flex-col gap-1 text-red-400">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">warning</span> SEC_LEVEL: HIGH</span>
                <span>STATUS: 429_TOO_MANY_REQUESTS</span>
              </div>
              <div>ID: #{errorId}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (state === 'loading') {
    return (
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 font-mono text-xs tracking-widest opacity-60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          SYSTEM_PROCESSING
        </div>
        <div className="w-full max-w-[420px] bg-white dark:bg-gray-900 border border-black dark:border-gray-700 p-6 sm:p-12 shadow-none relative">
            <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-l border-t border-black dark:border-white"></div>
            <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-r border-t border-black dark:border-white"></div>
            <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-l border-b border-black dark:border-white"></div>
            <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-r border-b border-black dark:border-white"></div>
            <div className="flex flex-col gap-8">
                <div className="space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                        <span className="material-symbols-outlined text-3xl animate-spin">settings</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter animate-flicker-intense text-gray-800 dark:text-white">
                        labs.zekhoi.dev
                    </h1>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-mono">
                        // HANDSHAKE_INITIATED
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="group relative opacity-50 cursor-not-allowed">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-800 dark:text-gray-200" htmlFor="access-key-loading">
                            &gt; Access Key
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-400 material-symbols-outlined text-lg">lock</span>
                            <input className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 pl-10 text-sm font-mono text-gray-500 dark:text-gray-400 cursor-not-allowed rounded-sm select-none focus:outline-none" disabled id="access-key-loading" type="password" value="••••••••••••••••"/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 group rounded-sm border border-transparent cursor-wait" disabled>
                            <span>ESTABLISHING_SECURE_TUNNEL</span><span className="animate-cursor">_</span>
                        </button>
                        <div className="w-full font-mono text-[10px] text-center text-gray-600 dark:text-gray-400 tracking-widest mt-1">
                            [{Array(20).fill(0).map((_, i) => (
                              i < Math.floor(progress / 5) ? '=' : '.'
                            )).join('')}] {progress}%
                        </div>
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end text-[10px] font-mono text-gray-400">
                    <div className="flex flex-col gap-1">
                        <span className="text-primary animate-pulse">VERIFYING INTEGRITY...</span>
                        <span>ENCRYPTION: AES-256</span>
                    </div>
                    <div>v.1.0.4-alpha</div>
                </div>
            </div>
        </div>
      </div>
    )
  }

  // Idle or Invalid state
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 font-mono text-xs tracking-widest opacity-60">
        <div className="relative flex h-2 w-2">
          <span className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            isOnline ? "bg-green-500" : "bg-red-500"
          )}></span>
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isOnline ? "bg-green-500" : "bg-red-500"
          )}></span>
        </div>
        {isOnline ? 'SYSTEM_ONLINE' : 'SYSTEM_OFFLINE'}
      </div>
      <div className="w-full max-w-[420px] bg-white dark:bg-gray-900 border border-black dark:border-gray-700 p-6 sm:p-12 shadow-none relative">
        <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-l border-t border-black dark:border-white"></div>
        <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-r border-t border-black dark:border-white"></div>
        <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-l border-b border-black dark:border-white"></div>
        <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-r border-b border-black dark:border-white"></div>
        
        <div className="flex flex-col gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <span className="material-symbols-outlined text-3xl">terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter animate-flicker">
              labs.zekhoi.dev
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-mono">
              // Authorized Access Only
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="group relative">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-800 dark:text-gray-200" htmlFor="access-key">
                &gt; Access Key
              </label>
              
              {state === 'invalid' ? (
                <>
                  <div className="relative flex items-center mb-1">
                    <span className="absolute left-3 text-red-500 material-symbols-outlined text-lg">warning</span>
                    <input 
                      className="w-full bg-red-50/10 border-2 border-red-500 animate-border-pulse px-4 py-3 pl-10 text-sm font-mono text-red-600 dark:text-red-400 placeholder:text-red-300 dark:placeholder:text-red-700 focus:ring-0 rounded-sm focus:outline-none" 
                      id="access-key" 
                      type="password" 
                      value={password}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="absolute right-3 w-2 h-4 bg-red-500 animate-cursor"></div>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-red-600 dark:text-red-500 tracking-wider flex items-center gap-2 animate-pulse">
                    <span className="inline-block animate-glitch-text">!! {errorMessage}</span>
                  </div>
                </>
              ) : (
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400 material-symbols-outlined text-lg">key</span>
                  <input 
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-600 px-4 py-3 pl-10 text-sm font-mono placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white focus:ring-0 transition-colors rounded-sm focus:outline-none" 
                    id="access-key" 
                    placeholder="_ENTER_TOKEN_SEQUENCE" 
                    type="password"
                    value={password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="absolute right-3 w-2 h-4 bg-primary animate-cursor"></div>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleSubmit()}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group rounded-sm border border-transparent hover:border-primary/50"
            >
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
              <span>Initialize_Session</span>
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end text-[10px] font-mono text-gray-400">
            <div className="flex flex-col gap-1">
              <span>LATENCY: {latency}ms</span>
              <span>ENCRYPTION: AES-256-GCM</span>
              <span>SESSION: {sessionId}</span>
            </div>
            <div>v.1.0.4-alpha</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 dark:from-black to-transparent -z-10"></div>
    </div>
  )
}
