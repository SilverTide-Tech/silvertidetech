# Silver Tide Tech: brand direction

**Status:** Approved and implemented on the website (v2, 2026-10-31). The live design tokens are in `src/styles/global.css`; the internal reference page `/foundation` renders them.
**Source of truth for company facts:** [`company-vision.md`](company-vision.md).

This document defines an **original** identity for Silver Tide Tech. Eternal (eternal.com) was studied only as a benchmark for overall quality: whitespace, typographic confidence, navigation and product storytelling. No colours, type, motifs, layouts, copy or assets are taken from it.

---

## 1. Brand positioning

| | |
|---|---|
| **Identity** | Technology & Innovation Company |
| **Tagline** | Building Technology. Empowering People. |
| **Positioning** | A product-led technology and innovation company that builds technology products, digital platforms and solutions to solve real-world problems. |
| **Design goal** | Look like a serious, modern technology company that people trust: premium, minimal and human, not a generic AI startup template. |

## 2. Brand personality

| We are | We are not |
|---|---|
| **Confident**: clear about what we build | Boastful or hype-driven |
| **Precise**: specific, honest about status | Vague or buzzword-heavy |
| **Warm**: technology in service of people | Cold, robotic, "AI for AI's sake" |
| **Calm**: steady, considered progress | Loud, flashy, trend-chasing |
| **Forward-looking**: built for the long term | Overpromising on the future |

Design adjectives (from the founders): **premium, minimal, modern, professional, technology-driven, human-centric.**

---

## 3. Logo: official ST monogram

The founders supplied the official logo and app icon. They replace the earlier "Rising Tide" symbol proposed in the first version of this document. The tide idea lives on in the tide-line motif and the tide stroke (§6).

### 3.1 Components
- **ST monogram:** the letters S and T in a navy-to-teal gradient, with a sweeping arc and a small star.
- **Full logo (horizontal):** monogram, a thin vertical divider, the "Silver Tide Tech" wordmark in navy and the descriptor "TECHNOLOGY & INNOVATION" beneath it.
- **ST app icon:** the monogram on a rounded navy square. Used for the favicon, app icons and the navy-surface lockup.

### 3.2 Usage on the website
- **Light surfaces (header):** the full-colour logo.
- **Navy surfaces (footer, mobile menu):** the ST app icon beside "Silver Tide Tech" set in white Manrope ExtraBold, because the full logo's navy wordmark is not legible on navy.
- **Icons and sharing:** favicon (32 px), app icons (192 and 512 px), Apple touch icon (180 px) and the default social image (1200 × 630) are all derived from the app icon and logo.

### 3.3 Source files and rules
- Masters: `brand-source/silvertide-logo.png` and `brand-source/silvertide-favicon.png`. Every website derivative is generated from them with `npm run assets`; never edit derivatives by hand.
- Use the supplied artwork only: don't redraw, recolour, stretch, crop or add effects, and don't place the full-colour logo on navy.
- Production refinements (vector masters, trademark search) are for the founders to commission if needed.

---

## 4. Colour palette

### 4.1 Core palette

| Role | Name | HEX | Use |
|---|---|---|---|
| Primary ink / dark surface | **Tide Navy** | `#0B1F3A` | Headlines, primary buttons, dark sections, footer |
| Dark surface (raised) | Navy 800 | `#12294A` | Cards on dark, hover on navy |
| Dark accent surface | Navy 700 | `#1D3A5F` | Borders and dividers on dark |
| Brand accent | **Sea Teal** | `#14B3A8` | Motif strokes, accents on navy, focus ring on dark, decorative fills |
| Accent for text and controls on light | Deep Teal | `#0B7C77` | Links, accent buttons, active nav, icons on light |
| Accent hover | Teal 800 | `#0A6F6A` | Hover/pressed states for Deep Teal |
| Accent on dark (glow) | Teal Light | `#5FE3D6` | Highlights and links on navy |
| Accent tint | Teal Wash | `#E3F6F4` | Badge backgrounds, subtle highlights |
| Silver | **Silver Grey** | `#A9B4C2` | Motif lines, decorative dividers (not text on white) |
| Silver light | Silver 300 | `#C9D2DD` | Borders, secondary text on navy |
| Silver lighter | Silver 200 | `#DFE5EC` | Card borders, hairlines |
| Neutral surface | **Soft Neutral (Mist)** | `#F4F6F9` | Alternate section background |
| Neutral surface 2 | Silver 100 | `#EEF1F5` | Inputs, chips, quiet panels |
| Base | White | `#FFFFFF` | Page background |
| Body text | Slate 600 | `#475467` | Paragraphs |
| Strong text | Slate 700 | `#334155` | Sub-headings, emphasised body |
| Secondary text | Slate 500 | `#667085` | Captions, meta (on white only) |

