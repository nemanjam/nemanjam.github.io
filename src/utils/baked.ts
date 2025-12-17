// must be imported by relative path, loaded in astro.config.ts subtree

/** const literal return type */
export const baked = <T extends string>(name: T): `BAKED_${T}` => `BAKED_${name}` as `BAKED_${T}`;

export const isBaked = (name: string, value: unknown): boolean => value === baked(name);
