'use client'

import { ToolDashboard } from '@/components/tool-dashboard'
import { GlitchText } from '@/components/glitch-text'
import { logout } from '../actions/auth'
import { useRouter } from 'next/navigation'

const PRIVATE_TOOLS = [
    {
        title: "Instagram Checker",
        description: "Bulk-check whether Instagram usernames exist using public profile metadata, with optional proxy rotation.",
        icon: "person_search",
        href: "/private/instagram",
        version: "Internal"
    },
    {
        title: "Proxy Validator",
        description: "Check HTTP proxies for reachability, latency, and exit IP location.",
        icon: "vpn_lock",
        href: "/private/proxy"
    },
    {
        title: "Email Breaches",
        description: "Look up an email address in known public data breaches via the XposedOrNot API.",
        icon: "history_edu",
        href: "/private/email-breach"
    },
    {
        title: "Domain WHOIS Lookup",
        description: "Look up a domain's registrar, expiry date, and nameservers from the registry WHOIS server.",
        icon: "domain_verification",
        href: "/private/whois"
    },
    {
        title: "Port Scanner",
        description: "TCP connect scan of a public host for open ports, labelled with common service names.",
        icon: "router",
        href: "/private/port-scanner"
    },
    {
        title: "Header Analyzer",
        description: "Security header inspection (CSP, HSTS, X-Frame-Options) for server hardening.",
        icon: "policy",
        href: "/private/header-analyzer"
    },
    {
        title: "SSL Cert Checker",
        description: "Check a host's TLS certificate: trust, hostname match, expiry, chain, and alternative names.",
        icon: "gpp_maybe",
        href: "/private/ssl"
    },
    {
        title: "Web Scraper",
        description: "Fetch a page's HTML and extract its title, meta description, and links.",
        icon: "data_thresholding",
        href: "/private/scraper"
    }
]

export default function PrivatePage() {
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.refresh() // Middleware will pick up the cookie deletion
        router.push('/login')
    }

    return (
        <ToolDashboard
            title={<GlitchText text="Private Tools" />}
            description="Restricted-access utilities for network analysis, OSINT, and security checks. Requests run from the server and can only reach public hosts."
            tools={PRIVATE_TOOLS}
            theme="private"
            navbarProps={{
                showThemeToggle: false,
                rightContent: (
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-white/80">Secure Session</span>
                        </div>
                        <button onClick={handleLogout} className="hover:underline">Logout</button>
                    </div>
                )
            }}
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Private Tools' }
            ]}
        />
    )
}
