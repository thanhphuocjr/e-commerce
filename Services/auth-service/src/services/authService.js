import {
  createAccessToken,
  createRefreshToken,
  createAndSaveRefreshToken,
  verifyRefreshToken,
  refreshAccessToken,
} from '../utils/tokenHelper.js';
import * as refreshTokenRepository from '../repositories/refreshTokenRepository.js';

/**
 * Create token pair (access + refresh token)
 */
export const createTokenPair = async (user) => {
  try {
    if (!user || !user._id) {
      throw new Error('Invalid user object');
    }

    // Create access token
    const accessToken = createAccessToken(user);

    // Create and save refresh token
    const refreshTokenData = await createAndSaveRefreshToken(user._id);

    return {
      accessToken,
      refreshToken: refreshTokenData.token,
      expiresIn: '15m',
    };
  } catch (error) {
    throw new Error(`Failed to create token pair: ${error.message}`);
  }
};

/**
 * Verify access token
 */
export const validateAccessToken = (token) => {
  try {
    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_SECRET_KEY,
    );
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Verify and refresh access token
 */
export const handleRefreshToken = async (refreshToken, user) => {
  try {
    // Verify refresh token
    const verification = await verifyRefreshToken(refreshToken);

    if (!verification.valid) {
      throw new Error(verification.message);
    }

    // Create new access token
    const newAccessToken = createAccessToken(user);

    return {
      accessToken: newAccessToken,
      expiresIn: '15m',
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

/**
 * Revoke refresh token (logout)
 */
export const revokeRefreshToken = async (token) => {
  try {
    await refreshTokenRepository.revokeToken(token);
    return { message: 'Token revoked successfully' };
  } catch (error) {
    throw new Error(`Failed to revoke token: ${error.message}`);
  }
};

/**
 * Revoke all user tokens (logout all devices)
 */
export const revokeAllUserTokens = async (userId) => {
  try {
    await refreshTokenRepository.revokeAllUserTokens(userId);
    return { message: 'All tokens revoked successfully' };
  } catch (error) {
    throw new Error(`Failed to revoke all tokens: ${error.message}`);
  }
};

/**
 * Get user's active tokens
 */
export const getUserTokens = async (userId) => {
  try {
    const tokens = await refreshTokenRepository.findByUserId(userId);
    return tokens;
  } catch (error) {
    throw new Error(`Failed to get user tokens: ${error.message}`);
  }
};

export default {
  createTokenPair,
  validateAccessToken,
  handleRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  getUserTokens,
};
