// Canonical origins for the two subdomains served from this one codebase.
// One Astro build emits everything; the edge (Traefik) host-routes:
//   apps.digitalgrease.dev/*  -> dist/*          (home = apps index)
//   blog.digitalgrease.dev/   -> dist/posts.html (home = blog index), /* passthrough
// Because both hosts expose the same dist, each section must declare its OWN
// canonical so the duplicate path (e.g. apps.../posts/x) doesn't split SEO.
export const APPS_ORIGIN = 'https://apps.digitalgrease.dev';
export const BLOG_ORIGIN = 'https://blog.digitalgrease.dev';
