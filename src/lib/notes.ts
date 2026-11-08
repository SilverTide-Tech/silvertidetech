/**
 * Helpers for founder-supplied notes (src/content/notes). Kept free of `astro:content`
 * so the rules can be unit-tested.
 */

/** Plain text of a Markdown passage: links, emphasis, headings and quote markers removed; quotes straightened. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>)\s?/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The preview may only quote words the full note contains, so the excerpt must appear in the body verbatim. */
export function excerptAppearsInBody(excerpt: string, body: string): boolean {
  const quote = plainText(excerpt);
  return quote.length > 0 && plainText(body).includes(quote);
}

/** "A, B and C" (en-GB list style, no serial comma). */
export function listNames(names: string[]): string {
  return new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }).format(names);
}
