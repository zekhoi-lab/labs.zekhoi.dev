# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

**labs.zekhoi.dev** ("Labs by zekhoi") is a collection of developer utilities with a monochrome, terminal-style UI.

- **Public tools** (`/uuid`, `/json`, `/jwt`, …) run entirely in the browser. Keep them client-side: user input must not be sent to a server.
- **Private tools** (`/private/*`) are server actions (port scan, SSL check, WHOIS, scraping, OSINT) behind a password login.

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4, TanStack Query, deployed on Vercel.

## Commands

```bash
pnpm dev     # dev server on http://localhost:3000
pnpm lint    # ESLint (next core-web-vitals + typescript, incl. React Compiler hook rules)
pnpm build   # next build (includes the type check) && next-sitemap
```

- There is no test suite. Verify changes with `pnpm lint`, `pnpm build`, and by using the page in `pnpm dev`.
- pnpm is pinned to 8.15.9 via `packageManager` because `pnpm-lock.yaml` is lockfile v6. Newer pnpm versions switch to it automatically. Don't upgrade or regenerate the lockfile unless asked.
- The Husky pre-push hook runs `pnpm run lint` and `pnpm run build`. Don't bypass it with `--no-verify`.

## Layout

```
src/app/<tool>/page.tsx            server component: exports `metadata`, renders the client
src/app/<tool>/client.tsx          'use client' tool UI
src/app/page.tsx                   home dashboard; public tools are registered in TOOLS
src/app/private/page.tsx           private dashboard; private tools are registered in PRIVATE_TOOLS
src/app/private/<tool>/page.tsx    'use client' private tool UI
src/app/private/actions/*.ts       'use server' actions, re-exported by src/app/private/actions.ts
src/app/actions/auth.ts            login / logout server actions
src/proxy.ts                       Next 16 proxy (formerly middleware): gates /private/*
src/lib/session.ts                 signed session token (HMAC via Web Crypto)
src/lib/auth.ts                    requireAuth() for server actions
src/lib/net-guard.ts               resolvePublicHost() / safeFetch(): block internal network targets
src/lib/rate-limit.ts              in-memory login rate limiter
src/lib/theme.ts                   light/dark/system preference + the pre-paint init script
src/lib/use-copy.ts                copy to clipboard with a temporary "copied" state
src/lib/use-online-status.ts       navigator.onLine that re-renders on online/offline events
src/lib/use-process-id.ts          stable decorative IDs without impure render calls
src/lib/use-now.ts                 shared 1 s clock for the browser; null during prerender
src/lib/relative-time.ts           "5 minutes ago" formatting (epoch, JWT)
src/lib/tool-search.ts             dashboard search filter
src/lib/json-error.ts              line/column of a JSON.parse error (JSON, YAML)
src/lib/yaml-json.ts, cidr.ts, qr.ts, text-case.ts, jwt-claims.ts, markdown-draft.ts
                                   pure logic behind the YAML, CIDR, QR, text, JWT, and markdown tools
src/lib/email-security.ts          SPF/DMARC/DKIM/MX rules over an injectable DNS resolver
src/app/regex/find-matches.ts      self-contained matcher that the regex Web Worker runs from its source
src/app/opengraph-image.tsx        generated og:image for the whole site
src/components/                    Navbar (with ThemeToggle), Footer, ToolDashboard + ToolGrid (search), ToolCard, ToolHeader, PrivateToolLayout, GlitchText, JsonTree
```

## Adding a public tool

1. Copy `src/app/hash/page.tsx` and `src/app/hash/client.tsx` into `src/app/<slug>/`.
2. In `page.tsx`, set `metadata`: title, description, keywords, `openGraph` (including `images: '/opengraph-image'`, because a page-level `openGraph` replaces the root one), and `alternates.canonical` (`https://labs.zekhoi.dev/<slug>`).
3. In `client.tsx`, keep the page shell: `Navbar` with breadcrumbs, `<main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">`, an `h1` wrapping `GlitchText`, then `Footer`. Give the root element both light and dark colours (`bg-white dark:bg-black text-black dark:text-white`), and use `useCopy()` for copy buttons.
4. Register the tool in `TOOLS` in `src/app/page.tsx` (title, description, Material Symbols icon name, href).

