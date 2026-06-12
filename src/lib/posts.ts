import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

const WORDS_PER_MINUTE = 200;

/** Rough reading time in minutes, derived from the raw markdown body. */
export function readingTime(entry: Post): number {
  const words = entry.body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Published posts, newest first. Drafts are hidden in production builds only. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Unique tags across all published posts, alphabetical. */
export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return [...new Set(posts.flatMap((p) => p.data.tags))].sort();
}

/** Chronological neighbors of a post (newer = more recent, older = less recent). */
export async function getAdjacent(entry: Post): Promise<{ newer?: Post; older?: Post }> {
  const posts = await getPublishedPosts(); // newest first
  const i = posts.findIndex((p) => p.id === entry.id);
  if (i === -1) return {};
  return { newer: posts[i - 1], older: posts[i + 1] };
}

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = DATE_OPTS): string {
  return date.toLocaleDateString('en-US', opts);
}
