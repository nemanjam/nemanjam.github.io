import type { CollectionEntry, z } from 'astro:content';
import type { projectSchema } from '../schemas/project';

export type Project = z.infer<ReturnType<typeof projectSchema>>;

export type ProjectCollection = CollectionEntry<'project'>;
