export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details: any;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details || {};
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(message: string = 'Bad Request', details?: any) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(resource: string = 'Resource') {
    return new ApiError(404, 'NOT_FOUND', `${resource} not found`);
  }

  static conflict(message: string = 'Resource already exists') {
    return new ApiError(409, 'CONFLICT', message);
  }

  static unprocessableEntity(
    message: string = 'Validation Error',
    details?: any,
  ) {
    return new ApiError(422, 'VALIDATION_ERROR', message, details);
  }

  static internal(message: string = 'Internal Server Error') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}
