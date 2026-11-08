/**
 * Content collections. Schemas follow docs/strategy/website-architecture.md §6;
 * build-time status rules follow §7.2.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { LAUNCHED_STATUSES, STATUSES, type Status } from './lib/status';

const status = z.enum(STATUSES);

const businesses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/businesses' }),
  schema: z.object({
    name: z.string(),
    /** Shorter label for navigation; defaults to `name`. */
    navName: z.string().optional(),
    /** A vertical is `active` when it has at least one available product. */
    status: z.union([z.literal('active'), status]),
    purpose: z.string(),
    order: z.number().int(),
    showOnHome: z.boolean().default(true),
    accent: z.string().optional(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z
    .object({
      name: z.string(),
      business: reference('businesses'),
      category: z.string(),
      status,
      tagline: z.string(),
      summary: z.string(),
      capabilities: z
        .array(z.object({ title: z.string(), description: z.string().optional(), icon: z.string().optional() }))
        .default([]),
      externalUrl: z.url().optional(),
      /** Only languages the founders have confirmed. */
      languages: z.array(z.string()).optional(),
      accent: z.string().optional(),
      order: z.number().int(),
      showOnHome: z.boolean().default(false),
      featured: z.boolean().default(false),
      /** Supplied product visual (src/assets/products), optimised to AVIF/WebP at build time. */
      image: image().optional(),
      imageAlt: z.string().optional(),
    })
    .refine((p) => !p.externalUrl || LAUNCHED_STATUSES.includes(p.status as Status), {
      message: 'Only launched products (Available Now / Early Access) may link to a live product or sign-up.',
      path: ['externalUrl'],
    })
    .refine((p) => !p.image || !!p.imageAlt?.trim(), {
      message: 'A product image needs descriptive alt text (imageAlt).',
      path: ['imageAlt'],
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    business: reference('businesses'),
    status,
    summary: z.string().optional(),
    icon: z.string().optional(),
    order: z.number().int(),
  }),
});

const roadmap = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roadmap' }),
  schema: z.object({
    title: z.string(),
    phase: z.number().int().positive(),
    business: reference('businesses'),
    status,
    description: z.string(),
    product: reference('products').optional(),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().int(),
      group: z.literal('founders-directors'),
      // Optional until supplied by the founders. Never invent these.
      designation: z.string().optional(),
      bio: z.string().optional(),
      /** Supplied headshot (src/assets/founders), optimised to AVIF/WebP at build time. */
      photo: image().optional(),
      /** CSS object-position used to keep faces consistently framed in the 4:5 crop. */
      photoPosition: z.string().default('50% 30%'),
      links: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
    }),
});

/**
 * Notes from the Founders & Directors. Founder-supplied text only: an entry stays a draft (nothing
 * rendered, no page built) until its title, excerpt, date and body are provided.
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z
    .object({
      draft: z.boolean().default(true),
      authors: z.array(reference('people')).min(1),
      title: z.string().optional(),
      /** Quoted in the previews; must appear word for word in the body (checked at build time). */
      excerpt: z.string().optional(),
      /** Meta description; defaults to the excerpt. */
      description: z.string().optional(),
      published: z.coerce.date().optional(),
    })
    .refine((n) => n.draft || (!!n.title?.trim() && !!n.excerpt?.trim() && !!n.published), {
      message: 'A published note needs a founder-supplied title, excerpt and date.',
      path: ['draft'],
    }),
});

export const collections = { businesses, products, services, roadmap, people, notes };
