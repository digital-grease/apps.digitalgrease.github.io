# Blog → Astro migration plan

Consolidate `blog.digitalgrease.github.io` (mkdocs/properdocs, Python) into this
Astro 5 repo, served as two subdomains from one codebase:

- **apps.digitalgrease.dev** — apps + projects, lean `tokens.css` look (unchanged).
- **blog.digitalgrease.dev** — the blog, full **forge** theme.

Status legend: `[x]` done in the spike · `[ ]` to do · `[!]` blocked / needs you.

---

## 0. Decisions — confirmed 2026-06-12

**Locked:** 1 keep repo · 2 **C** (blog home at `/` via edge rewrite, `/posts` = archive)
· 3 dark-only now, **full a11y sweep later** · 4 self-host fonts · 5 generate OG cards
· 6 confirmed (drop projects/digital/analog, keep `about`, promote Digital/Analog) ·
7 private source OK.

Original options retained below for reference (recommendation in **bold**).

1. **Repo identity** — keep this repo (`apps.digitalgrease.github.io`) as the unified
   site; it already holds apps, projects, and the blog spike. Repo name isn't
   user-visible. **Keep as-is now, rename to `digitalgrease-web` later if desired.**
2. **Serving model** — **one build; the edge (Caddy in `vps-edge`) serves `blog.*`
   from the same `/srv/apps` artifact** with a `/`→`/posts` redirect. Drops the
   separate `/srv/blog` docroot and the blog-repo pull. Preserves `/posts/{slug}` URLs
   and the Anubis posture (blog stays off the PoW wall). (Alt: two Astro builds →
   separate `/srv/apps` + `/srv/blog` artifacts, no Caddy change but build-target
   plumbing — not recommended, more build complexity for tidier docroots.)
3. **Light mode** — apps is dark-only; the old forge had `forge-light.css`.
   **Ship dark-only first**, add forge light parity post-cutover only if missed.
4. **Fonts** — **self-host Share Tech Mono + Inter** (privacy / no-telemetry ethos),
   replacing the Google Fonts `<link>` the spike currently uses.
5. **OG/social cards** — no post has a hero image today (mkdocs auto-generated them).
   **Generate per-post OG images at build** via `astro-og-canvas` (or satori),
   styled forge. (Alt: hand-make static cards. Not recommended.)
6. **Page mapping** — `projects.md`/`digital.md`/`analog.md` are superseded by this
   repo's `projects` collection + `/category/*` pages. **Drop them; keep `about` as
   `/about` on the blog, and the Digital/Analog intros become the category-page
   blurbs (already in the spike).**
7. **Source visibility** — the blog repo is **public**; consolidating into the
   **private** apps repo makes the blog *source* private (the rendered site stays
   public, pulled via the read-only PAT). **Confirm that's fine**, or make the unified
   repo public, or keep a public mirror. One-way door, so flagged.

---

## 1. Content (9 posts, 1 about page)

Frontmatter transform per post: add `title`, single `category` (Digital|Analog),
`tags`, `authors`, `date`, `comments`, optional `app`/`project` cross-link; strip the
leading `# H1` and `<!-- more -->`; fix internal links to `/posts/{slug}` (no trailing
slash); confirm no em-dashes (audit shows the portable set is already clean).

- [x] `fauxx-cant-stop-the-signal` (ported, forge-verified)
- [x] `fauxx-maintaining-the-signal` (ported)
- [x] `meridian-drift-audit-with-receipts` (project cross-link → Meridian)
- [x] `phosphor-and-static` (`cyberspace.jpg`; figure → HTML `<img>`)
- [x] `signal-to-soil` (Analog; `sheep_cedar` / `sunset0` / `Walipini` → `/img/`)
- [x] `smudge-stop-trying-to-survive-the-codec` (series part 2; project → Smudge)
- [x] `specter-hunting-ghosts-in-the-kv-cache` (series part 1; project → SPECTER)
- [x] `welcome-to-the-forge` (`comments:false` honored)
- [x] `tin-cans-and-strings` — **ported by you** (AUP-blocked for me); builds clean and is
  excluded from all my reads/audits. `project: eve`.
