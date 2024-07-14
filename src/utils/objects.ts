// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterUndefined11 = <T extends Record<string, any>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined)) as T;
