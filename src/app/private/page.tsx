'use client'

import { ToolDashboard } from '@/components/tool-dashboard'
import { GlitchText } from '@/components/glitch-text'

const PRIVATE_TOOLS = [
    {
        title: "Instagram Checker",
        description: "Account status verification & metadata extraction via private API endpoints.",
        icon: "person_search",
        href: "#",
        version: "Internal"
    },
    {
        title: "Proxy Validator",
        description: "Real-time anonymity levels, latency checks, and geological routing validation.",
        icon: "vpn_lock",
        href: "#"
    },
    {
        title: "Email Breaches",
        description: "Deep-web OSINT leak search. Identify compromised credentials across known databases.",
        icon: "history_edu",
        href: "#"
    },
    {
        title: "Domain WHOIS Monitor",
        description: "Continuous tracking of ownership records, nameserver changes, and expiry alerts.",
        icon: "domain_verification",
        href: "#"
    },
    {
        title: "Port Scanner",
        description: "Vulnerability testing for open ports with service version detection and OS fingerprinting.",
        icon: "router",
        href: "#"
    },
    {
        title: "Header Analyzer",
        description: "Security header inspection (CSP, HSTS, X-Frame-Options) for server hardening.",
        icon: "policy",
        href: "#"
    },
    {
        title: "SSL Cert Checker",
        description: "Validity and expiration monitoring for certificate chains across multiple subdomains.",
        icon: "gpp_maybe",
        href: "#"
    },
    {
        title: "Web Scraper",
        description: "Automated data extraction with headless browser support and proxy rotation.",
        icon: "data_thresholding",
        href: "#"
    }
]

export default function PrivatePage() {
    return (
        <ToolDashboard
            title={<GlitchText text="Private Tool" />}
            description="Restricted access internal utilities. High-performance modules for network analysis, OSINT, and security auditing. All operations are logged and end-to-end encrypted."
            tools={PRIVATE_TOOLS}
            theme="private"
            navbarProps={{
                rightContent: (
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-white/80">Secure Session</span>
                        </div>
                        <button className="hover:underline">Logout</button>
                    </div>
                )
            }}
        />
    )
}
