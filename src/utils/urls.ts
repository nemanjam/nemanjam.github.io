/** Include :port */
export const getHostnameFromUrl = (url: string): string => new URL(url).host;
