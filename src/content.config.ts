import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const apps = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    status: z.enum(['shipping', 'pre-release', 'beta', 'alpha']),
    platforms: z.array(z.enum(['android', 'ios'])),
    license: z.string(),
    repo: z.string().url(),
    privacy: z.string().url().optional(),
    accent: z.string().optional(),
    icon: z.string().optional(),
    downloads: z
      .object({
        github: z.string().url().optional(),
        play: z.string().url().optional(),
        fdroid: z.string().url().optional(),
        izzy: z.string().url().optional(),
      })
      .partial()
      .default({}),
    screenshots: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
        }),
      )
      .default([]),
    order: z.number().default(0),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    kind: z.enum(['research', 'tool']),
    repo: z.string().url(),
    stack: z.array(z.string()).default([]),
    license: z.string(),
    status: z.enum(['active', 'spike', 'archived']).default('active'),
    accent: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Blog posts. The Digital/Analog dichotomy is the sacred top-level axis, so it
// is a single required enum rather than a free-form tag. `app`/`project` link a
// post to an entry in the sibling collections, which is what makes the merged
// write-up <-> app <-> repo graph possible.
const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Digital', 'Analog']),
    tags: z.array(z.string()).default([]),
    authors: z.array(z.string()).default(['digitalgrease']),
    draft: z.boolean().default(false),
    comments: z.boolean().default(true),
    app: z.string().optional(),
    project: z.string().optional(),
    series: z.string().optional(),
    seriesPart: z.number().optional(),
  }),
});

export const collections = { apps, projects, posts };
