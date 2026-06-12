import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// One build emits both subdomains. Astro.site is the apps origin; blog routes are
// served at blog.digitalgrease.dev, so rewrite their sitemap entries to that host
// and drop non-indexable routes (error pages, OG image endpoints).
const isBlogPath = (p) =>
  p === '/blog-home' ||
  p === '/rss.xml' ||
  /^\/(posts|tags|category|about|search)(\/|$)/.test(p);

export default defineConfig({
  site: 'https://apps.digitalgrease.dev',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const p = new URL(page).pathname;
        return !/^\/(404|blog-404|og\/)/.test(p);
      },
      serialize: (item) => {
        const u = new URL(item.url);
        if (!isBlogPath(u.pathname)) return item;
        u.host = 'blog.digitalgrease.dev';
        if (u.pathname === '/blog-home') u.pathname = '/'; // landing served at root
        return { ...item, url: u.toString() };
      },
    }),
  ],
  build: {
    format: 'file',
  },
});
