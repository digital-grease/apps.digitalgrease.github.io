import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://apps.digitalgrease.net',
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  build: {
    format: 'file',
  },
});