### 4.2 Status colours (badge text on badge background)

| Status | Text | Background | Contrast |
|---|---|---|---|
| Available Now | `#0A6F6A` | `#E3F6F4` | 5.37 : 1 |
| Early Access | `#1D4E89` | `#EAF1FB` | 7.38 : 1 |
| In Development | `#8A5300` | `#FFF4E0` | 5.81 : 1 |
| Planned | `#5B6678` | `#EEF1F5` | 5.13 : 1 |

Badges also carry a leading dot or icon and the text label, so status never relies on colour alone.

### 4.3 Contrast checks (WCAG 2.2 AA)

| Pair | Ratio | Verdict |
|---|---|---|
| Tide Navy on White | 16.52 | AAA |
| Tide Navy on Mist | 15.26 | AAA |
| Slate 600 body on White | 7.69 | AAA |
| Slate 600 on Mist | 7.10 | AAA |
| Slate 500 caption on White | 4.97 | AA |
| Deep Teal link on White | 5.04 | AA |
| White text on Deep Teal button | 5.04 | AA |
| Sea Teal on Tide Navy | 6.33 | AA |
| Teal Light on Tide Navy | 10.58 | AAA |
| Silver 300 on Tide Navy | 10.81 | AAA |
| Silver Grey on White | 2.10 | **Decorative only.** Never use for text |

### 4.4 Why this palette
- **Deep navy instead of black:** carries "technology and trust" without the starkness of pure black, and gives dark sections depth.
- **Silver grey:** the literal "Silver" of the name. It is used for structure (lines, borders, motifs) rather than text, so it reads as material, not as washed-out typography.
- **One sea-teal accent:** the "Tide". It feels fresh and human next to navy. It is split into a bright brand teal (decorative / on dark) and a deeper teal that passes AA for text and buttons on light backgrounds.
- **Mostly white and mist surfaces:** keeps the premium, minimal feel; colour is earned, not sprayed.
- **Ratio guide:** ~70 % white/mist, ~20 % navy, ~7 % silver, ~3 % teal.

---

## 5. Typography

### 5.1 Typefaces (all open-source, SIL Open Font License)

| Role | Typeface | Weights | Why |
|---|---|---|---|
| **Display & headings** | **Manrope** | 500, 600, 700, 800 | Modern geometric-grotesque with open, friendly forms: confident at large sizes, distinctive without being quirky. Its slightly rounded construction echoes the wave motif. |
| **Body & UI** | **Inter** | 400, 500, 600 | Exceptionally readable at small sizes, with excellent multilingual coverage and tabular numerals. |
| **Labels & status** | **JetBrains Mono** | 500 | Used sparingly (eyebrows, status chips, roadmap phase numbers) for a precise, engineered accent that signals "technology" without decoration. |

The fonts are self-hosted (via @fontsource), so the site makes no third-party font requests.

### 5.2 Type scale (fluid, desktop → mobile)

| Token | Desktop | Mobile | Font / weight | Line height | Tracking |
|---|---|---|---|---|---|
| Display | 72 px | 40 px | Manrope 700 | 1.05 | −0.03 em |
| H1 | 56 px | 34 px | Manrope 700 | 1.1 | −0.025 em |
| H2 | 40 px | 28 px | Manrope 700 | 1.15 | −0.02 em |
| H3 | 24 px | 20 px | Manrope 600 | 1.3 | −0.01 em |
| Lead | 20 px | 18 px | Inter 400 | 1.6 | 0 |
| Body | 17 px | 16 px | Inter 400 | 1.65 | 0 |
| Small | 14 px | 14 px | Inter 500 | 1.5 | 0 |
| Eyebrow / label | 12–13 px | 12 px | JetBrains Mono 500, uppercase | 1.4 | +0.08 em |

- Maximum measure: 68 characters for body text.
- Headlines use sentence case. The tagline keeps its title-case form as written.

---

## 6. Visual identity and motifs

### 6.1 Tide lines (primary motif)
Thin, flowing horizontal contour lines suggesting water and steady rise.
- **Hero:** a field of 6–9 silver tide lines with one teal line, drifting slowly. On pointer devices, the lines swell gently near the cursor; on touch devices they drift on their own. Under reduced motion they are completely static.
- **Section transitions:** a single soft tide line can separate major sections, used sparingly.
- **Empty states and backgrounds:** faint tide contours at 4–8 % opacity.

### 6.2 Tide stroke (signature detail)
A short wave stroke (≈ 40 × 8 px, Sea Teal) placed under section eyebrows or headings. It draws in once when it enters the viewport (static under reduced motion). It is the brand's recurring "signature" detail.

### 6.3 Rising composition
Layouts favour a gentle upward diagonal: content blocks and visuals step upward left-to-right where natural (e.g. roadmap phases rise on a curve). This is used subtly, never at the cost of reading order.

