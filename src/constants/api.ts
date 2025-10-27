export const API_CONFIG = {
  BASE_URL: 'https://rimac-front-end-challenge.netlify.app/api',
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  USER: '/user.json',
  PLANS: '/plans.json',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  USER_FETCH_ERROR: 'Error al obtener los datos del usuario',
  PLANS_FETCH_ERROR: 'Error al obtener los planes',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado',
} as const;
