export const getHostnameFromUrl = (url: string): string => new URL(url).hostname;

// remove this one, both have same purpose
export const trimHttpProtocol = (url: string) => {
  const trailingSlashRegex = /\/$/;
  const protocolRegex = /^(https?:\/\/)/i;

  const withoutSlash = url.replace(trailingSlashRegex, '');
  const withoutProtocol = withoutSlash.replace(protocolRegex, '');

  return withoutProtocol;
};
