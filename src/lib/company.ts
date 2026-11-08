/**
 * Approved company copy, quoted from docs/strategy/company-vision.md.
 * Edit the source document first; keep this module in sync with it.
 */

/** §3.1 What Silver Tide Tech is. */
export const IDENTITY_POINTS = [
  {
    title: 'Product-led',
    text: 'We build and operate our own products and platforms.',
  },
  {
    title: 'Technology and innovation',
    text: 'Products, digital platforms and solutions for real-world problems, across more than one industry over time.',
  },
  {
    title: 'A parent brand',
    text: 'Businesses, products and ventures sit under Silver Tide Tech and share its standards.',
  },
] as const;

/** §7.1 Messaging pillars (message column). */
export const PILLARS = [
  { title: 'Product-led', text: 'We build and run our own technology products.' },
  { title: 'People-first technology', text: 'Technology should empower people and simplify their work.' },
  { title: 'Practical innovation', text: 'Innovation that is accessible, practical and impactful.' },
  {
    title: 'Built for the long term',
    text: 'A parent company designed to grow into new products, businesses and industries.',
  },
] as const;

/** §8 Long-term direction. No dates are published until the founders set them. */
export const HORIZONS = [
  {
    label: 'Now',
    text: 'Establish Silver Tide Tech as a credible technology and innovation company, and grow SarasTech.',
  },
  {
    label: 'Next',
    text: 'Expand the education ecosystem with a student platform, and prepare the technology and consulting services vertical.',
  },
  {
    label: 'Later',
    text: 'Human-led online learning and physical learning centres, and additional products, businesses and industry verticals.',
  },
] as const;

/** §5.2 Long-term education ambition. */
export const EDUCATION_AMBITION =
  'Connect AI technology, human teachers, personalised mentorship and physical learning into one integrated education ecosystem.';

/** §5.4 Future ventures: intent only, nothing announced. */
export const FUTURE_VENTURES =
  'Silver Tide Tech may add products, businesses and industry verticals over time. Nothing is announced yet. When something is ready, it will appear here with a clear status.';

/** Contact topics (architecture §6.3). */
export const CONTACT_TOPICS = [
  { value: 'general', label: 'General' },
  { value: 'sarastech', label: 'SarasTech' },
  { value: 'technology-services', label: 'Technology Services' },
  { value: 'careers', label: 'Careers' },
  { value: 'media', label: 'Media' },
] as const;
