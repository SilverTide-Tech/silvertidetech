# AI assistant setup (Gemini)

## What it does
A floating **Ask Silver Tide** button (and an "Ask the assistant" row in the Ctrl+K palette) opens a panel with four tools:
- **Ask**: chat about the company, businesses, SarasTech, careers, leadership. Replies in the visitor's language (English, Hindi, Hinglish). Extras:
  - **Voice**: a mic button (plus EN/Hindi switch) to speak the question, and a "Listen" button that reads answers aloud. Spoken questions are answered aloud automatically. Uses the browser's built-in speech tools (Chrome and Edge for the mic; the browser may send audio to its speech service, so mention voice in your privacy notice if you want to be explicit).
  - **Suggested follow-ups**: 2-3 clickable next questions after each answer.
  - **Page-aware**: knows which page the visitor is on. "Summarize this page" and "Explain this page simply" chips.
  - **Guided tour**: when an answer concerns a business or product, "Show me on the site" scrolls to the ecosystem map (or business cards on mobile) and pulses the matching nodes. From other pages it jumps to the homepage first.
- **Explain**: SarasTech explained for a teacher / school owner / student / parent, in English, Hindi or Hinglish.
- **Draft**: turns a rough message into a polite one (copy, then send via the Contact page).
- **Translate**: translates the page being read (Hindi, Hinglish, Spanish, French, German, Japanese, Tamil, Bengali), keeping brand and product names. "Show original" restores it. Applies to the current page's main content only; results are cached in the browser session. Each translation uses 1-3 Gemini requests.

The Ctrl+K palette also understands natural phrases without any AI ("take me to the founders", "jobs", "contact page").

Every answer is grounded ONLY in the site's own built pages (`dist/ai-knowledge.json`, generated automatically after `npm run build`). If the site doesn't say it, the assistant says so. Privacy, Terms, Foundation and 404 pages are excluded.

## Environment variables
See `.env.example`. Required: at least one Gemini key, given as `GEMINI_API_KEYS=key1,key2,key3` (or `GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, ... or a single `GEMINI_API_KEY`). Optional: `GEMINI_MODEL` (default `gemini-3.5-flash`), `AI_ALLOWED_ORIGINS`, `AI_DAILY_LIMIT` (400), `AI_RATE_PER_10MIN` (30).

## Key rotation (round robin)
Each request starts from the next key in the list, so load spreads evenly. If a key returns "quota exceeded" (429) it is skipped for 2 minutes; if a key is invalid or not permitted it is skipped for 30 minutes; the request is retried on the next key immediately, so visitors don't notice. If every key is exhausted, visitors see a friendly "busy" message. Keys are never logged or sent to the browser; server logs only say "key #2 out of quota". Rotation state lives per server instance (each Vercel instance starts at a random key), which is fine for spreading free-tier usage. Note that free-tier keys created in the same Google Cloud project may share one quota, so create each key in a different project to actually multiply your limit.

## Vercel
Project Settings -> Environment Variables: add `GEMINI_API_KEYS` (and optionally `GEMINI_MODEL`) for Production and Preview, then redeploy. `api/ask.ts` is deployed automatically as a Vercel Function; the site itself stays static.

## Local development
1. Copy `.env.example` to `.env` and paste your key. `.env` is already git-ignored.
2. Run `npm run build` once (this creates `dist/ai-knowledge.json`, which `astro dev` serves).
3. Run `npm run dev`. Re-run `npm run build` whenever site content changes so the assistant knows the new text.

## Security notes
- The key never reaches the browser; only `/api/ask` uses it.
- Same-origin check, input length caps, per-IP and daily limits are built in but are per server instance. For a hard cap add Vercel Firewall rate limiting and a spend limit in Google AI Studio.
- Never paste the key into chat or commit it. If it leaks, regenerate it.
