export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PLANS: '/plans',
  SUMMARY: '/summary',
} as const;

export const NAVIGATION_PATHS = {
  BACK_TO_LOGIN: APP_ROUTES.LOGIN,
  CONTINUE_TO_SUMMARY: APP_ROUTES.SUMMARY,
} as const;
