export const internalAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const email = req.headers['x-user-email'];
  const role = req.headers['x-user-role'];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized (missing user information)!',
    });
  }

  req.user = {
    id: userId,
    email,
    role,
  };
  next()
};
