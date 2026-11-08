# Silver Tide Tech: website architecture

**Status:** Approved and implemented (v2, 2026-10-31). The website described here is built: Astro static site, all launch pages live in the build, quality checks passing. See §11 for implementation status and open items.
**Inputs:**
- [`company-vision.md`](company-vision.md): facts and statuses
- [`brand-direction.md`](brand-direction.md): design system
- [`../research/eternal.md`](../research/eternal.md): quality benchmark only

---

## 1. Sitemap

### 1.1 Launch pages

| # | Page | URL | Template |
|---|---|---|---|
| 1 | Home | `/` | Home |
| 2 | About Silver Tide Tech | `/about` | Story |
| 3 | Businesses Overview | `/businesses` | Overview |
| 4 | Education | `/businesses/education` | Business |
| 5 | Technology Services | `/businesses/technology-services` | Business |
| 6 | SarasTech | `/products/sarastech` | Product |
| 7 | Vision & Roadmap | `/vision` | Story + Roadmap |
| 8 | Leadership (Founders & Directors) | `/leadership` | People |
| 8a | A Note from Our Founders | `/leadership/founders-note` | Article |
| 9 | Careers | `/careers` | Careers |
| 10 | Contact | `/contact` | Form |
| 11 | Privacy Policy | `/privacy` | Legal |
| 12 | Terms & Conditions | `/terms` | Legal |
| 13 | 404 | `/404` | Utility |

Also at launch: `/products`, an overview of all products generated from content. It's needed because "Products" is a primary nav item.

Internal only: `/foundation`, a design-system reference page (tokens and components). It is `noindex`, disallowed in `robots.txt`, excluded from `sitemap.xml` and linked from nowhere.

### 1.2 Future pages (same templates, no redesign)

