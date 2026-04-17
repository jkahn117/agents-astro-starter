# AGENTS.md

Repository guide for future AI assistants working in this project.

## Purpose

This repository is a starter template for building Cloudflare Agents with:

- Astro for the page shell
- React islands for interactive UI
- Hono as the Worker router
- Cloudflare Agents SDK for stateful Durable Object-backed agents
- Workers Powertools for observability
- shadcn/ui + Tailwind CSS v4 for styling

The current example app is a simple counter agent.

## Architecture

- `src/worker.ts` is the runtime entrypoint for Cloudflare Workers.
- `agentsMiddleware()` is installed globally and handles agent HTTP/WebSocket traffic.
- `/api/*` routes are instrumented with the Hono Powertools adapter inside `src/worker.ts`, with metrics enabled only when a backend binding exists.
- Astro handles normal page requests through `@astrojs/cloudflare/handler` and `src/middleware.ts`, with metrics enabled only when a backend binding exists.
- `src/agents/counter.ts` defines the sample `CounterAgent` Durable Object.
- `src/components/CounterWidget.tsx` connects to that agent with `useAgent()`.

## Important Files

- `wrangler.jsonc`: Worker config, Durable Object bindings, migrations, assets directory
- `worker-configuration.d.ts`: generated types from `wrangler types`
- `components.json`: shadcn configuration and aliases
- `src/lib/logger.ts`: shared Powertools logger
- `src/lib/tracer.ts`: shared Powertools tracer
- `src/lib/metrics.ts`: shared Powertools metrics helper and backend resolution
- `src/middleware.ts`: Astro middleware for request observability
- `src/styles/global.css`: Tailwind v4 imports and theme tokens
- `.agents/skills/`: local Cloudflare and Agents SDK reference material

## Working Rules For This Repo

- Prefer minimal changes over framework-heavy rewrites.
- Keep Astro page structure simple; add interactivity in React islands when needed.
- Preserve the Hono worker entrypoint pattern in `src/worker.ts`.
- Add new Worker routes before the catch-all `app.all("*", ...)` handler.
- Avoid double-instrumenting requests: Hono Powertools middleware should own explicit Hono routes, and Astro Powertools middleware should own Astro-rendered routes.
- When adding a new agent, export it from `src/worker.ts` so Wrangler can see it.
- When changing Durable Object bindings or migrations, update `wrangler.jsonc` and run `pnpm generate-types`.
- Do not hand-edit `worker-configuration.d.ts`, `dist/`, or `.astro/` unless the task explicitly requires it.
- Follow the existing path alias convention: import app code through `@/` where it improves clarity.

## Commands

- `pnpm dev`: local development
- `pnpm build`: production build
- `pnpm preview`: preview built Astro output
- `pnpm generate-types`: refresh Wrangler-generated env types

## When Working On Agents

- Check `.agents/skills/agents-sdk/` and `.agents/skills/building-ai-agent-on-cloudflare/` first.
- Prefer current Cloudflare docs over stale prior knowledge when using the Agents SDK.
- Keep agent state small and explicit.
- Expose client-callable methods with `@callable()`.
- Prefer `@workers-powertools/agents` when adding request or RPC observability inside agent methods.
- If you add a new agent class, make sure the binding name, class name, and client usage all match.

## When Working On UI

- Reuse the existing shadcn primitives in `src/components/ui/` before adding new ones.
- Keep styling in Tailwind classes and shared theme tokens from `src/styles/global.css`.
- Preserve mobile usability; the current sample widget is centered and intentionally minimal.

## Gaps To Remember

- There is no automated test suite yet.
- There is no deploy script yet.
- The README is expected to stay accurate as the starter evolves.

If you make structural changes, update `README.md` and this file in the same task.
