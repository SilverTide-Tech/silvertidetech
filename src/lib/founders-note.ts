/**
 * The joint note from the Founders & Directors. Every word is founder-supplied: while the entry is a
 * draft this returns nothing, so no preview renders and /leadership/founders-note is not built.
 */
import { getEntries, getEntry, type CollectionEntry } from 'astro:content';
import { excerptAppearsInBody } from './notes';

export const FOUNDERS_NOTE_ID = 'founders-note';
export const FOUNDERS_NOTE_PATH = `/leadership/${FOUNDERS_NOTE_ID}`;

export interface FoundersNote {
  entry: CollectionEntry<'notes'>;
  title: string;
  excerpt: string;
  description: string;
  published: Date;
  authors: CollectionEntry<'people'>[];
}

export async function getFoundersNote(): Promise<FoundersNote | undefined> {
  const entry = await getEntry('notes', FOUNDERS_NOTE_ID);
  if (!entry || entry.data.draft) return undefined;
  const { title, excerpt, description, published } = entry.data;
  // The schema guarantees these once `draft` is false; the check narrows the types.
  if (!title || !excerpt || !published) return undefined;
  const body = entry.body ?? '';
  if (!body.trim()) throw new Error(`notes/${FOUNDERS_NOTE_ID}: a published note needs its full text below the frontmatter.`);
  if (!excerptAppearsInBody(excerpt, body)) {
    throw new Error(`notes/${FOUNDERS_NOTE_ID}: the excerpt must appear word for word in the note.`);
  }
  const authors = (await getEntries(entry.data.authors)).sort((a, b) => a.data.order - b.data.order);
  return { entry, title, excerpt, description: description ?? excerpt, published, authors };
}
