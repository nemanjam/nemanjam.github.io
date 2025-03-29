export const getRandomElementFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const sliceToModN = <T>(arr: T[], modN: number): T[] =>
  arr.slice(0, arr.length - (arr.length % modN));

/** returns tuple, must map to object with named keys */
export const mergeArrays = <T extends unknown[]>(...arrays: T[]): T[number][][] =>
  arrays[0].map((_, index) => arrays.map((arr) => arr[index]));
