export const filterUndefined = <T extends Record<string, any>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined)) as T;
