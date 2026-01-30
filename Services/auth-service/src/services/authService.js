import {
  createAccessToken,
  createRefreshToken,
  createAndSaveRefreshToken,
  verifyRefreshToken,
  refreshAccessToken,
} from '../utils/tokenHelper.js';
import * as refreshTokenRepository from '../repositories/refreshTokenRepository.js';
import jwt from 'jsonwebtoken';
import config from '../config/environment.js';
import axios from 'axios';

/**
 * Create token pair (access + refresh token)
 */
export const createTokenPair = async (user) => {
  try {
    if (!user || !user.id) {
      throw new Error('Invalid user object');
    }

    console.log('[AuthService] Creating access token...');
    // Create access token
    const accessToken = createAccessToken(user);
    console.log('[AuthService] Access token created');

    console.log('[AuthService] Creating refresh token...');
    // Create and save refresh token
    const refreshTokenData = await createAndSaveRefreshToken(user.id);
    console.log('[AuthService] Refresh token created:', refreshTokenData);

    return {
      accessToken,
      refreshToken: refreshTokenData.token,
      expiresIn: '15m',
    };
  } catch (error) {
    console.error('[AuthService] Error in createTokenPair:', error.message);
    throw new Error(`Failed to create token pair: ${error.message}`);
  }
};

/**
 * Verify access token
 */
export const validateAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Verify and refresh access token
 */
export const handleRefreshToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const verification = await verifyRefreshToken(refreshToken);

    if (!verification.valid) {
      throw new Error(verification.message);
    }
    const id = verification.data.userId;

    const response = await axios.get(
      `http://user-service:8000/v1/users/internal/${id}`,
      {
        headers: {
          'x-internal-token': config.internal.INTERNAL_SERVICE_TOKEN,
        },
      },
    );
    console.log('user:', response.data);
    // Create new access token
    const newAccessToken = createAccessToken(response.data.data);

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
