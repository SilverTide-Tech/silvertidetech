/**
 * Structured data (schema.org JSON-LD), architecture §9: Organization, Product (SarasTech),
 * Article (founders' note) and BreadcrumbList. Only facts from the content collections and company-vision.md are used:
 * no logos of other brands, ratings, prices or social profiles.
 */
import { SITE, type NavLink } from './site';

type JsonLd = Record<string, unknown>;

const abs = (path: string, site?: URL) => (site ? new URL(path, site).href : undefined);

export function organizationSchema(site?: URL, founders: string[] = []): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    description: SITE.description,
    slogan: SITE.tagline,
    ...(founders.length && { founder: founders.map((name) => ({ '@type': 'Person', name })) }),
    ...(site && { url: site.href, logo: abs('/icon-512.png', site) }),
  };
}

export function websiteSchema(site?: URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    ...(site && { url: site.href }),
  };
}

export function softwareProductSchema(
  product: { name: string; category: string; summary: string; externalUrl?: string; capabilities: string[] },
  path: string,
  site?: URL,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: `${product.category}. ${product.summary}`,
    applicationCategory: 'EducationalApplication',
    featureList: product.capabilities,
    ...(product.externalUrl && { url: product.externalUrl }),
    ...(site && { mainEntityOfPage: abs(path, site) }),
    publisher: { '@type': 'Organization', name: SITE.name, ...(site && { url: site.href }) },
  };
}

/** Article for the founders' note: supplied headline, description and date; authors by name only. */
export function articleSchema(
  article: { headline: string; description: string; datePublished: Date; authors: string[] },
  path: string,
  site?: URL,
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished.toISOString().slice(0, 10),
    author: article.authors.map((name) => ({ '@type': 'Person', name })),
    publisher: { '@type': 'Organization', name: SITE.name, ...(site && { url: site.href }) },
    ...(site && { mainEntityOfPage: abs(path, site), image: abs('/og-default.png', site) }),
  };
}

/** BreadcrumbList requires absolute item URLs, so it is only emitted when SITE_URL is set. */
export function breadcrumbSchema(items: NavLink[], site?: URL): JsonLd | undefined {
  if (!site || items.length < 2) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: abs(item.href, site),
    })),
  };
}
