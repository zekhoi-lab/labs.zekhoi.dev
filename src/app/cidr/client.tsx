'use client'

import { useMemo, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GlitchText } from '@/components/glitch-text'
import { useCopy } from '@/lib/use-copy'
import { calculateCidr } from '@/lib/cidr'

// A fixed locale keeps prerendered numbers identical to the browser's
const formatCount = (value: number) => value.toLocaleString('en-US')

export default function CidrCalculator() {
  const [input, setInput] = useState('192.168.1.10/24')
  const result = useMemo(() => calculateCidr(input), [input])
  const { copy, isCopied } = useCopy()

  const rows = result.ok ? [
    ['Address', result.info.address],
    ['Network', `${result.info.network}/${result.info.prefix}`],
    ['Broadcast', result.info.broadcast],
    ['First host', result.info.firstHost],
    ['Last host', result.info.lastHost],
    ['Usable hosts', formatCount(result.info.usableHosts)],
    ['Total addresses', formatCount(result.info.totalAddresses)],
    ['Netmask', result.info.netmask],
    ['Wildcard mask', result.info.wildcard],
    ['Address type', result.info.type],
  ] : []

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar
        title="labs.zekhoi.dev"
        icon="terminal"
        breadcrumbs={[
            { label: 'CIDR Calculator', href: '/cidr' }
        ]}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
            <GlitchText text="CIDR Calculator" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed">
            Network, broadcast, host range, and masks for an IPv4 block. Enter a CIDR like 10.0.0.0/8 or an address followed by a netmask.
          </p>
        </div>

        <div className="max-w-3xl space-y-8">
          <div className="space-y-2">
            <label htmlFor="cidr-input" className="text-xs font-bold uppercase tracking-widest text-gray-500">IPv4 address / prefix</label>
            <input
              id="cidr-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              placeholder="192.168.1.10/24"
              className="w-full bg-white dark:bg-black border border-black dark:border-white px-4 py-3 text-lg font-mono text-black dark:text-white focus:outline-none focus:ring-0"
            />
            <p className="text-[10px] uppercase tracking-widest text-gray-400">IPv4 only · /31 and /32 follow RFC 3021</p>
          </div>

          {result.ok ? (
            <>
              <table className="w-full border border-black dark:border-white text-sm">
                <tbody>
                  {rows.map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <th scope="row" className="w-48 p-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 dark:bg-gray-900">{label}</th>
                      <td className="p-3 font-mono">{value}</td>
                      <td className="w-12 p-3 text-right">
                        <button
                          type="button"
                          onClick={() => copy(value, label)}
                          className="text-gray-400 hover:text-black dark:hover:text-white"
                          aria-label={`Copy ${label}`}
                        >
                          <span className="material-symbols-outlined text-sm">{isCopied(label) ? 'check' : 'content_copy'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border border-black dark:border-white p-4 space-y-2 text-xs">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Binary</h2>
                <div className="flex flex-col sm:flex-row sm:gap-4"><span className="w-20 text-gray-400">Address</span><span className="break-all">{result.info.binaryAddress}</span></div>
                <div className="flex flex-col sm:flex-row sm:gap-4"><span className="w-20 text-gray-400">Netmask</span><span className="break-all">{result.info.binaryNetmask}</span></div>
              </div>
            </>
          ) : (
            <div role="alert" className="border border-red-500 bg-red-50 dark:bg-red-900/10 p-4 text-sm text-red-600 dark:text-red-400">
              {result.error}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