- [x] `about.md` → `/about` (blog), forge-styled, em-dashes cleaned, spider-lily motif
  ported (`/img/spiderlily.png` + `.forge-lily-*` CSS).

Audit result: **no post uses mermaid or admonitions** → no parser plugins needed.
Series: 2 posts. OG images: none today (generate).

## 2. Visual assets

- [x] `technoforge.jpg` → `public/forge/` (blog hero)
- [x] Referenced assets → `public/img/`: `cyberspace`, `sheep_cedar`, `sunset0`,
  `Walipini_hole_v2`, `spiderlily`, + self-hosted author avatar `digitalgrease.png`.
- [ ] Image optimization (`astro:assets` `<Image>`) — **deferred**; static `/img/` for now.
- [x] Self-host fonts via Fontsource (`@fontsource/inter` 400/600/700 + `share-tech-mono`
  400, imported in `BlogBaseLayout`); Google Fonts `<link>` removed; 22 woff2 shipped.
- [x] Per-post OG cards via `astro-og-canvas` (`src/pages/og/[...route].ts`, forge template,
  Share Tech Mono from `public/fonts/`); one `/og/{slug}.png`, `og:image` 1200×630.

## 3. Theme & feature parity

- [x] Forge theme 1:1: body gradient, floor glow, embers, scanlines/vignette/sweep,
  content panel, hero image, ☠/🔥 pills, glowing type, terminal code, brand tags,
  cyberpunk scrollbar, header glow (`forge.css` + `ForgeAtmosphere.astro`).
- [x] Per-section theming (`.forge` body class; CSS bundles per route, no bleed).
- [x] Reading time, giscus comments, RSS, sitemap.
- [x] **Series support** — `series` + `seriesPart` frontmatter; `SeriesNav.astro`
  derives the part list by querying the series. Wired into smudge + specter.
- [x] **Post→app / post→project cross-links** — `app`/`project` frontmatter render the
  live `AppCard`/`ProjectCard` (the write-up ↔ tool graph).
- [x] **Option C blog home** (`blog-home.astro`, served at `/` via edge rewrite):
  forge hero + Digital/Analog tiles + recent posts; `/posts` slimmed to archive.
