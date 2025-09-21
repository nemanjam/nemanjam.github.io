/**
 * Dockerfile build args and Github Actions env vars.
 * Used only in production build at runtime.
 */
window.__ENV__ = {
  SITE_URL: '$SITE_URL',
  PLAUSIBLE_SCRIPT_URL: '$PLAUSIBLE_SCRIPT_URL',
  PLAUSIBLE_DOMAIN: '$PLAUSIBLE_DOMAIN',
};
