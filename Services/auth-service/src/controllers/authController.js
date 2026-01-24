import { StatusCodes } from 'http-status-codes';
import * as authService from '../services/authService.js';

/**
 * Create token pair
 * POST /v1/auth/create-tokens
 */
export const createTokens = async (req, res, next) => {
  try {
    const { user } = req.body;

    if (!user || !user._id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User object is required',
      });
    }

    const tokens = await authService.createTokenPair(user);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Tokens created successfully',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify access token
 * POST /v1/auth/verify-token
 */
export const verifyAccessToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Token is required',
      });
    }

    const result = authService.validateAccessToken(token);

    if (!result.valid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: result.error,
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Token is valid',
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * POST /v1/auth/refresh-token
 */
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken, user } = req.body;

    if (!refreshToken || !user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Refresh token and user are required',
      });
    }

    const result = await authService.handleRefreshToken(refreshToken, user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke refresh token (logout)
 * POST /v1/auth/revoke-token
 */
export const revokeToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    await authService.revokeRefreshToken(refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Token revoked successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke all user tokens (logout all devices)
 * POST /v1/auth/revoke-all
 */
export const revokeAllTokens = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    await authService.revokeAllUserTokens(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'All tokens revoked successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's active tokens
 * GET /v1/auth/tokens/:userId
 */
export const getUserTokens = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const tokens = await authService.getUserTokens(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User tokens retrieved',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createTokens,
  verifyAccessToken,
  refreshAccessToken,
  revokeToken,
  revokeAllTokens,
  getUserTokens,
};
