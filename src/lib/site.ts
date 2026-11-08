/**
 * Site-wide constants. Wording comes verbatim from docs/strategy/company-vision.md.
 * Do not add contact details, social links or legal entity names here until the founders supply them.
 */
export const SITE = {
  name: 'Silver Tide Tech',
  identity: 'Technology & Innovation Company',
  tagline: 'Building Technology. Empowering People.',
  description:
    'Silver Tide Tech is a product-led technology and innovation company that builds technology products, digital platforms and solutions to solve real-world problems.',
  locale: 'en',
} as const;

/** Fixed wording: use verbatim (company-vision §2). */
export const STATEMENTS = [
  { label: 'Vision', text: 'To create technology that makes people’s lives, work and opportunities better.' },
  {
    label: 'Mission',
    text: 'To build meaningful technology products and solutions that empower people, simplify work and create long-term value.',
  },
  {
    label: 'Purpose',
    text: 'To bring innovation closer to people through accessible, practical and impactful technology.',
  },
] as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation items that are not generated from content (architecture §2.1). */
export const PRIMARY_LINKS = {
  home: { label: 'Home', href: '/' },
  about: { label: 'About', href: '/about' },
  leadership: { label: 'Leadership', href: '/leadership' },
  careers: { label: 'Careers', href: '/careers' },
  contact: { label: 'Contact', href: '/contact' },
} satisfies Record<string, NavLink>;

/** Footer "Company" column (architecture §2.2). */
export const COMPANY_LINKS: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Vision & Roadmap', href: '/vision' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Careers', href: '/careers' },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

/** True when `href` is the current page or one of its children ("/" only matches itself). */
export function isCurrentPath(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}
