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
pnpm build   # production build + type check, then next-sitemap
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
src/lib/use-process-id.ts          stable decorative IDs without impure render calls
src/components/                    Navbar, Footer, ToolDashboard, ToolCard, ToolHeader, PrivateToolLayout, GlitchText
```

## Adding a public tool

1. Copy `src/app/hash/page.tsx` and `src/app/hash/client.tsx` into `src/app/<slug>/`.
2. In `page.tsx`, set `metadata`: title, description, keywords, `openGraph`, and `alternates.canonical` (`https://labs.zekhoi.dev/<slug>`).
3. In `client.tsx`, keep the page shell: `Navbar` with breadcrumbs, `<main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">`, an `h1` wrapping `GlitchText`, then `Footer`.
4. Register the tool in `TOOLS` in `src/app/page.tsx` (title, description, Material Symbols icon name, href).

## Adding a private tool

1. Create `src/app/private/actions/<name>.ts` with `'use server'` and export it from `src/app/private/actions.ts`.
2. The first statement of every exported action is `await requireAuth()`, outside any `try`.
3. Never connect to a user-supplied host directly. Use `safeFetch()` for HTTP (it re-checks every redirect), or `resolvePublicHost()` and connect to the address it returns.
4. Validate inputs (ports, lengths, formats) on the server. Return `{ success: false, error }` for expected failures instead of throwing.
5. Create `src/app/private/<slug>/page.tsx` using `PrivateToolLayout` + `ToolHeader`, and register it in `PRIVATE_TOOLS` in `src/app/private/page.tsx`.

## Security rules

- `/private` is protected in two places: `src/proxy.ts` for pages and `requireAuth()` for server actions. Actions can be invoked directly by their ID, so the proxy alone is not enough.
- The session cookie (`auth_token`) holds a signed, expiring token. Check it with `verifySessionToken()`, never by comparing against a fixed value.
- `'use server'` files may only export async functions (type exports are fine).
- Never pass user-controlled or remote content to `dangerouslySetInnerHTML` without escaping it.
- Environment variables are listed in `.env.example`: `AUTH_PASSWORD` (required) and `AUTH_SECRET` (optional; defaults to `AUTH_PASSWORD`). Never commit `.env*` files.

## Conventions

- Match the style of the file you are editing. Quotes, semicolons and indentation (2 or 4 spaces) vary between files; don't reformat code you aren't changing.
- Imports use the `@/` alias for `src/`. Use `cn()` from `src/lib/utils.ts` for conditional class names.
- Tailwind v4 is configured in `src/app/globals.css` (`@theme inline`); there is no `tailwind.config`. The `dark:` variant applies only under an element with the `dark` class; private pages force it on their wrapper.
- Icons are Google Material Symbols ligatures: `<span className="material-symbols-outlined">content_copy</span>`, loaded in `src/app/layout.tsx`. `components.json` names lucide, but it isn't installed or used.
- Keep the visual language: black/white, hard 1px borders, uppercase `tracking-widest` labels, `font-mono`.
- React Compiler lint rules are enforced:
  - Don't call `setState` synchronously in an effect body. Derive values with `useMemo` or compute them in event handlers.
  - Don't call impure functions (`Math.random`, `Date.now`) during render. Use a lazy `useState` initializer or `useSyncExternalStore` (see `src/lib/use-process-id.ts`).
- Tool cards, headers and metadata must only describe features that actually exist.

## Generated files

`next-sitemap` (configured in `next-sitemap.config.js`) runs after the build and writes `public/sitemap*.xml` and `public/robots.txt`. `/private` and `/login` are excluded from the sitemap and disallowed in robots.txt. Don't commit the generated sitemap files.

## Git

- Commit messages use conventional prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `build:`.
- The default branch is `main`.
