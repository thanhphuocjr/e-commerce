export class ApiError extends Error {
  constructor(status, message, error = null) {
    super(message);
    this.status = status;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
