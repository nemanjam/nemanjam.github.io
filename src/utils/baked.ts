// must be imported by relative path, loaded in astro.config.ts subtree

export const baked = (name: string): string => `BAKED_${name}`;

export const isBaked = (name: string, value: unknown): boolean => value === baked(name);
