export const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`[Payment Error] ${status}: ${message}`, error);

  res.status(status).json({
    success: false,
    message,
  });
};

