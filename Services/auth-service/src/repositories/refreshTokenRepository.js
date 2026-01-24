import RefreshToken from '../models/refreshTokenModel.js';

/**
 * Create new refresh token record
 */
export const createRefreshToken = async (userId, token, expiresAt) => {
  try {
    const refreshToken = await RefreshToken.create({
      userId,
      token,
      expiresAt,
      isRevoked: false,
    });
    return refreshToken;
  } catch (error) {
    throw new Error(`Failed to create refresh token: ${error.message}`);
  }
};

/**
 * Find refresh token by token string
 */
export const findByToken = async (token) => {
  try {
    const refreshToken = await RefreshToken.findOne({
      where: { token, isRevoked: false },
      raw: true,
    });
    return refreshToken;
  } catch (error) {
    throw new Error(`Failed to find refresh token: ${error.message}`);
  }
};

/**
 * Find all active tokens for a user
 */
export const findByUserId = async (userId) => {
  try {
    const tokens = await RefreshToken.findAll({
      where: { userId, isRevoked: false },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    return tokens;
  } catch (error) {
    throw new Error(`Failed to find tokens for user: ${error.message}`);
  }
};

/**
 * Soft delete token (logout)
 */
export const revokeToken = async (token) => {
  try {
    const result = await RefreshToken.update(
      {
        isRevoked: true,
        updatedAt: Date.now(),
      },
      { where: { token } },
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to revoke token: ${error.message}`);
  }
};

/**
 * Revoke all tokens for user (logout all devices)
 */
export const revokeAllUserTokens = async (userId) => {
  try {
    const result = await RefreshToken.update(
      {
        isRevoked: true,
        updatedAt: Date.now(),
      },
      { where: { userId } },
    );
    return result;
  } catch (error) {
    throw new Error(`Failed to revoke user tokens: ${error.message}`);
  }
};

/**
 * Delete token by ID
 */
export const deleteToken = async (tokenId) => {
  try {
    const result = await RefreshToken.destroy({
      where: { id: tokenId },
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to delete token: ${error.message}`);
  }
};

/**
 * Clean expired tokens (cron job)
 */
export const cleanExpiredTokens = async () => {
  try {
    const result = await RefreshToken.destroy({
      where: {
        expiresAt: {
          [require('sequelize').Op.lt]: new Date(),
        },
      },
    });
    console.log(`[AuthService] Cleaned ${result} expired tokens`);
    return result;
  } catch (error) {
    throw new Error(`Failed to clean expired tokens: ${error.message}`);
  }
};

export default {
  createRefreshToken,
  findByToken,
  findByUserId,
  revokeToken,
  revokeAllUserTokens,
  deleteToken,
  cleanExpiredTokens,
};
