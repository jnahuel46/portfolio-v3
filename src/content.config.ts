import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
// Astro 7 deprecates re-exporting `z`; import it from zod directly.
import { z } from 'zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		inProgress: z.boolean(),
		title: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
		link: z.string(),
		img_alt: z.string().optional(),
		goToRepo: z.string(),
	}),
});

export const collections = { projects };
