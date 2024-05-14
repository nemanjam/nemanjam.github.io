export const getRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomLengthSubstring = (inputString: string, length: number, margin = 0) =>
  inputString.substring(0, length + getRandomInt(margin));
