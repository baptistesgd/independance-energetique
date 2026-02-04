import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    modifiedDate: z.string().optional(),
    author: z.object({
      name: z.string(),
      id: z.string(),
    }),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    category: z.enum([
      'solaire',
      'stockage',
      'mobilite-electrique',
      'eolien',
      'aides-financieres',
      'conseils',
    ]),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    readingTime: z.number(),
  }),
});

export const collections = {
  blog: blogCollection,
};