### 6.4 Imagery
- **Product UI first:** real SarasTech visuals supplied by the founders, shown complete and uncropped (the homepage uses the "SarasTech AI Teaching Partner" image on navy).
- **Photography:** our own photos of real people. Founder headshots share one silver-toned treatment (mostly greyscale with slightly raised contrast) so photos taken in different settings read as one set. **No generic stock photography.**
- **Illustration:** minimal line illustrations in silver and teal for planned offerings, where no product UI exists yet.
- **Iconography:** 1.5 px stroke line icons, rounded joins, 24 px grid. Navy on light, silver/teal on dark.

### 6.5 What to avoid (anti-generic rules)
- No purple-blue AI gradients, glowing orbs, neural-network meshes, robot imagery or floating 3D blobs.
- No glassmorphism stacks or neon on black.
- No stock "handshake / people pointing at screens" photos.
- No fake dashboards with invented numbers.

---

## 7. Buttons and links

| Variant | Light background | Dark background | Use |
|---|---|---|---|
| **Primary** | Tide Navy fill, white text | White fill, navy text | One main action per section |
| **Accent** | Deep Teal fill, white text | Sea Teal fill, navy text | Product CTAs (e.g. "Visit SarasTech") |
| **Secondary** | 1 px Silver 300 border, navy text; hover → navy border | 1 px Navy 700 border, white text | Alternative actions |
| **Text link** | Deep Teal text; hover → tide-stroke underline draws in | Teal Light text | Inline and "Learn more" links |

Specifications:
- Height 48 px (44 px compact); horizontal padding 22 px; radius **10 px** (soft, not pill); Inter 600, 15–16 px.
- Optional trailing arrow icon that shifts 3 px on hover.
- **Focus:** 3 px outline with 2 px offset, Deep Teal on light and Teal Light on dark. Always visible on keyboard focus.
- Disabled: Silver 100 background, Slate 500 text, no shadow.
- External links (e.g. sarastech.co.in) show an "opens in a new tab"/external icon and accessible label.

---

## 8. Cards

### 8.1 Business card (verticals)
- White surface, 1 px Silver 200 border, radius 16 px, generous padding (32–40 px).
- Contents: eyebrow ("Business"), vertical name (H3), one-line purpose, status summary (e.g. "1 product · Available Now" or a "Planned" badge), offerings list, text link.
- Hover/focus: border shifts to Silver 300, card lifts 2 px, the tide stroke draws in. The whole card is one link with a single accessible name.

### 8.2 Product card
- Top band in the product's accent (SarasTech uses the Silver Tide teal family until SarasTech brand colours are supplied), product name, category, status badge, 2–3 capability chips, CTA.
- Planned products use a calmer variant: mist background, line illustration instead of a screenshot, "Planned" badge, no sign-up CTA.

### 8.3 Status badge
Rounded 999 px chip, JetBrains Mono 12 px uppercase, leading 6 px dot, colours per §4.2.

### 8.4 Founder card
- Uniform card per founder: supplied photo in a 4:5 frame with the silver-toned treatment (§6.4) and the full name. A founder without a photo falls back to a monogram tile (initials on a silver-to-mist tide pattern) in the same frame.
- No designation, bio or links until provided. All five founders use the same crop and treatment.
- Grid: five across on desktop, three on tablet, two on mobile; an incomplete last row is centred.
- Hover (pointer devices): the photo eases in 3 % and some colour returns over 300 ms. Decorative only; no zoom under reduced motion.
- Section heading: **Founders & Directors**.

### 8.5 Roadmap step
Phase number (mono), title, one-line description, status badge. Steps connect along a rising tide line. The "Available Now" step is solid teal; planned steps are silver outlines.

### 8.6 Founders' note preview
- A navy band after the founder grid (home and Leadership pages): the note's title, its founder-supplied excerpt as a large quotation (Manrope, white, Sea Teal quotation mark), an overlapping row of the five portraits, all five names with "Founders & Directors, Silver Tide Tech", and a "Read the full note" link that opens in a new tab with an external-link icon and an accessible "opens in a new tab" label.
- The full note is a long-form reading page: names, portraits and date above the text; body at a 68-character measure.

---

## 9. Navigation

- **Desktop (≥ 1024 px):** logo left; Home · Businesses · Products · About · Leadership · Careers; **Contact** as a compact primary button on the right. Businesses and Products open small panels listing entries with status badges.
- **Active state:** Deep Teal text plus a 2 px tide-stroke underline.
- **Scroll behaviour:** header hides on scroll down and reappears on scroll up (≈ 250 ms). It gains a subtle bottom border and background blur only after leaving the top.
- **Mobile / tablet (< 1024 px):** logo + menu button. The menu opens a full-height navy panel with large Manrope links, expandable Businesses/Products groups and a Contact button. It traps focus, closes on Esc, and restores focus to the menu button.
- **Footer:** navy background; ST app icon with "Silver Tide Tech" in white (§3.2) + tagline; columns: Businesses, Products, Company, Connect; legal row.