## Adding a private tool

1. Create `src/app/private/actions/<name>.ts` with `'use server'` and export it from `src/app/private/actions.ts`.
2. The first statement of every exported action is `await requireAuth()`, outside any `try`.
3. Never connect to a user-supplied host directly. Use `safeFetch()` for HTTP (it re-checks every redirect), or `resolvePublicHost()` and connect to the address it returns.
4. Validate inputs (ports, lengths, formats) on the server. Return `{ success: false, error }` for expected failures instead of throwing.
5. Create `src/app/private/<slug>/page.tsx` using `PrivateToolLayout` + `ToolHeader`, and register it in `PRIVATE_TOOLS` in `src/app/private/page.tsx`.

## Security rules

- `/private` is protected in two places: `src/proxy.ts` for pages and `requireAuth()` for server actions. Actions can be invoked directly by their ID from any route, so the proxy alone is not enough.
- The proxy lets Server Action requests (`Next-Action` header) through: a plain redirect breaks them. `requireAuth()` redirects an expired session to `/login` instead, using `redirect()`, which throws, so keep it outside `try`.
- The session cookie (`auth_token`) holds a signed, expiring token. Check it with `verifySessionToken()`, never by comparing against a fixed value.
- `'use server'` files may only export async functions (type exports are fine).
- Never pass user-controlled or remote content to `dangerouslySetInnerHTML` without escaping it.
- Environment variables are listed in `.env.example`: `AUTH_PASSWORD` (required) and `AUTH_SECRET` (optional; defaults to `AUTH_PASSWORD`). Never commit `.env*` files.

## Conventions

- Match the style of the file you are editing. Quotes, semicolons and indentation (2 or 4 spaces) vary between files; don't reformat code you aren't changing.
- Imports use the `@/` alias for `src/`. Use `cn()` from `src/lib/utils.ts` for conditional class names.
- Tailwind v4 is configured in `src/app/globals.css` (`@theme inline`, plus `:root`/`.dark` colour tokens); there is no `tailwind.config`. The `dark:` variant applies only under an element with the `dark` class. On public pages it's set on `<html>` by the script in `src/app/layout.tsx` and the navbar `ThemeToggle`; private pages force it on their wrapper and hide the toggle.
- Icons are Google Material Symbols ligatures: `<span className="material-symbols-outlined">content_copy</span>`, loaded in `src/app/layout.tsx`. `components.json` names lucide, but it isn't installed or used.
- Keep the visual language: black/white, hard 1px borders, uppercase `tracking-widest` labels, `font-mono`.
- React Compiler lint rules are enforced:
  - Don't call `setState` synchronously in an effect body. Derive values with `useMemo` or compute them in event handlers.
  - Don't call impure functions (`Math.random`, `Date.now`) during render.
- Pages are prerendered, so anything that differs between the build and the browser (time, randomness, `localStorage`, `window`) must not be rendered on the first pass or hydration fails (React error #418). Read it through `useSyncExternalStore` with a server snapshot, as in `src/lib/use-process-id.ts` and `src/app/epoch/client.tsx`, or set it in an effect or event handler.
- Put a tool's logic in `src/lib/*.ts` (no JSX, no `@/` imports of client modules), and pass network or storage access in as a parameter (see `email-security.ts`), so it can be tested on its own. Pages stay thin.
- Work that can hang the page (user-supplied regexes) runs in a Web Worker built from a self-contained function's source, with a timeout that terminates it (see `src/app/regex/`). No bundler worker setup is needed.
- Tool cards, headers and metadata must only describe features that actually exist.

## Generated files

`pnpm build` runs `next-sitemap` (configured in `next-sitemap.config.js`) after `next build`. It writes `public/sitemap*.xml` (gitignored) and `public/robots.txt` (tracked). `/private` and `/login` are excluded from the sitemap and disallowed in robots.txt.

## Git

- Commit messages use conventional prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `build:`.
- The default branch is `main`.
