import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/environment.js';
import * as refreshTokenRepository from '../repositories/refreshTokenRepository.js';

/**
 * Create Access Token (JWT)
 */
export const createAccessToken = (user) => {
  if (!user || !user._id) {
    throw new Error('Invalid user object for token generation');
  }

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
 * Create Refresh Token (secure random string)
 */
export const createRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Create and save refresh token
 */
export const createAndSaveRefreshToken = async (userId) => {
  try {
    console.log('[TokenHelper] Creating refresh token for user:', userId);
    const token = createRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    console.log('[TokenHelper] Saving refresh token to repository...');
    const savedToken = await refreshTokenRepository.createRefreshToken(
      userId,
      token,
      expiresAt,
    );
    console.log('[TokenHelper] Refresh token saved successfully');

    return {
      token: savedToken.token,
      id: savedToken.id,
      expiresAt: savedToken.expiresAt,
    };
  } catch (error) {
    console.error('[TokenHelper] Error creating refresh token:', error.message);
    throw new Error(`Failed to create refresh token: ${error.message}`);
  }
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secretKey);
    return { valid: true, data: decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, expired: true, message: 'Token expired' };
    }
    return { valid: false, message: 'Invalid token' };
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = async (token) => {
  try {
    const tokenRecord = await refreshTokenRepository.findByToken(token);

    if (!tokenRecord) {
      return { valid: false, message: 'Token not found' };
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      return { valid: false, expired: true, message: 'Token expired' };
    }

    if (tokenRecord.isRevoked) {
      return { valid: false, message: 'Token revoked' };
    }

    return { valid: true, data: tokenRecord };
  } catch (error) {
    return { valid: false, message: error.message };
  }
};

/**
 * Decode token without verification
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken, user) => {
  try {
    // Verify refresh token exists and not expired
    const verification = await verifyRefreshToken(refreshToken);

    if (!verification.valid) {
      throw new Error(verification.message);
    }

    // Create new access token
    const newAccessToken = createAccessToken(user);

    return {
      accessToken: newAccessToken,
      expiresIn: config.jwt.accessTokenExpiry,
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

export default {
  createAccessToken,
  createRefreshToken,
  createAndSaveRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  refreshAccessToken,
};
