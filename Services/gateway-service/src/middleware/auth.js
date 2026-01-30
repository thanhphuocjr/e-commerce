import jwt from 'jsonwebtoken';
import config from '../config/environment.js';
import { HTTP_STATUS_CODES, ERROR_MESSAGES } from '../constants/httpStatus.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(token, config.jwt.secretKey);
    req.user = decoded;
    console.log('req.user :', req.user);
    // {id, email, role}
    next();
  } catch (error) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
    });
  }
};

export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You do not have permission',
      });
    }
    next();
  };
