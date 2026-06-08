export const errorHandler = (error, req, res, next) => {
  const status = error.status || error.response?.status || 500;
  const message =
    error.response?.data?.message || error.message || 'Internal Server Error';

  console.error(`[Booking Error] ${status}: ${message}`, error);

  res.status(status).json({
    success: false,
    message,
  });
};

