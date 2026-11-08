# AI implementation: files
Extract into your project root (it must already contain the earlier visual update). Then: `npm run build`, `npm run dev`.

## New
- api/ask.ts (Vercel Function: chat, explain, draft, translate; round-robin Gemini keys; grounding)
- scripts/build-knowledge.mjs (builds dist/ai-knowledge.json after every build)
- src/components/layout/AskPanel.astro (Ask / Explain / Draft / Translate panel, voice, follow-ups, tour)
- .env.example, AI-SETUP.md

## Modified (full current versions)
- src/components/home/Ecosystem.astro (adds the guided-tour highlighter)
- src/components/layout/CommandPalette.astro (natural-language navigation + Ask row)
- src/layouts/BaseLayout.astro, src/styles/global.css, astro.config.mjs (dev-only /api/ask), package.json (postbuild + gsap/three/lenis)

## Env
GEMINI_API_KEYS=key1,key2 (or GEMINI_API_KEY_1.._N), GEMINI_MODEL=gemini-3.5-flash. Optional AI_ALLOWED_ORIGINS, AI_DAILY_LIMIT, AI_RATE_PER_10MIN.
No new npm packages. package-lock.json not included. No secrets included.
