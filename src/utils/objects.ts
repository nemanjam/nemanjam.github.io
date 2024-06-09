export const filterUndefined = <T extends Record<string, any>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([key, value]) => value !== undefined)) as T;
