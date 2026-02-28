import config from '../config/environment.js';
import type { Request, Response, NextFunction } from 'express';

import type { User } from '../models/types.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const headerAuth = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'];
  const email = req.headers['x-user-email'];
  const role = req.headers['x-user-role'];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized header',
    });
  }
  const normalizedUser: User = {
    id: userId as string,
    email: Array.isArray(email) ? email[0] : email || '',
    role: Array.isArray(role) ? role[0] : role || '',
  };
  req.user = normalizedUser;
  next();
};

export const internalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers['x-internal-token'];

  if (!token) {
    console.log('[internalAuth] ❌ Missing internal token');
    return res.status(401).json({ message: 'Missing internal token' });
  }

  if (token !== config.jwt.internalToken) {
    console.log('[internalAuth] ❌ Invalid internal token');
    return res.status(403).json({ message: 'Invalid internal token' });
  }

  next();
};
