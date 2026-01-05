import { HTTP_STATUS_CODES } from '../constants/httpStatus.js';

export const errorHandler = (error, req, res, next) => {
  const status = error.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  console.error(`[Error] ${status}: ${message}`, error);

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'dev' && { error: error.error }),
  });
  next();
};
