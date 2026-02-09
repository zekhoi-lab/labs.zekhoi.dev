'use client'

import { useState } from 'react'
import { checkInstagram, InstagramCheckResult } from '../actions'
import { PrivateToolLayout } from '@/components/private-tool-layout'
import { ToolHeader } from '@/components/tool-header'

export default function InstagramChecker() {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<InstagramCheckResult | null>(null)

    const handleCheck = async () => {
        if (!username) return
        setLoading(true)
        setResult(null)
        try {
            const data = await checkInstagram(username)
            setResult(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PrivateToolLayout>
            <ToolHeader
                title="Instagram Checker"
                description="Profile analytics and availability verification. Retrieves public metadata, engagement metrics, and account status from the Instagram graph."
                breadcrumbs={[
                    { label: 'Private Tools', href: '/private' },
                    { label: 'Instagram Checker' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/60">Target Username</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-3 text-white/40 text-sm">@</span>
                                <input
                                    className="w-full bg-black border border-white/20 focus:border-white focus:ring-0 pl-8 pr-4 py-3 text-sm placeholder:text-white/20 text-white font-mono outline-none"
                                    placeholder="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleCheck}
                            disabled={loading}
                            className="bg-white text-black w-full py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all border border-white disabled:opacity-50"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Profile'}
                        </button>
                    </div>

                    <div className="p-6 border border-white/20 bg-black space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-4">Detection Status</h3>

                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-white/40 uppercase">Profile Status</span>
                            {result && result.success ? (
                                <span className="text-sm font-bold text-green-500">ACTIVE</span>
                            ) : result && !result.success && result.error ? (
                                <span className="text-sm font-bold text-red-500">NOT FOUND</span>
                            ) : (
                                <span className="text-sm font-bold text-white/40">WAITING</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-white/40 uppercase">Availability</span>
                            {result ? (
                                <span className="text-sm font-bold text-red-500">TAKEN</span>
                            ) : (
                                <span className="text-sm font-bold text-white/40">-</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-white/40 uppercase">Privacy</span>
                            {result && result.success ? (
                                <span className={`text-sm font-bold ${result.isPrivate ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {result.isPrivate ? 'PRIVATE' : 'PUBLIC'}
                                </span>
                            ) : (
                                <span className="text-sm font-bold text-white/40">-</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col h-full">
                    {result && result.success && (
                        <div className="flex-1 border border-white/20 bg-black flex flex-col">
                            <div className="border-b border-white/20 px-8 py-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="w-24 h-24 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-white/20">person</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-4 mb-2">
                                        <h2 className="text-2xl font-bold">{result.username}</h2>
                                        {result.isVerified && <span className="material-symbols-outlined text-blue-500 text-lg">verified</span>}
                                        <span className="px-2 py-0.5 border border-white/20 text-[10px] uppercase tracking-wider rounded-full">Business Account</span>
                                    </div>
                                    <p className="text-sm text-white/60 max-w-lg mb-4">{result.bio}</p>
                                    <a href={`https://instagram.com/${result.username}`} target="_blank" className="text-[10px] text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-1">
                                        View on Instagram <span className="material-symbols-outlined text-xs">open_in_new</span>
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 divide-x divide-white/20 border-b border-white/20">
                                <div className="p-8 text-center hover:bg-white/[0.02] transition-colors">
                                    <span className="block text-2xl font-bold mb-1">{(result.posts ?? 0).toLocaleString()}</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Posts</span>
                                </div>
                                <div className="p-8 text-center hover:bg-white/[0.02] transition-colors">
                                    <span className="block text-2xl font-bold mb-1">{(result.followers ?? 0).toLocaleString()}</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Followers</span>
                                </div>
                                <div className="p-8 text-center hover:bg-white/[0.02] transition-colors">
                                    <span className="block text-2xl font-bold mb-1">{(result.following ?? 0).toLocaleString()}</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Following</span>
                                </div>
                            </div>

                            <div className="flex-1 bg-white/[0.02] p-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Engagement Metrics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-white/60">Engagement Rate</span>
                                            <span className="font-bold">{result.engagement}</span>
                                        </div>
                                        <div className="h-1 bg-white/10 w-full overflow-hidden">
                                            <div className="h-full bg-white w-[35%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {(!result || !result.success) && (
                        <div className="flex-1 border border-white/20 bg-black flex items-center justify-center text-white/20 uppercase tracking-widest text-sm">
                            {result && result.error ? `Error: ${result.error}` : 'Enter username to analyze'}
                        </div>
                    )}
                </div>
            </div>
        </PrivateToolLayout>
    )
}
