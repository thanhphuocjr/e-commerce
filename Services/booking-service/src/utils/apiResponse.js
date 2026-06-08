export const success = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({
    success: true,
    message,
    data,
  });

export const created = (res, data, message = 'Created') =>
  success(res, data, message, 201);

