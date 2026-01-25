import jwt from 'jsonwebtoken';
import config from '../config/environment.js';

/**
 * Verify JWT token from request
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is required',
      });
    }
    console.log(token);

    const decoded = jwt.verify(token, config.jwt.secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export default verifyToken;
