// must be imported by relative path, loaded in astro.config.ts subtree

/*------------------ For non-url vars -----------------*/

/** Const literal return type. Used in Zod schemas and Astro enum. */
export const baked = <T extends string>(name: T): `BAKED_${T}` => `BAKED_${name}` as `BAKED_${T}`;

// unused
export const isBaked = (name: string, value: unknown): boolean => value === baked(name);

/*------------------ For url vars -----------------*/

// unused
export const bakedUrl = <T extends string>(name: T): `https://BAKED_${T}` =>
  `https://BAKED_${name}` as `https://BAKED_${T}`;

// unused
export const isBakedUrl = (name: string, value: unknown): boolean => value === bakedUrl(name);
