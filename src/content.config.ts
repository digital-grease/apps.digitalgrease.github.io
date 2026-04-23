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
    downloads: z
      .object({
        github: z.string().url().optional(),
        play: z.string().url().optional(),
        fdroid: z.string().url().optional(),
        izzy: z.string().url().optional(),
      })
      .partial()
      .default({}),
    order: z.number().default(0),
  }),
});

export const collections = { apps };
