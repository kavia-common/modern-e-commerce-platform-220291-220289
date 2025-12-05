/**
 * PUBLIC_INTERFACE
 * Reads environment variables for the frontend.
 */
export function getEnv() {
  /** Returns typed env values for the frontend */
  const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';
  const theme = process.env.REACT_APP_THEME || 'royal-purple';
  return {
    apiBase,
    theme,
  };
}
