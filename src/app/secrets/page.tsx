import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function SecretsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        title="labs.zekhoi.dev" 
        icon="lock" 
        statusLabel="TOOLS" 
        statusColor="yellow-500"
        searchPlaceholder="Search secrets (cmd + k)"
        statusHref="/"
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 dark:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-2xl animate-pulse text-red-500">warning</span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-widest glitch-text-anim text-white dark:text-black" data-text="RESTRICTED ACCESS AREA">RESTRICTED ACCESS AREA</h3>
              <p className="text-xs text-gray-400 dark:text-gray-600 leading-relaxed max-w-3xl">
                You are entering a secure environment vault. All actions are logged and audited. 
                Exposure of these credentials can lead to severe security breaches. 
                Treat this data with extreme caution.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-black dark:text-white">Secrets Vault</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Environment: <span className="text-black dark:text-white font-bold">Production</span> / Region: <span className="text-black dark:text-white font-bold">us-east-1</span></p>
          </div>
          <div className="flex gap-4">
            <button className="fragment-btn bg-white dark:bg-black border border-black dark:border-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-black dark:text-white">
              <span className="material-symbols-outlined text-base">add</span>
              New Secret
            </button>
            <button className="fragment-btn bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors group">
              <span className="material-symbols-outlined text-base group-hover:animate-spin">sync</span>
              Sync to Cloud
            </button>
          </div>
        </div>

        <div className="border border-black dark:border-white bg-white dark:bg-black overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-black dark:border-white text-xs uppercase tracking-widest font-bold text-black dark:text-white">
                <tr>
                  <th className="px-6 py-4 w-1/4">Key Name</th>
                  <th className="px-6 py-4 w-1/3">Value</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black dark:divide-white">
                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 font-bold text-black dark:text-white">STRIPE_SECRET_KEY</td>
                  <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="tracking-[0.2em] text-xs">••••••••••••••••••••••••</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">2 hours ago by admin</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Reveal">
                        <span className="material-symbols-outlined text-lg">visibility_off</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Copy">
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-red-600 hover:text-red-700" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 font-bold text-black dark:text-white">AWS_ACCESS_KEY_ID</td>
                  <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="tracking-[0.2em] text-xs">••••••••••••••••</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">2 days ago by system</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Reveal">
                        <span className="material-symbols-outlined text-lg">visibility_off</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Copy">
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-red-600 hover:text-red-700" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 font-bold text-black dark:text-white">DATABASE_URL</td>
                  <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="tracking-[0.2em] text-xs">••••••••••••••••••••••••••••••••</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">1 week ago by dev_ops</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Reveal">
                        <span className="material-symbols-outlined text-lg">visibility_off</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Copy">
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-red-600 hover:text-red-700" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 font-bold text-black dark:text-white">REDIS_CONNECTION_STRING</td>
                  <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="tracking-[0.2em] text-xs">••••••••••••••••••••</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">1 month ago by admin</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Reveal">
                        <span className="material-symbols-outlined text-lg">visibility_off</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Copy">
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-red-600 hover:text-red-700" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 font-bold text-black dark:text-white">OPENAI_API_KEY</td>
                  <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="tracking-[0.2em] text-xs">••••••••••••••••••••••••</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">Just now by you</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Reveal">
                        <span className="material-symbols-outlined text-lg">visibility_off</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white" title="Copy">
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>
                      <button className="fragment-btn w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors text-red-600 hover:text-red-700" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-black dark:border-white bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-black dark:text-white">
            <span className="text-gray-500 dark:text-gray-400">Showing 5 of 12 secrets</span>
            <div className="flex gap-2">
              <button className="hover:text-black dark:hover:text-white hover:underline disabled:opacity-50" disabled>Previous</button>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <button className="hover:text-black dark:hover:text-white hover:underline">Next</button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="text-[10px] uppercase text-gray-400 dark:text-gray-500 tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">encrypted</span>
            End-to-end encrypted
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
