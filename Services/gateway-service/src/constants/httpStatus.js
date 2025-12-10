export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  INVALID_REQUEST: 'Invalid request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  SERVICE_ERROR: 'Service error',
  GATEWAY_TIMEOUT: 'Gateway timeout',
  BAD_GATEWAY: 'Bad gateway',
};

export const SUCCESS_MESSAGES = {
  REQUEST_SUCCESS: 'Request successful',
  DATA_RETRIEVED: 'Data retrieved successfully',
};
