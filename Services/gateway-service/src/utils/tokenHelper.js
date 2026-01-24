import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/environment.js';

/**
 * Tạo Access Token JWT
 * @param {Object} user - User object chứa _id, email, role
 * @returns {string} Access token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secretKey,
    { expiresIn: config.jwt.accessTokenExpiry },
  );
};

/**
 * Tạo Refresh Token (random string)
 * @returns {string} Refresh token
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Decode JWT token (không verify)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token hoặc null nếu invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secretKey);
  } catch (error) {
    return null;
  }
};
