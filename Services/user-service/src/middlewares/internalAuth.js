import { env } from '../config/environment.js';

export const headerAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const email = req.headers['x-user-email'];
  const role = req.headers['x-user-role'];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized header ',
    });
  }

  req.user = {
    id: userId,
    email,
    role,
  };
  next();
};

export const internalAuth = (req, res, next) => {
  console.log('[internalAuth] headers:', req.headers);

  const token = req.headers['x-internal-token'];

  if (!token) {
    console.log('[internalAuth] ❌ Missing internal token');
    return res.status(401).json({ message: 'Missing internal token' });
  }

  if (token !== process.env.INTERNAL_SERVICE_TOKEN) {
    console.log('[internalAuth] ❌ Invalid internal token');
    return res.status(403).json({ message: 'Invalid internal token' });
  }

  console.log('[internalAuth] ✅ Passed');
  next();
};
