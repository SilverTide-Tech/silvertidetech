/**
 * Business card data derived from content (used on Home §2 and /businesses).
 * Active verticals list their roadmap; planned verticals list their services.
 */
import { getCollection } from 'astro:content';
import { STATUS_META, compareByStatusThenOrder, type Status } from './status';

export interface BusinessCardData {
  name: string;
  href: string;
  eyebrow: string;
  purpose: string;
  status?: Status;
  summary?: string;
  offerings: Array<{ name: string; status?: Status }>;
  linkLabel: string;
  icon: 'education' | 'code';
  order: number;
}

export async function getBusinessCards(options: { homeOnly?: boolean } = {}): Promise<BusinessCardData[]> {
  const [businesses, products, services, roadmap] = await Promise.all([
    getCollection('businesses', ({ data }) => !options.homeOnly || data.showOnHome),
    getCollection('products'),
    getCollection('services'),
    getCollection('roadmap'),
  ]);

  return businesses
    .map((b) => {
      const status = b.data.status === 'active' ? undefined : b.data.status;
      const available = products.filter((p) => p.data.business.id === b.id && p.data.status === 'available-now').length;
      const phases = roadmap.filter((r) => r.data.business.id === b.id).sort((x, y) => x.data.phase - y.data.phase);
      const offerings = phases.length
        ? phases.map((r) => ({ name: r.data.title, status: r.data.status }))
        : services
            .filter((s) => s.data.business.id === b.id)
            .map((s) => ({ name: s.data.name, status: s.data.status, order: s.data.order }))
            .sort(compareByStatusThenOrder)
            .map(({ name, status: s }) => ({ name, status: s }));

      return {
        name: b.data.name,
        href: `/businesses/${b.id}`,
        eyebrow: status ? 'Business · Planned vertical' : b.data.order === 1 ? 'Business · First major vertical' : 'Business',
        purpose: b.data.purpose,
        status,
        summary: !status && available ? `${available} product${available > 1 ? 's' : ''} · ${STATUS_META['available-now'].label}` : undefined,
        offerings,
        linkLabel: status ? 'About this planned vertical' : `Explore ${b.data.name}`,
        icon: (b.id === 'education' ? 'education' : 'code') as BusinessCardData['icon'],
        order: b.data.order,
      };
    })
    .sort(compareByStatusThenOrder);
}
