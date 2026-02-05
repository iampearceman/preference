# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Novu notification preference management UI — a Next.js 15 app that powers unsubscribe/resubscribe flows for newsletter subscribers. Deployed on Vercel. Users arrive via dynamic URLs (`/:topic/:subscriberId`), complete an exit interview, and manage their subscription through Novu's SDK.

## Commands

- `npm run dev` — Start dev server (uses Turbopack)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm start` — Serve production build

No test suite is configured.

## Architecture

**Routing**: Next.js App Router with a single dynamic route `app/[topic]/[subscriberId]/page.tsx`. The root `/` route returns 404 intentionally — all traffic goes through the dynamic path.

**Server/Client split**: `page.tsx` is a server component that validates the subscriber exists via Novu's REST API (using the server-only `NOVU_API_KEY`). If invalid, it returns 404. If valid, it renders `unsubscribe-client.tsx` which is loaded with `dynamic(() => ..., { ssr: false })` so all Novu hooks and Mixpanel run exclusively in the browser.

**Data flow**: `UnsubscribeClient` (outer) identifies the subscriber and wraps everything in `NovuProvider`. `UnsubscribeContent` (inner) manages the unsubscribe flow state machine with three states:
1. Already unsubscribed → resubscribe prompt
2. Active subscription → exit interview + unsubscribe form
3. Just unsubscribed → success with 10-second undo window

**Components**: `components/ui/` contains shadcn/ui primitives (Button, Checkbox, Label). `components/unsubscribe/` contains domain components for each section of the flow.

**Analytics**: Mixpanel is initialized in `lib/mixpanel.ts` and proxied through Next.js rewrites (`/mp/*` → Mixpanel API) to avoid ad blockers. All events are prefixed with `[Marketing]`.

## Key Integrations

- **Novu** (`@novu/react`): `useSubscriptions`, `useRemoveSubscription`, `useCreateSubscription` hooks for subscription CRUD. App ID configured via `NEXT_PUBLIC_NOVU_APP_ID` env var.
- **Mixpanel** (`mixpanel-browser`): Event tracking across the full unsubscribe funnel. Proxied via Next.js rewrites in `next.config.ts`.
- **shadcn/ui**: Component system configured in `components.json`. Uses Radix primitives, `class-variance-authority`, and Tailwind CSS.

## Styling

Tailwind CSS with CSS variables (HSL) defined in `app/globals.css`. Dark mode is class-based. Fonts: Geist Sans and Geist Mono loaded in root layout. The design uses a neutral color palette.

## Environment Variables

- `NEXT_PUBLIC_NOVU_APP_ID` — Novu application identifier for client-side SDK (has hardcoded fallback)
- `NOVU_API_KEY` — Novu secret API key (server-only, never prefix with `NEXT_PUBLIC_`)

## Path Aliases

`@/*` maps to the project root (e.g., `@/components`, `@/lib`).
