# Labs by zekhoi

A collection of developer utilities with a monochrome, terminal-style UI, live at **[labs.zekhoi.dev](https://labs.zekhoi.dev)**.

- **Public tools** run entirely in your browser. What you paste into them is not sent to a server.
- **Private tools** live under `/private`, run as server actions, and sit behind a password login.

## Tools

### Public

| Tool | Path | What it does |
| --- | --- | --- |
| UUID Generator | `/uuid` | v4, v5, v6 and v7 UUIDs with a recent history |
| Password Generator | `/password` | Random passwords with adjustable length and character sets |
| JSON Formatter | `/json` | Validate, minify and beautify JSON, with the position of any error |
| YAML ↔ JSON | `/yaml` | Convert in either direction as you type |
| Base64 Converter | `/base64` | Encode and decode, with full UTF-8 support |
| JWT Debugger | `/jwt` | Decode tokens, show `exp`/`nbf`/`iat` as dates, verify HS256/384/512 signatures |
| Epoch Converter | `/epoch` | Unix timestamps ↔ human-readable dates in local time and UTC |
| Hash Generator | `/hash` | SHA-1, SHA-256, SHA-384 and SHA-512 via Web Crypto |
| Regex Tester | `/regex` | Live match highlighting and capture groups; patterns run in a Web Worker with a timeout |
| Text Utilities | `/text` | Case conversion, URL slugs, word and character counts |
| Diff Viewer | `/diff` | Side-by-side line diff of text or uploaded files |
| URL Parser | `/url` | Split a URL into protocol, host, path and decoded query params |
| CIDR Calculator | `/cidr` | Network, broadcast, host range, netmask and wildcard of an IPv4 block |
| Color Converter | `/color` | HEX, RGB and HSL, with luminance and contrast checks |
| Markdown Editor | `/editor` | GitHub-flavored markdown with live preview and a draft saved in the browser |
| HTTP Client | `/http` | Send GET, POST, PUT and DELETE requests from the browser and inspect responses |
| Crontab Generator | `/crontab` | Build cron expressions, read them in plain English, list the next runs |
| Image Optimizer | `/image` | Compress and resize images in the browser |
| QR Code Generator | `/qr` | Text or URLs to QR codes, downloadable as PNG or SVG |
| SQL Formatter | `/sql` | Beautify SQL queries |

### Private

| Tool | Path | What it does |
| --- | --- | --- |
| Instagram Checker | `/private/instagram` | Bulk-check whether usernames exist, with optional proxy rotation |
| Proxy Validator | `/private/proxy` | Reachability, latency and exit IP location of HTTP proxies |
| Email Breaches | `/private/email-breach` | Look up an address in known breaches via the XposedOrNot API |
| Domain WHOIS Lookup | `/private/whois` | Registrar, expiry date and nameservers |
| DNS & Email Security | `/private/dns` | DNS records plus SPF, DMARC, DKIM and MX checks |
| Port Scanner | `/private/port-scanner` | TCP connect scan of a public host |
| Header Analyzer | `/private/header-analyzer` | Inspect security headers (CSP, HSTS, X-Frame-Options) |
| SSL Cert Checker | `/private/ssl` | Trust, hostname match, expiry, chain and SANs of a TLS certificate |
| Web Scraper | `/private/scraper` | Fetch a page and extract its title, meta description and links |

Private tools refuse to connect to internal network addresses (loopback, private ranges, link-local), including through redirects.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · deployed on Vercel.

## Getting started

Requires Node.js and pnpm. The repo pins pnpm 8.15.9 through `packageManager`, so Corepack picks the right version.

```bash
pnpm install
cp .env.example .env.local   # then set AUTH_PASSWORD
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_PASSWORD` | Yes | Password for the `/login` page that unlocks `/private` |
| `AUTH_SECRET` | No | Secret used to sign session cookies; defaults to `AUTH_PASSWORD` |

The public tools work without either variable set.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm lint` | Run ESLint, including the React Compiler rules |
| `pnpm build` | Type-check and build, then generate the sitemap with `next-sitemap` |
| `pnpm start` | Serve the production build |

There is no test suite. A Husky pre-push hook runs `pnpm lint` and `pnpm build`.

## Project layout

```
src/app/<tool>/            public tools (page.tsx for metadata, client.tsx for the UI)
src/app/private/<tool>/    private tool pages
src/app/private/actions/   server actions behind the private tools
src/components/            shared UI: navbar, footer, dashboard, tool cards
src/lib/                   tool logic, auth, session, network guard, hooks
src/proxy.ts               gates /private/* pages
```

## Contributing

[AGENTS.md](AGENTS.md) has the conventions for adding public and private tools, the security rules for server actions, and the style guide. Commit messages use conventional prefixes (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `build:`).