| Pattern | Example |
|---|---|
| `/businesses/<slug>` | a new industry vertical |
| `/products/<slug>` | AI Platform for Students (once named and announced) |
| `/leadership/<slug>` | individual founder pages, once bios exist (`founders-note` is already taken by the founders' note) |
| `/news`, `/news/<slug>` | announcements |
| `/blog`, `/blog/<slug>` | articles |
| `/brand` | press kit / brand resources |

### 1.3 URL rules
- Lower-case, hyphenated, stable slugs; no dates in product or business URLs.
- Planned items **do not get their own pages** until announced. They appear as roadmap cards on business pages and `/vision`, which avoids thin "coming soon" pages.
- Exception: a planned *vertical* (Technology Services) gets a page because it is part of the core sitemap. Its content stays explicitly "Planned".

---

## 2. Navigation structure

### 2.1 Primary navigation
`Home · Businesses ▾ · Products ▾ · About · Leadership · Careers · [Contact]`

| Item | Behaviour |
|---|---|
| Businesses ▾ | Panel: **Education**, **Technology Services** `Planned`, → All businesses |
| Products ▾ | Panel: **SarasTech** `Available Now`, → All products |
| Contact | Rendered as a compact primary button |

The menu panels are **generated from content**. A new business or product appears automatically, with its status badge, ordered by an `order` field.

Mobile/tablet (< 1024 px): menu button → full-height panel with the same items; Businesses/Products become expandable groups.

### 2.2 Footer

| Column | Links |
|---|---|
| Brand | Logo, tagline "Building Technology. Empowering People." |
| Businesses | Education · Technology Services (Planned) |
| Products | SarasTech ↗ (product page; external link to sarastech.co.in also available on that page) |
| Company | About · Vision & Roadmap · Leadership · Careers |
| Connect | Contact · social links *(to be provided)* |
| Legal row | © year Silver Tide Tech · Privacy Policy · Terms & Conditions |

### 2.3 Breadcrumbs
Shown on business and product pages: `Home / Businesses / Education`, `Home / Products / SarasTech`.

---

## 3. Homepage section hierarchy

| # | Section | Objective | Content | Primary action |
|---|---|---|---|---|
| 1 | **Hero** | Introduce Silver Tide Tech in one glance | H1 "Building Technology. Empowering People."; positioning sub-line; tide-line motif | Explore our businesses · Discover SarasTech |
| 2 | **What We Build** | Show the business ecosystem | Business cards: Education (1 product · Available Now), Technology & Consulting Services (Planned); a quiet line "More businesses as we grow" | Card → business page |
| 3 | **Featured Product: SarasTech** | Show real, launched work | Name, category, value line, 7 capabilities, product visual, Available Now badge | Visit SarasTech ↗ · Learn more |
| 4 | **Our Vision and Mission** | Explain why we exist | Vision, mission and purpose (verbatim) | → About |
| 5 | **Education Ecosystem Roadmap** | Communicate ambition honestly | 4 phases on a rising tide line; Phase 1 Available Now; Phases 2–4 Planned; the integrated-ecosystem sentence | → Vision & Roadmap |
| 6 | **Technology Services** | Introduce the planned vertical | 5 offering tiles, Planned badge, honest framing | → Technology Services (and Contact, if enquiries are approved) |
| 7 | **Founders & Directors** | Show the people behind the company | Five uniform cards: photo and name | → Leadership |
| 7a | **A Note from Our Founders** | Let the founders speak in their own words | Title, founder-supplied excerpt, five portraits and names (navy band) | Read the full note ↗ (new tab) |
| 8 | **Careers** | Invite future team members | One-paragraph invitation | → Careers |
| 9 | **Contact CTA** | Give every visitor a next step | Short invitation + button | → Contact |
| 10 | **Footer** | Navigation and legal | §2.2 | — |

Excluded by rule: statistics, testimonials, customer logos, case studies.

---

## 4. Page objectives

| Page | Primary objective | Key content | Primary CTA |
|---|---|---|---|
| Home | Understand who we are and what we build within 10 seconds | §3 | Explore businesses |
| About | Build trust in the company and its intent | Positioning, vision/mission/purpose, what we believe (pillars), how we work, link to founders | Meet the founders |
| Businesses Overview | See every business and its status | Intro + business cards (generated) + "built to grow" note | Open a business |
| Education | Understand the first vertical and its roadmap | Why education, SarasTech (Available Now), 4-phase roadmap, integrated ecosystem vision | Visit SarasTech |
| Technology Services | Understand the planned services, without overselling | Planned badge, 5 offerings, intended approach, status note | Contact (if approved) or "Stay in touch" |
| SarasTech | Understand the product and go to its website | Hero, problem → solution, 7 capabilities, multilingual, part of the education ecosystem, CTA to sarastech.co.in | Visit SarasTech ↗ |
| Products | See all products and their status | Generated product cards | Open a product |
| Vision & Roadmap | Understand long-term direction | Vision statement, Now / Next / Later, education phases, future ventures intent | Contact / Careers |
| Leadership | Know who founded and directs the company | "Founders & Directors" heading, five uniform cards, founders' note preview | Careers |
| Founders' note | Hear the founders' own view of why the company exists | Founder-supplied title, date, names and portraits, full note text, joint sign-off | Back to Leadership · Careers |
| Careers | Attract and route candidates | Culture intent, how to apply, open roles (if any) or general invitation | Apply / write to us |
| Contact | Route enquiries | Form with topic (General, SarasTech, Technology Services, Careers, Media), contact details | Submit |
| Privacy / Terms | Legal compliance | Founder-supplied or legally reviewed text | — |
| 404 | Recover lost visitors | Short message, search-free links to Home, Businesses, Products, Contact | Go home |

---

## 5. Reusable page templates

| Template | Blocks (in order) | Used by |
|---|---|---|
| **Home** | Hero · business grid · featured product · statement · roadmap · services teaser · people grid · careers band · CTA band | `/` |
| **Overview** | Page hero · generated card grid (grouped by status) · CTA band | `/businesses`, `/products` |
| **Business** | Business hero (name, purpose, status) · why this business · offerings (products/services with badges) · roadmap (optional) · CTA band | `/businesses/*` |
| **Product** | Product hero (name, category, status, CTA, visual) · problem → solution · capability grid · how it works (optional) · audience (optional) · languages (optional) · ecosystem link · FAQ (optional) · CTA band · sibling products (auto, hidden if none) | `/products/*` |
| **Story** | Statement hero · narrative splits · pillars grid · roadmap (optional) · CTA band | `/about`, `/vision` |
| **People** | Page hero · people grid · founders' note preview (when published) · CTA band | `/leadership` |
| **Article** | Page hero with breadcrumbs · byline (portraits, names, date) · long-form prose · back link · CTA band | `/leadership/founders-note` |
| **Careers** | Hero · values · open roles list with empty state · how to apply · CTA | `/careers` |
| **Form** | Hero · form + contact details | `/contact` |
| **Legal** | Title · last-updated date · long-form prose | `/privacy`, `/terms` |
| **Utility** | Message + links | `/404` |

### 5.1 Shared components
Header (desktop/mobile) · footer · breadcrumb · section heading (eyebrow + title + tide stroke) · status badge · buttons/links · business card · product card (live / planned variants) · capability tile · roadmap step/timeline · founder card and founder grid · founders' note preview · founder portrait row · statement block · text/media split · CTA band · form controls · tide-line hero background · external-link indicator. *(FAQ accordion: deferred until FAQs are supplied.)*

---

## 6. Business and product content structure

All structured content lives in typed **content collections** (Astro + Zod schemas). Pages, menus, cards, footers, breadcrumbs, sitemap.xml and structured data are **generated from this content**.

```
src/content/
  businesses/  education.md · technology-services.md
  products/    sarastech.md
  services/    web-software.md · mobile-apps.md · ai-automation.md · cloud-backend.md · consulting.md
  roadmap/     education-phase-1.md … education-phase-4.md
  people/      rajeev-kumar.md · devanshu-deo.md · abhinav-abhishek.md · anuj-shahi.md · sachin-kumar.md
  notes/       founders-note.md
```

Supporting files: founder photos in `src/assets/founders/`, the SarasTech visual in `src/assets/products/`. Approved page copy that is not a collection (vision, mission, purpose, pillars, horizons, contact topics) lives in `src/lib/site.ts` and `src/lib/company.ts`; the planned `pages/` collection was not needed.

### 6.1 Schemas (illustrative)

```ts
type Status = 'available-now' | 'early-access' | 'in-development' | 'planned';

business = {
  name: string;                 // "Education"
  slug: string;                 // "education"
  status: Status | 'active';    // a vertical is 'active' when it has ≥1 available product
  purpose: string;              // one line
  summary: string;
  order: number;
  showOnHome: boolean;
  accent?: string;              // optional per-business accent within the palette
}

product = {
  name: string;                 // "SarasTech"
  slug: string;
  business: reference('businesses');
  category: string;             // "AI Teaching Assistant"
  status: Status;               // "available-now"
  tagline: string;
  summary: string;
  capabilities: { title: string; description?: string; icon?: string }[];
  externalUrl?: string;         // "https://www.sarastech.co.in"
  languages?: string[];         // only when confirmed
  logo?: image; accent?: string;
  order: number; showOnHome: boolean; featured: boolean;
}

service = { name; slug; business: reference('businesses'); status: Status; summary; icon?; order }

roadmapItem = { title; phase: number; business: reference('businesses');
                status: Status; description; product?: reference('products') }

person = { name: string; slug; order: number;
           group: 'founders-directors';
           designation?: string; bio?: string; photo?: image;
           photoPosition: string;       // keeps faces framed consistently in the 4:5 crop
           links?: { label; url }[] }

note = { draft: boolean;                // true → nothing rendered, no page built
         authors: reference('people')[];
         title?: string; excerpt?: string; description?: string; published?: date;
         body: markdown }               // all founder-supplied
```

Optional person fields render nothing when empty, so the cards stay uniform. A published note must have a title, excerpt, date and body, and its excerpt must appear word for word in the body; otherwise the build fails.

### 6.2 SarasTech seed record (facts only)
`name: SarasTech` · `category: AI Teaching Assistant` · `status: available-now` · `externalUrl: https://www.sarastech.co.in` · capabilities: AI Classroom Coach, Lesson Plan Generator, Question Paper Generator, Quiz & Worksheet Generator, Teaching Resource Library, Teacher Workspace, Multilingual support.

---

## 7. Status management

### 7.1 Labels
| Value | Badge | Allowed CTA types | Copy tense |
|---|---|---|---|
| `available-now` | Available Now | Visit / sign up / learn more | Present |
| `early-access` | Early Access | Request access / learn more | Present, limited |
| `in-development` | In Development | Stay updated / learn more | Present progressive ("we are building") |
| `planned` | Planned | Learn more / contact (no sign-up) | Future intent ("we plan to") |

### 7.2 Rules enforced at build time
1. Every product, service, business and roadmap item **must** declare a status (schema-required).
2. A `planned` or `in-development` item **cannot** have an `externalUrl` sign-up CTA. The build fails if it does.
3. Badges are rendered only from the `status` field. Copy must never hard-code a status word.
4. Planned items do not generate standalone pages (§1.3) unless explicitly flagged by the founders.
5. Status changes are made only on founder confirmation and recorded in the commit message.
6. A product image must have alt text, and a published founders' note must meet the rules in §6.1. The build fails otherwise.

### 7.3 Display order
Within any list: Available Now → Early Access → In Development → Planned, then by `order`.

---

## 8. Future extensibility

### 8.1 Adding a new product
1. Add `src/content/products/<slug>.md` with the required fields.
2. The product page, products overview card, Products menu entry, business-page listing, sibling links, sitemap and structured data are generated.
3. Optional: supply the logo and accent colour.

### 8.2 Adding a new business vertical or venture
1. Add `src/content/businesses/<slug>.md`.
2. Add its products/services/roadmap entries that reference it.
3. The business page, overview card, Businesses menu entry and footer link are generated. The home "What We Build" grid includes it if `showOnHome: true`.

### 8.3 When a business needs its own website
The business keeps a summary page on the parent site with `externalUrl` to its own domain. The parent design system can later be extracted into a shared package, but only when a second site actually needs it.

### 8.4 When a vertical becomes its own brand (e.g. consultancy)
Change its `name`, `logo` and `accent` in content. URLs can be redirected if the slug changes. No template changes are needed.

---

## 9. Technical direction

| Area | Decision |
|---|---|
| Framework | **Astro 7** (static output) with **TypeScript** (strict) |
| Styling | **Tailwind CSS 4** with design tokens from `brand-direction.md` (colours, type scale, radii, motion) in `src/styles/global.css` |
| Interactivity | **React 19** islands only where needed: mobile menu, nav panels, hero tide lines, contact form |
| Content | Astro content collections + Zod schemas (§6) |
| Forms | Serverless endpoint or form service with spam protection; no personal data in URLs. *Service not yet chosen: the form validates input and tells visitors their message was not sent.* |
| SEO | Per-page titles/descriptions; canonical URLs, `sitemap.xml` and absolute OG URLs once `SITE_URL` is set; `Organization`, `WebSite`, `SoftwareApplication` (SarasTech), `Article` (founders' note) and `BreadcrumbList` structured data; `robots.txt`; Open Graph image |
| Accessibility | **WCAG 2.2 AA**: semantic landmarks, one `<h1>` per page, labelled controls, visible focus, keyboard-operable menus, skip link, colour never the only signal, **full reduced-motion support** |
| Performance | Static HTML, minimal JS, self-hosted fonts with `font-display: swap`, responsive AVIF/WebP images, SVG motifs; target Lighthouse ≥ 95 on all four categories |
| Analytics | Privacy-respecting analytics; consent banner only if the chosen tool requires it |
| Hosting | Static host + CDN (choice still open) |
| Quality checks | `npm run check` (types), `npm test` (content rules, links, SEO, founders' note), `npm run audit` (axe WCAG 2.2 A/AA, overflow, target size and JS errors on every page at 390/768/1024/1440 px, plus reduced motion) |

---

## 10. Out of scope for v1
Blog/news, multilingual corporate site, individual founder pages, investor section, careers applicant tracking, CMS. All are supported later by §1.2 and §8.

---

## 11. Implementation status (2026-10-31)

**Built:**
1. Foundation: Astro/TypeScript/Tailwind/React set-up, design tokens, components, header with dropdowns and mobile menu, footer, content collections, 404.
2. Homepage: all sections in §3, including the founders' note preview.
3. All launch pages in §1.1, `/products`, and the founders' note page.
4. Quality: structured data, robots, conditional sitemap and canonical URLs, Open Graph image, WCAG 2.2 AA, responsive audit tooling, Lighthouse ≥ 95 targets met when last measured.
5. Branding: official ST monogram logo and app icons (brand direction §3); photos for all five founders; the SarasTech visual.

**Open (founder input needed):** production domain; contact form service and contact details; Privacy Policy and Terms text; Careers wording or open roles; SarasTech languages, audience, how it works and FAQs; hosting, security headers and analytics.

---

## Change log
- **2026-10-31, v2 (this version):** updated to match the built website; the architecture is unchanged in intent.
  - founders: five (one people file each), not six;
  - founders' note added: route, homepage section 7a, page objective, Article template, `notes` collection and its build rules;
  - `/foundation` documented as an internal page;
  - content tree, schemas, technical direction and structured-data list match the implementation; the unneeded `pages/` collection and the deferred FAQ accordion are noted;
  - new §11 implementation status.
- **2026-10-31, v1:** proposal for founder approval.
