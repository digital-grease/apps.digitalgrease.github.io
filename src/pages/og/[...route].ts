// Build-time OG social cards — one forge-themed PNG per post into dist/og/<slug>.png.
// Title/description come from frontmatter only (not the body). Referenced by
// PostLayout as og:image = BLOG_ORIGIN + /og/<slug>.png.
import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
const pages = {
  ...Object.fromEntries(posts.map((post) => [post.id, post])),
  // Branded default card for listing/utility pages (home, archive, tags, search).
  site: { data: { title: 'The Forge', description: 'digitalgrease. Making, breaking, learning, fixing.' } },
};

// OGImageRoute is async in astro-og-canvas 0.11.1 — must be awaited.
export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.data.title,
    description: page.data.description ?? '',
    // forge palette: near-black soot → warm dark; cyan inline-start bar.
    bgGradient: [
      [10, 8, 6],
      [26, 14, 8],
    ],
    border: { color: [0, 204, 204], width: 14, side: 'inline-start' },
    padding: 70,
    font: {
      title: {
        families: ['Share Tech Mono'],
        weight: 'Normal',
        size: 58,
        color: [233, 221, 207],
        lineHeight: 1.15,
      },
      description: {
        families: ['Share Tech Mono'],
        weight: 'Normal',
        size: 28,
        color: [255, 102, 0],
        lineHeight: 1.45,
      },
    },
    fonts: ['./public/fonts/ShareTechMono-Regular.ttf'],
  }),
});
