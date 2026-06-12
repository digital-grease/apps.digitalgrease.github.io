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

/** Tag -> count across published posts. */
export async function getTagCounts(): Promise<Map<string, number>> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
}

/** Posts per category, for honest axis labels (e.g. "Analog · 1"). */
export async function getCategoryCounts(): Promise<Record<'Digital' | 'Analog', number>> {
  const posts = await getPublishedPosts();
  return {
    Digital: posts.filter((p) => p.data.category === 'Digital').length,
    Analog: posts.filter((p) => p.data.category === 'Analog').length,
  };
}

/** Home feed: newest N, but guarantee at least one post from each non-empty pole
 *  so the Digital/Analog promise is actually proven on the landing page. */
export async function getHomeFeed(n = 4): Promise<Post[]> {
  const posts = await getPublishedPosts(); // newest first
  const feed = posts.slice(0, n);
  for (const cat of ['Digital', 'Analog'] as const) {
    const hasCat = feed.some((p) => p.data.category === cat);
    const newestOfCat = posts.find((p) => p.data.category === cat);
    if (!hasCat && newestOfCat) feed[feed.length - 1] = newestOfCat; // swap the missing pole in
  }
  return feed;
}

/** Related posts by shared tags (weighted) + same category, excluding self and
 *  same-series siblings (SeriesNav already shows those). */
export async function getRelated(entry: Post, n = 3): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const tags = new Set(entry.data.tags);
  return posts
    .filter((p) => p.id !== entry.id)
    .filter((p) => !(entry.data.series && p.data.series === entry.data.series))
    .map((p) => ({
      p,
      score: p.data.tags.filter((t) => tags.has(t)).length * 2 + (p.data.category === entry.data.category ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, n)
    .map((x) => x.p);
}

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = DATE_OPTS): string {
  return date.toLocaleDateString('en-US', opts);
}
