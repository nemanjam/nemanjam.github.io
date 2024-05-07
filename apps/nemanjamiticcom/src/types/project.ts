import { projectSchema } from '@/schemas/project';

import type { CollectionEntry, z } from 'astro:content';

export type Project = z.infer<ReturnType<typeof projectSchema>>;

export type ProjectCollection = CollectionEntry<'project'>;
