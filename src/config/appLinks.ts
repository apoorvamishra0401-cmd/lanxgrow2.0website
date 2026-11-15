/** LanXgrow learning app entry points. Override with VITE_APP_URL for previews. */
export const APP_URL = String(import.meta.env.VITE_APP_URL ?? 'https://app.lanxgrow.com').replace(/\/$/, '');
export const APP_INTERVIEW_URL = `${APP_URL}/interview`;
export const APP_LOGIN_URL = `${APP_URL}/login`;
export const APP_SIGNUP_URL = `${APP_URL}/entry`;
