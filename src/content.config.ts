import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const apps = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    status: z.enum(['shipping', 'pre-release', 'alpha']),
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

export const collections = { apps, projects };
