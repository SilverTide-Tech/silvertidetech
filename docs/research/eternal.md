# Design reference study: eternal.com

**Purpose:** reference research for the Silver Tide Tech corporate website.
**Studied:** 2026-10-31 — home, Culture, Careers, Investor Relations, Contact, and all four business detail pages.
**Method:**
- REA `capture_browser_scenario` in a REA-launched headless Chrome (owned temporary profile) for screenshots, DOM, accessibility trees and network inventories at four viewport widths, with motion both enabled and reduced.
- Static reading of the site's own CSS/JS bundles (parsed, not executed).
- Claude in Chrome (the user's Chrome, a new tab) for real pointer hover tests and computed-style reads. No forms were filled or submitted.

> This document records *patterns and techniques* to learn from. Silver Tide Tech must use its own
> code, copy, imagery, illustrations, logos and brand identity. Nothing from eternal.com — assets,
> code, copy, illustrations or brand marks — is to be copied.

**Labels used throughout**

- **[O] Observed** — seen in a capture, a live browser, or literally present in shipped CSS/JS.
- **[I] Inferred** — reasoned from code or partial evidence, not seen executing.
- **[U] Unknown** — not established by this study.

---

## 0. Evidence ledger

| Evidence ID (REA) | Capture | Viewport / motion |
|---|---|---|
| `ev_36b8380f…f1fbaa` | Home first paint: screenshot, DOM, a11y tree, network (132 requests) | 1440×900, motion on |
| `ev_5ae5e4e9…381863` | Home scroll-through, 12 steps + final DOM | 1440×900, motion on |
| `ev_4f86c4be…423501` | Home mobile: hero, scroll, hamburger menu | 390×844, motion on |
| `ev_7a07d41e…1bb4609d` | Home mobile timed frames (3/5/7 s) + menu | 390×844, **reduced motion** |
| `ev_c044c9d9…829fdbe` | Same scenario, identical timings | 390×844, motion on |
| `ev_28e51ee6…ba1bd9` | Home tablet scroll-through | 768×1024 |
| `ev_ea4c49a7…38b57c9` | Home small-laptop scroll-through (menu click step failed — no hamburger at this width) | 1024×768 |
| `ev_f8d37bf6…11abfffd` | `/our-businesses/zomato` scroll-through + a11y | 1440×900 |
| `ev_9e374ac9…d0e5ced6` | `/our-businesses/blinkit`, `/district`, `/hyperpure` heroes + a11y | 1440×900 |
| `ev_89897c82…7194c6` | `/culture` scroll-through + a11y | 1440×900 |
| `ev_6ccd7a65…c95d8` | `/careers` scroll-through + a11y | 1440×900 |
| `ev_7c3f6736…85f39e0` | `/investor-relations` scroll-through + a11y | 1440×900 |
| `ev_adf0b34b…42523c7d` | `/contact` scroll + a11y | 1440×900 |
| Claude in Chrome session | Hero cursor tracking, business-card hover, link/nav hover, computed transitions | ~1280 wide, user's Chrome |

Raw captures, extracted screenshots and downloaded CSS/JS live in the session scratchpad, not in this repository. Full evidence IDs are listed in Appendix A.

---

## 1. Technology [O]

- **Astro** static site (`/_astro/*` hashed chunks, `<astro-island>` elements) with **React islands** hydrated per section (`HeroGrid`, `OurBusiness`, `SHLGlance`, `SustainableJourney`, `MobileHeader`, `CustomCarousel`, …).
- **Tailwind CSS**, with many arbitrary values (`text-[40px]`, `bg-[#0A0A0A]`).
- **Embla Carousel** for business carousels; a native `overflow` scroller with `scrollBy({behavior:"smooth"})` for others; `react-toastify` for notifications.
- Analytics: gtag/GA, Datadog RUM, a first-party event endpoint. Nav links and the hero CTAs fire click-tracking events (seen in the header and hero scripts). Whether *every* CTA is tracked: [U].
- Fonts and images come from a CDN; `font-display: swap`.
- No smooth-scroll or scroll-animation library on the home page. A search of all 41 home-page script chunks found no GSAP, ScrollTrigger, Lenis, Framer Motion, Locomotive, AOS, Swiper or Splide strings. The only `IntersectionObserver` is inside Embla's slide-visibility code (`CarouselArrowButtons` chunk), not a reveal effect. Other pages' bundles were not searched: [U].

---

## 2. Global design system

### 2.1 Grid and layout [O]
- `Page__grid-layout`: `grid-template-columns: 1fr 0 1200px 0 1fr` → a **1200 px content column**. Below 1448 px it becomes `minmax(24px,1fr) 0 minmax(0,1200px) 0 minmax(24px,1fr)` → **24 px minimum gutters**. Full-bleed blocks use `grid-col-full`.
- Generous vertical rhythm — [I] roughly 150–250 px between sections on desktop, estimated from screenshots rather than measured; thin hairline rules separate some sections [O].

### 2.2 Typography [O]
- **Single typeface: Be Vietnam Pro** (weights 100–700 loaded; mostly 300 Light and 500 Medium). It is an open-source Google Font (OFL).

| Role | 390 → 768 → 1024 → 1440 px | Weight |
|---|---|---|
| Home hero statement | 47 → 60 → 60 → **98 px** | Light |
| Page hero (Culture/Careers) | [I] ≈ 56–60 px at 1440 (estimated from screenshots; class values not extracted), centred | Medium |
| Section heading | 24 → 30 → 40 → **40 px** | Medium |
| Card heading | 20 → 28 px | Regular |
| Body / lede | 16 → **20 px**, colour `#414A5D` | Light |
| Nav / UI | 14–18 px | Regular |

- **Signature heading accent:** every section heading has a `::after` bar — **64 × 3 px, `#7293F3`**, 8–12 px below.
- Key phrases inside body copy are set in a heavier weight instead of colour.

### 2.3 Colour [O]

| Token | Value | Use |
|---|---|---|
| Ink | `#0A0A0A` | Headlines, solid CTA |
| Body | `#414A5D` | Paragraphs |
| Accent | `#7293F3` | Heading bars, active-nav and link-hover underline, inline links, icons |
| Hairlines | `#D0D4DC`, `#E6E9EF` | Link base underline, borders |
| Grid lines | `#CAD5E2` | Hero line grid |
| Surface tint | `#F8F9FC` / light grey | Footer, CTA panels |
| Tile | `#2E2E2E` | Business logo tiles |

- **All photography is black-and-white.** Brand colour appears only when a user hovers a business tile → one unified group identity over very different product brands.

### 2.4 Illustration and imagery [O]
- Corporate pages (home, products, investors, contact) use **desaturated photography**.
- People pages (Culture, Careers) switch to **grey line-art character illustrations** plus a **hand-drawn accent-blue ellipse** circling a key phrase in each heading ("always Day 1", "uncomfortable…"). This gives the culture story a warmer, more human voice while keeping the same palette.
- Hero backgrounds on Culture/Careers use a faint **perspective (vanishing-point) line grid**. It is a sibling of the home page's flat line grid, and the two together form a recurring "grid" motif.

### 2.5 Buttons and links [O, timings verified live]
- **Text link (`.button`)**: 1 px `#D0D4DC` base line 6 px under the text (4 px on mobile). On hover a `#7293F3` line grows **width 0 → 100 % over 0.7 s**. No timing function is declared (`transition: width .7s`), so the CSS default `ease` applies. Seen live.
- **Solid CTA**: `#0A0A0A` rectangle, white Medium text, square corners, `py-[11px] px-4`.
- **Circular arrow buttons** (carousels): outlined circle + chevron; the "can't scroll" side renders lighter (state from scroll position, threshold 40 px).
- **Inline contact links**: accent-blue text with a small line icon (map pin, phone, envelope, globe).

---

## 3. Navigation

### 3.1 Comparison across breakpoints [O]

| | 390 px (mobile) | 768 px (tablet) | 1024 px (small laptop) | 1440 px (desktop) |
|---|---|---|---|---|
| Header type | Centred logo + hamburger (right) | Same as mobile | **Inline desktop nav** | Inline desktop nav |
| Links visible | Behind menu | Behind menu | Logo left, 6 links right | Logo left, 6 links right |
| Menu | Full-screen white panel drops from top, large light links, icon → ✕ | Same | — | — |
| Hide on scroll | Yes | Yes | Yes | Yes |

- The desktop header wrapper is `hidden lg:block` → **desktop nav from 1024 px**. Confirmed: at 1024 px the hamburger click failed because no hamburger is rendered.
- Mobile panel: `-translate-y-full → 0`, **700 ms ease-in-out**, `z-40` beneath the `z-50` header bar.
- **Active page:** a 1 px `#7293F3` underline using `transform-origin:left; scale-x-100` with a 700 ms transform transition [O]. Inactive links show **no hover underline** (live test) [O].

### 3.2 Hide-on-scroll header [O]
From `headerScroll.js` and the header script:
- Scroll **down** beyond 200 px → `-translate-y-full opacity-0`, `transition-all 300ms ease-in-out`.
- Scroll **up** → header returns; a bottom border appears when not at the top, and is removed at the top.
- Passive scroll listener, throttled with `requestAnimationFrame`, 1 px direction threshold.
- Confirmed at every width: header present at scroll 0, hidden after scrolling down.

### 3.3 Section-specific navigation [O]
- **Investor Relations swaps the global nav for its own sub-nav:** IR Home · Results · Announcements · Governance · Impact (same header component, different link set). This makes the investor area feel like a self-contained micro-site inside the corporate site.

### 3.4 Footer [O]
- Pale tint, logo + three titled groups (Our businesses · About · Get in touch), muted links; slim legal row (©, Privacy, Terms). Identical on every page.

---

## 4. Responsive behaviour

### 4.1 Breakpoints [O]
Tailwind defaults 640 / 768 / 1024 / 1280 / 1536 px, plus custom 374–1023, ≤ 420, ≤ 480, ≤ 700, ≤ 900, ≤ 1448 px and `max-height: 800px`.

### 4.2 Layout changes by width [O]

| Element | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|
| Hero statement | 4 lines, 47 px | 2 lines, 60 px | 2 lines, 60 px | 2 lines, 98 px |
| Founder note | Below hero, left | Below hero, left | Right-aligned under hero | Right-aligned |
| Business carousel | 1 card (≈ 90 %), arrows above | ≈ 2 cards (50 %) + peek | 2 cards + peek | 448 px cards, ~3 visible |
| Carousel arrows | Above cards, left | Above cards, left | Right of the intro | Right of the intro |
| Text/image splits | Stacked | Stacked, **text first, image after** | Side by side | Side by side |
| Hero grid cell | 50 × 35 px | 50 × 35 px | 80 × 60 px | 80 × 60 px |
| Spotlight | Auto-cycling [O] | Auto-cycling [I] (code: ≤ 900 px) | Pointer-following [I] (code: > 900 px) | Pointer-following [O] (live test at ~1280 px) |
| Gutters | 24 px | 24 px | 24 px | centred 1200 column |

[I] On narrow screens the "mirrored" splits (image | text) stack text-first, so headings always lead content regardless of the desktop column order.

---

## 5. Animation and interaction

### 5.1 Inventory and timing

| Interaction | Mechanism | Timing / easing | Evidence |
|---|---|---|---|
| Hero spotlight (pointer) | Overlay translated to cursor on `mousemove` (> 900 px) | `all .8s ease-out` | [O] code + live: spotlight moved with the pointer |
| Hero spotlight (auto) | `setInterval` through 6 waypoints (≤ 900 px) | every **2 s**, `ease-in-out` | [O] code + timed captures (position changes 3 → 5 → 7 s) |
| Scroll-down arrow | `scrollIntoView({behavior:"smooth", block:"center"})` | browser default | [O] code |
| Header hide/show | class swap | **300 ms** ease-in-out | [O] |
| Mobile menu | translateY panel | **700 ms** ease-in-out | [O] |
| Business tile hover | inner tile `scale-110` inside `overflow-hidden` + background colour change (brand red / yellow / image / …); logo recolours | **700 ms** `cubic-bezier(.4,0,.2,1)` | [O] live hover + computed styles |
| Text-link hover | accent line width 0 → 100 % | **700 ms** | [O] live + CSS |
| Active nav underline | `scale-x` from left | 700 ms | [O] CSS |
| Carousel step | `scrollBy` one card + margin, smooth | browser default | [O] code |
| Loading | shimmer skeletons (`shimmer`, `img-shimmer` keyframes) | — | [O] |
| Scroll-reveal / parallax | none found | — | [O] no reveal in any scroll-through, and no reveal library or reveal-style `IntersectionObserver` in the home-page chunks (§1); [I] none exist site-wide |

**Hero spotlight construction** [O]: a CSS line grid (two linear gradients, `#CAD5E2`) sits under a 900 × 500 overlay whose radial gradient is transparent in the centre and white at the edges, with `box-shadow: 0 0 0 10000px #fff` masking everything else. Only an elliptical "window" of grid shows, and it trails the pointer.

### 5.2 Reduced motion [O]
- Captures with `prefers-reduced-motion: reduce` and with `no-preference` produced **byte-identical screenshots at every step** (`ev_7a07…` vs `ev_c044…`). Under reduced motion the spotlight still auto-cycles: its position changes between the 3 s, 5 s and 7 s frames [O].
- Mobile menu: the panel's `transition-transform duration-700` class has no `motion-reduce:` variant [O, code]. However, in both runs the panel was already fully open in the frame taken after the click, so the captures cannot show whether it animated under reduced motion. [I] It does, since nothing in the code disables it.
- Tailwind `motion-reduce:` utilities exist in the CSS, but **none are used in the home-page DOM**, and the downloaded components never query the preference.
- Conclusion: **the site does not honour reduced motion** on the elements studied. [U] Whether other pages use the variants.

### 5.3 Motion character
Restrained and slow. No scroll-jacking or scroll-triggered reveals; one signature ambient effect (spotlight grid) plus 0.7–0.8 s hover transitions that feel deliberate and premium.

---

## 6. Page-by-page: identity, story, careers, business information

### 6.1 Home [O]
Typographic mission-statement hero → founder's note link → business carousel → vision & mission → working-here teaser → performance-at-a-glance (financial cards) → impact → footer. It reads as a table of contents for the whole company, with each block linking deeper.

### 6.2 Culture — company story and values [O]
- Centred hero: small eyebrow line + one bold principle statement over the perspective grid.
- A sequence of **value blocks in a zig-zag layout** (text left / illustration right, then reversed), each with:
  - a heading with one phrase circled by the hand-drawn accent ellipse;
  - a short, frank manifesto-style paragraph, with the final sentence emphasised.
- The **origin story** (founding date and how it started) is told inside the first value block rather than as a separate timeline.
- Closes with a "culture book" promo (product shot + solid CTA).
- Voice: blunt, first-person-plural, deliberately challenging. The identity is carried by tone more than visuals.

### 6.3 Careers — hiring philosophy, not a job board [O]
- Centred hero statement about hiring → philosophy copy beside an illustration.
- A short **checklist of questions** the company asks about candidates.
- A process note (referral-only applications) followed by an **anti-recruitment-fraud notice** with a reporting email.
- A **2 × 2 grid of benefit cards** (outlined cards, illustration, title, two-line description).
- [O] There are **no job listings, filters or application forms** on this page.

### 6.4 Investor Relations — dense, utilitarian sub-site [O]
- Own sub-navigation (see §3.3).
- Hero: full-bleed B/W aerial photo with the page title left and a **floating light "quick links" panel** on the right (company overview, latest results documents — each row: icon, label, circular arrow).
- "Our businesses" as a **2 × 2 grid of horizontal cards** (logo tile left; segment name, one line, "Learn more" right). These use *segment* names (food delivery, quick commerce, …) rather than marketing taglines, for an investor audience.
- Impact (three items), **email-alert subscription** (single email field), a questions/contact line, resources.
- **Statutory contact directory**: two-column blocks for compliance officers, registrar and company, each with icon-led address/phone/email rows. Then regulatory portal links and an accordion of statutory disclosures.

### 6.5 Contact [O]
- Centred heading + friendly subline.
- Outlined form card (left): company select → topic select → name → email + mobile (country-code prefix) → message → submit. A B/W photo of headquarters sits on the right.
- [O] Accessibility issue: in the accessibility tree, the header link and navigation **and** the footer headings and links all sit inside the `main` landmark, and the page exposes **no `banner` or `contentinfo` landmark** (`ev_adf0b34b…`). The text inputs have accessible names, but both dropdowns appear as unnamed `combobox`es.
- [U] Validation and submission behaviour (not exercised — no data was entered).

### 6.6 Business detail pages — the product template [O]
All four pages (Zomato, Blinkit, District, Hyperpure) share one template:

1. **Hero:** full-bleed B/W photo with dark overlay; brand wordmark + one-line mission in large white type.
2. **Story split:** narrative paragraphs (key phrase bold) | supporting photo.
3. **Proof section** (varies):
   - stat cards — three outlined cards with a small accent-blue line icon and a large stat sentence. Seen visually on Zomato [O]. Blinkit and Hyperpure contain the same kind of stat sentences in their accessibility trees [O], but only their heroes were screenshotted, so their visual treatment is [U] ([I] probably the same card);
   - and/or an offerings grid of categories or capabilities (Blinkit "Beyond essentials", District "focussed on building", Hyperpure "Key offerings").
4. **Primary CTA panel:** tinted block, "Download the app" + store badges | phone mockup with QR code.
5. **Cross-sell:** "Our other businesses" carousel, excluding the current brand.
6. Shared footer.

---

## 7. Product architecture and reusable components

### 7.1 Page templates [O → I]

| Template | Used by | Structure |
|---|---|---|
| **Home / overview** | `/` | Statement hero → section blocks that each preview and link to a deeper page |
| **Manifesto page** | Culture, Careers | Centred statement hero (grid bg) → zig-zag text/illustration blocks → card grid → closing CTA |
| **Product detail** | 4 business pages | Photo hero → story split → stats/offerings → CTA panel → cross-sell carousel |
| **Section sub-site** | Investor Relations (+ Results, Announcements, Governance — not studied) | Own sub-nav → hero with quick-links panel → grids, subscription, directory, accordions |
| **Form page** | Contact | Centred heading → form card + image |

### 7.2 Component inventory (observed across pages)
1. Global header (desktop inline / mobile hamburger + full-screen panel, hide-on-scroll, active underline).
2. Section-nav variant of the header (IR).
3. Section heading with accent bar (+ optional lede paragraph).
4. Text link with animated underline; solid CTA; circular arrow button.
5. Business card — vertical (home carousel) and horizontal (IR grid) variants; hover brand fill.
6. Carousel shell (Embla / native scroller) with arrow state.
7. Text/media split (normal + mirrored), stacking text-first on mobile.
8. Stat card (icon + big stat sentence, outlined).
9. Feature/benefit card with illustration (2 × 2 grid).
10. Photo hero with overlay + wordmark + statement.
11. Statement hero (centred, grid background) with hand-drawn highlight.
12. CTA panel (tinted, text + badges | device mockup).
13. Quick-links panel (icon rows with arrow buttons).
14. Contact directory block (icon-led address/phone/email rows).
15. Accordion (disclosures).
16. Email-subscribe inline form; contact form card.
17. Skeleton/shimmer loader.
18. Footer.

**Takeaway [I]:** about 18 components and 5 templates cover the whole site. Most visual variety comes from content and imagery, not from bespoke layouts.

---

## 8. Transferable lessons

These are brand-neutral lessons drawn from the findings above. Silver Tide Tech's own brand, architecture and design decisions live separately in `docs/strategy/` (`company-vision.md`, `brand-direction.md`, `website-architecture.md`) and are not part of this research.

Adopt as *patterns*, executed in an original visual language:

1. **Architecture:** Astro + Tailwind, React islands only where interaction is needed. Static-first content, server-render key data (avoid client-only skeletons for important content).
2. **System over pages:** define ~5 templates (Home, Product, Manifesto/About, Section sub-site e.g. Investors or Partners, Form) and a component library like §7.2 before building pages.
3. **Grid:** one centred content column (≈1200 px) in a 5-column CSS grid, with full-bleed escape and a 24 px minimum gutter.
4. **Type and colour restraint:** one typeface family, two working weights, an oversized light hero statement. A neutral palette plus **one accent**, applied through one repeated signature detail. That detail should be original, not a copy of the heading bar.
5. **Unifying imagery treatment:** a single consistent photo treatment, so multiple products read as one company; reveal product colour on interaction.
6. **Signature hero interaction:** one ambient effect with an original concept, auto-animated on touch devices — **and paused or static under reduced motion**.
7. **Header:** hide-on-scroll-down / show-on-scroll-up (≈300 ms), rAF-throttled passive listener; desktop nav from `lg`; full-screen mobile menu with focus trapping.
8. **Product pages:** one template — hero → story → proof numbers → primary CTA → sibling products.
9. **Careers:** lead with philosophy, values and benefits. Unlike the reference, include open roles or a clear application path when hiring openly.
10. **Section sub-sites:** if investor/partner content grows, give it its own sub-nav and a quick-links hero panel.
11. **Motion budget:** slow, subtle hover transitions (0.5–0.8 s), no scroll-jacking.

Do better than the reference:

- **Honour `prefers-reduced-motion`** for every animation (the reference does not).
- One `<h1>` per page; correct heading hierarchy; no `<button>` nested inside `<a>`; header/footer outside `<main>`; labelled form controls.
- Visible keyboard focus states and a keyboard-accessible carousel.
- Hover-only effects need a touch/focus equivalent (the brand-colour reveal is invisible on phones).

---

## 9. Status of research questions

| Question | Status | Basis |
|---|---|---|
| Layout, grid, typography, colour | **Answered** | [O] captures + CSS |
| Desktop vs tablet vs mobile navigation | **Answered** | [O] 390 / 768 / 1024 / 1440 captures |
| Layout changes and breakpoints | **Answered** | [O] captures + CSS |
| Reduced-motion behaviour | **Answered** (home) | [O] byte-identical A/B captures; [U] other pages |
| Hover effects | **Answered** | [O] live Claude in Chrome hover + computed styles |
| Animation timing and transitions | **Answered** | [O] CSS/JS + computed styles |
| Culture, Careers, Investors, Contact | **Answered** at page-structure level | [O] scroll-throughs + a11y trees |
| Product detail template | **Answered** — all four pages | [O] |
| Reusable structures / components | **Answered** | [O] inventory; template grouping [I] |
| Contact form validation/submission | Unresolved (intentionally not exercised) | — |
| Performance-at-a-glance card content | Unresolved — skeletons in every headless capture | [U] |
| IR sub-pages (Results, Announcements, Governance), Impact, Blog, Founder's letter | Not studied | — |
| Mobile/tablet layouts of inner pages | Not captured (home only) | [I] same components → same stacking rules |
| Mobile-menu animation under reduced motion | Partially answered | [O] no `motion-reduce` variant in code; timing not captured |
| Animation libraries on inner pages | Not checked | Home page only (§1) |

---

## Appendix A: Full evidence IDs

| Short | Full REA evidence ID |
|---|---|
| Home first paint | `ev_36b8380f1ed4740cb3e39b279f8dec5829cd522b8dce5e6f09ea0f8757f1fbaa` |
| Home scroll-through | `ev_5ae5e4e946dd3a07fc1f42aa5d6b80cbc13edbb6f9846d1852255f49c6381863` |
| Home mobile | `ev_4f86c4be02c3bb1fc5b4200e74e49071eb038f26f858e035018554106f423501` |
| Mobile, reduced motion | `ev_7a07d41ec83c408495d01447f73d9e377a2ddea3f725076eb3f649e81bb4609d` |
| Mobile, motion on (A/B pair) | `ev_c044c9d945658335edfec7bd547f4fffbeb1b79e1f93acf52e53c1fb9829fdbe` |
| Tablet 768 | `ev_28e51ee61909f30798d60cf1fc33fda62f9783908b01b03a4be5ca485fba1bd9` |
| Small laptop 1024 | `ev_ea4c49a71a956876775302e9785b14b868cd30bad94423210b2e8174f38b57c9` |
| Zomato page | `ev_f8d37bf61cf43bc21ef391e3c675cf506a0918ec9ddd0ade1b730c9f11abfffd` |
| Blinkit / District / Hyperpure | `ev_9e374ac9a3ca436b8ca9ea7d918d8a0a6396d5c7a0a042f6f0cb2592d0e5ced6` |
| Culture | `ev_89897c8273de58fac7dcf3e3b6346762d2df616330fd9d9389f5fe9de57194c6` |
| Careers | `ev_6ccd7a65f92f85e152f08db82845c1de013572b7e34c8da6a95550c75c1c95d8` |
| Investor Relations | `ev_7c3f6736b846dcb655494127ab00c40f57ddf53ed854acb795392441585f39e0` |
| Contact | `ev_adf0b34bc7a3b07c990ed5a25b9f64154b66cc509cebbcd94f8e60a942523c7d` |

These IDs refer to records in the REA session ledger and in the exported bundles in the session scratchpad. They are not stored in the repository.

## Appendix B: Review log

**2026-10-31, accuracy review.** Every claim was rechecked against the stored captures and the downloaded CSS/JS. Corrections:

1. Ledger ID for the reduced-motion capture corrected (`…4bb4609d` → `…1bb4609d`); full IDs added (Appendix A).
2. Text-link hover easing corrected from "linear" to the CSS default `ease`.
3. Reduced-motion: "the menu still slides" was overstated. It is now split into an observed code fact and an inferred behaviour.
4. "No animation libraries" now rests on a search of all 41 home-page chunks (previously it was based on file names). The only `IntersectionObserver` was traced to Embla.
5. "Every nav and CTA click is tracked" narrowed to what the code shows.
6. Contact-page landmark finding restated precisely: no banner/contentinfo; header and footer content inside `main`.
7. Product-page stat cards: visual treatment confirmed for Zomato only; Blinkit and Hyperpure marked [U] for visuals.
8. Estimated values (vertical rhythm, Culture/Careers hero size) and per-width spotlight modes labelled [I] where they come from code or estimation.
9. §8 renamed "Transferable lessons" and stripped of Silver Tide Tech-specific brand ideas, which now live in `docs/strategy/`.

No findings were removed.
