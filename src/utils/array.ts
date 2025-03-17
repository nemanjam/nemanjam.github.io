export const getRandomElementFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const sliceToMod4 = <T>(arr: T[]): T[] => arr.slice(0, arr.length - (arr.length % 4));