---

## 10. Animation principles

1. **Purposeful:** motion explains (draw attention, show state, express "rising"), never decorates for its own sake.
2. **Calm:** durations 200–700 ms; one ambient effect per page at most (the hero tide lines).
3. **Consistent easing:** `cubic-bezier(0.22, 1, 0.36, 1)` ("tide-out") for entrances; `cubic-bezier(0.65, 0, 0.35, 1)` for state changes.
4. **Durations:** micro (hover, focus) 150–200 ms; component (menus, cards) 250–350 ms; signature (tide stroke draw, logo rise) 600–700 ms; ambient drift 18–30 s loops.
5. **Scroll reveals:** a single subtle fade-and-rise (12 px) per section, triggered once. Card groups may stagger their entrance (the founder cards rise 60 ms apart). No scroll-jacking, no parallax on text.
6. **Reduced motion (mandatory):** with `prefers-reduced-motion: reduce`, all ambient motion stops, reveals become instant, the tide stroke renders fully drawn, and pointer-reactive effects are disabled. A visible "pause motion" control is provided on the hero.
7. **Performance:** animate only `transform` and `opacity` (SVG stroke-dashoffset for line draws); pause ambient animation when off-screen or the tab is hidden.

---

## 11. Responsive design principles

- **Breakpoints:** 0–639 (mobile), 640–1023 (tablet), 1024–1279 (laptop), ≥ 1280 (desktop); max content width 1200 px with 24 px minimum gutters (32 px from 768 px).
- **Grid:** 4 columns mobile, 8 tablet, 12 desktop; 24 px gutters.
- **Mobile-first:** design every section at 360 px first; the desktop layout is the enhancement.
- **Stacking order:** heading → text → action → visual. Visuals never precede the headline on small screens.
- **Touch:** minimum 44 × 44 px targets; hover effects always have a focus/tap equivalent.
- **Fluid type** via `clamp()` between the mobile and desktop sizes in §5.2.
- **Media:** responsive images, art-directed crops for the hero; tide-line SVGs scale without loss.

---

## 12. Brand voice

| Principle | Do | Don't |
|---|---|---|
| **Clear** | "SarasTech helps teachers plan lessons and create question papers." | "Revolutionising the pedagogical paradigm with next-gen AI." |
| **Honest about status** | "We plan to launch an AI platform for students." | "Coming soon: the future of learning!" |
| **Human** | "Built to give teachers time back for teaching." | "Leveraging synergies for stakeholder value." |
| **Confident, not loud** | "We build technology products that solve real problems." | "The world's most innovative tech company." |

Writing rules: active voice; short sentences; second person ("you") for audiences; first-person plural ("we") for the company; no exclamation marks in headings; no unverifiable superlatives.

## 13. Website messaging examples

| Placement | Example copy |
|---|---|
| Home hero headline | **Building Technology. Empowering People.** |
| Home hero sub-line | Silver Tide Tech is a product-led technology and innovation company. We build products, digital platforms and solutions that solve real-world problems. |
| What We Build intro | Our businesses start with a real problem and grow into products people rely on. |
| Education card | **Education.** Our first major vertical, starting with AI that supports teachers every day. |
| Technology Services card | **Technology & Consulting Services.** *Planned.* Engineering and consulting for organisations that want to build with modern technology. |
| SarasTech feature | **SarasTech: an AI Teaching Assistant.** Lesson plans, question papers, quizzes and worksheets, classroom coaching and a resource library, in a workspace built for teachers. Multilingual. |
| Roadmap intro | Where our education work is heading. Today, SarasTech supports teachers. Over time, we plan to connect AI, human teachers, mentorship and physical classrooms into one ecosystem. |
| Founders section | **Founders & Directors.** The people building Silver Tide Tech. |
| Careers teaser | We're building for the long term, and we're always glad to hear from people who want to build with us. |
| Contact CTA | Have an idea, a question or a project in mind? Let's talk. |

*(Example copy from the proposal stage; the live wording is on the website and remains open to founder review.)*

---

## Change log
- **2026-10-31, v2 (this version):** brought in line with the built website; the brand strategy is unchanged.
  - §3 now documents the official ST monogram logo and app icon, replacing the "Rising Tide" proposal;
  - founder cards (§8.4) describe the supplied photos, the five-founder grid and the hover; new §8.6 for the founders' note preview;
  - imagery (§6.4), fonts (§5.1), footer (§9) and scroll reveals (§10) match the implementation;
  - links to the retired style tile removed.
- **2026-10-31, v1:** proposal for founder approval.
