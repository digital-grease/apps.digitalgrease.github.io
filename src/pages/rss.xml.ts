import rss from '@astrojs/rss';
import { getPublishedPosts } from '../lib/posts';
import { BLOG_ORIGIN } from '../lib/site';

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: 'The Forge — digitalgrease',
    description: 'Making, Breaking, Learning, Fixing.',
    // Feed lives on the blog subdomain, so its links must use the blog origin.
    site: BLOG_ORIGIN,
    // atom:self link for feed-discovery best practice. Item links keep their
    // trailing slash so guids stay stable for existing subscribers (they match
    // the old mkdocs feed); the Caddy slash-strip 301 handles the resolution.
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<atom:link href="${BLOG_ORIGIN}/rss.xml" rel="self" type="application/rss+xml"/>`,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/posts/${p.id}`,
      categories: [p.data.category, ...p.data.tags],
    })),
  });
}