- [x] **BlogNav** — Digital/Analog promoted to top-level nav (decision #6); apps↗ is an
  absolute cross-subdomain link. Apps keeps its own lean `Nav`.
- [x] **Newer/older post nav** at article foot — chronological prev/next via `getAdjacent`.
- [x] **404 pages** — `/404.html` (apps, tokens) + `/blog-404.html` (forge); blog host's
  Caddy `try_files` falls back to the forge one.
- [x] `/tags` index page (all tags + post counts). `/archive` by year still optional.
- [x] **Search** — Pagefind (`pagefind --site dist` in the build script) + forge-styled
  `/search` page on the JS API; `data-pagefind-body` scopes indexing to post bodies (9 indexed).
- [x] **Author block** — `.authors.yml` → `src/lib/authors.ts`; `AuthorBlock.astro` on posts.
- [ ] Light mode — **deferred** (dark-only for now per decision #3).

## 4. Routing & subdomain serving (real `vps-edge` model)

The edge is **Caddy** + **Anubis** (PoW wall on apex+apps, *not* blog) + **CrowdSec**,
on one VPS. Sites are stateless: CI publishes a tarball to each repo's rolling
`deploy` Release; the VPS `pull-sites.sh` pulls per-site into `/srv/{apex,apps,blog}`
and Caddy serves by Host with `try_files {path} {path}.html {path}/index.html /404.html`
— **which already matches Astro `build.format:'file'`** (apps uses it today).
`blog.digitalgrease.dev` already exists as a host + docroot, currently fed by the blog
(mkdocs) repo. Migration = point `blog.*` at the **apps** artifact and retire the blog
pull.

- [x] Per-section canonicals (`src/lib/site.ts`); blog pages canonicalize to the blog
  origin (incl. `/blog-home` → blog root via the `canonicalPath` prop).
- [x] `astro.config.mjs`: `site` apps origin, `trailingSlash:'never'`, `build.format:'file'`,
  sitemap `serialize`/`filter` → blog routes get the blog origin, og/404 excluded.
- [x] `src/pages/404.astro` (tokens, dist `/404.html`) + `src/pages/blog-404.astro` (forge).
- [x] **`vps-edge/caddy/files.Caddyfile`** — blog host repointed to `/srv/apps`; Option C
  landing rewrite (`/` → `/blog-home.html`) + full legacy redirect map via mutually-exclusive
  `handle` blocks (specific remaps BEFORE the generic trailing-slash strip — required by
  Caddy's directive ordering): `/digital[/]`→`/category/digital`, `/analog[/]`→`/category/analog`,
  `/projects[/]`→apps, `/feed_rss_*`+`/feed_json_*`→`/rss.xml`, `/sitemap.xml[.gz]`→`/sitemap-index.xml`,
  trailing-slash strip, forge-404 fallback. Header comment updated. (Edge `Caddyfile` blog
  block unchanged — still off Anubis, CrowdSec-only.)
- [x] **`vps-edge/pull/pull-sites.sh`** — `blog` entry removed (served from `/srv/apps`);
  old blog repo kept ONLY as the giscus comment store.
- [ ] Optional tidy: apps host `redir /posts* → blog.*` so blog paths don't sit behind the
  apps PoW wall (canonicals already dedupe SEO).
- [x] DNS: `blog.*` already points at the VPS — no DNS change; cutover = edge config swap.
- [x] **Old RSS feeds** → `/rss.xml` (301): `/feed_rss_created.xml`, `/feed_rss_updated.xml`,
  `/feed_json_*` in the Caddy block.
- [x] **giscus continuity** — `Comments.astro` is now `data-mapping="specific"` +
  `data-term="/posts/{slug}/"` (old slashed pathname) + `data-strict="1"`, matching existing
  discussion titles verbatim. `data-repo` unchanged (comments stay in the blog repo).

## 5. CI/CD

- [x] npm cooldown fixed (`.npmrc` `min-release-age=7`); verified it blocks none of the new
  deps (every stable release is months old).
- [x] `deploy.yml` build step now `npm run build` (= `astro build && pagefind --site dist`);
  OG cards come from astro build itself; tar still `-C dist` (ships `/pagefind` + `/og`).
  `npm ci` installs the `pagefind` devDep so its binary is on PATH in CI.
- [x] New deps added: `pagefind` (dev), `astro-og-canvas`, `@fontsource/inter`,
  `@fontsource/share-tech-mono` (+ `@astrojs/rss` earlier). Cooldown is a non-issue.
- [ ] Optional: build smoke check + link checker (`lychee`) in CI.
- [x] Publish model unchanged (one `site.tar.gz` → rolling `deploy` release).
- [x] `vps-edge` edits staged (`files.Caddyfile`, `pull-sites.sh`) — **separate commit in the
  vps-edge repo**, applied on the VPS (`docker compose restart caddy`; puller picks up the
  script change). Sequence: ship the apps artifact with blog content FIRST, then flip the edge.
- [ ] Retire the blog repo: stop its mkdocs CI + delete its `deploy` release. **Do NOT
  disable its Discussions** — giscus comments live there. Archive (don't delete) after cutover.

## 6. Cutover runbook & gates

Adversarial audit done 2026-06-12 (6 dimensions: theme, SEO, links, giscus, a11y,
build/Caddy). **No blockers.** Fixes applied this session: legacy redirects
(`/tags/prose`, `/posts/category/*`, `/posts/archive/*`), **real-404 status** via Caddy
`handle_errors` (was a soft-404 200), search `<mark>` AA contrast + focus ring,
smudge wrong-repo link (`mflowers`→`digital-grease`), robots blog sitemap, RSS
`atom:self`, listing-page OG cards (`/og/site.png`), default mobile padding,
descriptive cyberspace alt, stale `.astro` cache cleared.
- [x] **a11y** (committed deliverable): forge palette computes AA-safe — body ~10:1,
  cyan ~10:1, orange ~6.5:1, ☠/🔥 pills ~9:1; reduced-motion fully suppresses
  embers/scanlines/sweep; skip link + single h1/page + focus indicators all good. The
  only computed fails (search `<mark>` 4.04:1, search focus outline) are fixed.

**Cutover sequence (yours — I don't run git/deploy):**
1. Commit + push the **apps repo** → CI `npm run build` → tarball → rolling `deploy`
   release; VPS pulls into `/srv/apps` (~1 min). Verify the artifact has `/pagefind`,
   `/og/*.png`, blog routes.
2. Commit the **vps-edge** repo (`files.Caddyfile`, `pull-sites.sh`). **`caddy validate`
   first** (`docker compose exec caddy caddy validate --config /etc/caddy/files.Caddyfile
   --adapter caddyfile`). Apply: `docker compose restart caddy`; puller picks up the
   script change. Old blog stays live on `/srv/blog` until this flip — zero downtime.
3. Smoke-test `blog.digitalgrease.dev`: `/` (landing), a post, `/posts`, `/tags`,
   `/category/digital`, `/search`, `/rss.xml`, a real 404 (must be **HTTP 404**, forge),
   and legacy redirects (`/posts/foo/`→`/posts/foo`, `/digital/`→`/category/digital`,
   `/feed_rss_created.xml`→`/rss.xml`). Confirm a giscus thread loads on an existing post.
4. Retire the old blog repo: stop its CI, delete its `deploy` release, drop `/srv/blog`.

**GATES — do NOT skip:**
- 🔴 **giscus / blog-repo archive** — comments live in
  `digital-grease/blog.digitalgrease.github.io` Discussions. If you archive that repo,
  **Discussions must stay ENABLED** or every thread dies. Test a giscus load before AND
  after archiving. Safest: leave it un-archived, or archive only after confirming.
- DNS: `blog.*` already points at the VPS — no DNS change.

**Optional (audit-flagged, your call):**
- `npm audit fix` clears the one HIGH (`devalue`, transitive via astro) — build-time-only
  on a static site, non-urgent; astro/mdx advisories need astro 6 (defer).
- Apps-host tidy: redirect `/posts* /category* /tags* /about /search /rss.xml` on `apps.*`
  → blog host, so blog content isn't dual-served behind the apps PoW wall.
- Apex/apps share the soft-404 `(serve)` snippet — apply the same `handle_errors` pattern
  there for real site-wide 404s.
- Remove the inert `public/CNAME` (GitHub-Pages leftover; harmless).

## 7. Post-migration (optional)

- Interactive islands (e.g. a Fauxx KL-divergence demo) — now cheap on Astro.
- Light-mode forge, `/archive`, analytics (privacy-respecting), the apps↔posts graph.

---

## Risks / watch-items

- **tin-cans post** — AUP-blocked for me; you own that one file. Everything else I can do.
- **URL + RSS + comments continuity** — Caddy redirects must be in place at cutover or
  links, feeds, and giscus threads break. Validate before flipping `files.Caddyfile`.
  No DNS flip needed (blog.* already points at the VPS), so cutover = edge config swap.
- **Source visibility** — moving blog source into the private apps repo is a one-way
  door (decision #7); settle before porting content in bulk.
- **Dependency cooldown** — adding pagefind/og/sharp triggers the 7-day wait; stage early.
- **Fidelity** — forge look is a faithful reproduction on Astro's DOM, not byte-identical.

## Rough sequencing

1. Confirm §0 decisions.
2. Port remaining content + assets + series/author/post-nav (§1–3) — bulk of the work.
3. Search, OG images, self-hosted fonts, 404 (§2–3 tail).
4. Add CI deps early (cooldown), wire `deploy.yml` (§5).
5. Edge rules + redirects + DNS, validate, cutover, decommission (§4, §6).

Spike already covers schema, routing, the forge theme, canonicals, and 2 posts —
roughly the architecture + look. Remaining is mostly content port + the parity tail
(search, OG, series, post-nav, fonts) + the edge/redirect cutover.
