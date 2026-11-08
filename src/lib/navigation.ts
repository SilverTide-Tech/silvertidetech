/**
 * Navigation generated from content (architecture §2): a new business or product
 * appears in menus and the footer automatically, with its status.
 */
import { getCollection } from 'astro:content';
import { compareByStatusThenOrder, type Status } from './status';

export interface NavEntry {
  name: string;
  href: string;
  description?: string;
  status?: Status;
}

export interface NavGroup {
  label: string;
  href: string;
  allLabel: string;
  items: NavEntry[];
}

export interface Navigation {
  businesses: NavGroup;
  products: NavGroup;
}

export async function getNavigation(): Promise<Navigation> {
  const [businesses, products] = await Promise.all([getCollection('businesses'), getCollection('products')]);

  const businessItems = businesses
    .map((b) => ({
      name: b.data.navName ?? b.data.name,
      href: `/businesses/${b.id}`,
      description: b.data.purpose,
      status: b.data.status === 'active' ? undefined : b.data.status,
      order: b.data.order,
    }))
    .sort(compareByStatusThenOrder);

  const productItems = products
    .map((p) => ({
      name: p.data.name,
      href: `/products/${p.id}`,
      description: p.data.category,
      status: p.data.status,
      order: p.data.order,
    }))
    .sort(compareByStatusThenOrder);

  const strip = ({ order: _order, ...entry }: NavEntry & { order: number }): NavEntry => entry;

  return {
    businesses: {
      label: 'Businesses',
      href: '/businesses',
      allLabel: 'All businesses',
      items: businessItems.map(strip),
    },
    products: {
      label: 'Products',
      href: '/products',
      allLabel: 'All products',
      items: productItems.map(strip),
    },
  };
}
