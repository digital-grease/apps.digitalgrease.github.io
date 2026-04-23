# apps.digitalgrease.github.io

Source for **[apps.digitalgrease.dev](https://apps.digitalgrease.dev)** — the
showcase site for the Digital Grease app portfolio
(Fauxx, Obscura, Effigy, Signet).

Sibling sites: [digitalgrease.dev](https://digitalgrease.dev) (personal homepage),
[blog.digitalgrease.dev](https://blog.digitalgrease.dev) (blog).

## Stack

- [Astro](https://astro.build) static site generator (Node 22)
- Markdown content collection driving per-app pages
- Deployed to GitHub Pages via GitHub Actions

## Develop

```sh
nvm use             # Node 22 from .nvmrc
npm install
npm run dev         # http://localhost:4321
npm run build       # emits dist/
npm run preview     # serve dist/ locally
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. The `public/CNAME` file pins the
custom domain.

### One-time setup (manual, outside this repo)

These two steps are required before `https://apps.digitalgrease.dev`
resolves. The GitHub Actions deploy will succeed regardless — the domain
just won't point at it until both are done.

1. **DNS** — at the `digitalgrease.dev` registrar, add:

   ```
   Type:  CNAME
   Name:  apps
   Value: digitalgrease.github.io
   TTL:   default
   ```

   Allow up to an hour for propagation.

2. **Repo Pages settings** — GitHub repo → Settings → Pages:
   - Source: **GitHub Actions**
   - Once the first deploy lands, the Custom Domain field auto-fills from
     the `CNAME` file; verify it and tick **Enforce HTTPS** once the
     certificate provisions.

After both are done, every push to `main` republishes the site.

## Plan

Planning notes live in [`.devloop/plan.md`](.devloop/plan.md); the
exploratory spike that preceded the plan is in
[`.devloop/spikes/apps-showcase-site.md`](.devloop/spikes/apps-showcase-site.md).
