import { getPool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create new refresh token record
 */
export const createRefreshToken = async (userId, token, expiresAt) => {
  let connection;
  try {
    const pool = getPool();
    const id = uuidv4();

    // Convert all timestamps to MySQL DATETIME format for consistency
    const nowDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const expiresAtFormatted = new Date(expiresAt)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    console.log('[RefreshTokenRepository] Creating token with:', {
      id,
      userId,
      token: token.substring(0, 20) + '...',
      expiresAtFormatted,
      createdAt: nowDateTime,
    });

    const sql = `
      INSERT INTO refresh_tokens (id, userId, token, expiresAt, isRevoked, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      id,
      userId,
      token,
      expiresAtFormatted,
      0,
      nowDateTime,
      nowDateTime,
    ]);

    console.log('[RefreshTokenRepository] Insert result:', {
      affectedRows: result.affectedRows,
      insertId: result.insertId,
    });

    if (result.affectedRows === 0) {
      throw new Error('Insert failed: no rows affected');
    }

    console.log('[RefreshTokenRepository] Token saved successfully');

    return {
      id,
      userId,
      token,
      expiresAt: expiresAtFormatted,
      isRevoked: false,
      createdAt: nowDateTime,
      updatedAt: nowDateTime,
    };
  } catch (error) {
    console.error('[RefreshTokenRepository] Error creating refresh token:', {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to create refresh token: ${error.message}`);
  }
};

/**
 * Find refresh token by token string
 */
export const findByToken = async (token) => {
  try {
    const pool = getPool();

    const sql = `
      SELECT * FROM refresh_tokens
      WHERE token = ? AND isRevoked = false
      LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [token]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error(`Failed to find refresh token: ${error.message}`);
  }
};

/**
 * Find all active tokens for a user
 */
export const findByUserId = async (userId) => {
  try {
    const pool = getPool();

    const sql = `
      SELECT * FROM refresh_tokens
      WHERE userId = ? AND isRevoked = false
      ORDER BY createdAt DESC
    `;

    const [rows] = await pool.execute(sql, [userId]);

    return rows || [];
  } catch (error) {
    throw new Error(`Failed to find tokens for user: ${error.message}`);
  }
};

/**
 * Soft delete token (logout)
 */
export const revokeToken = async (token) => {
  const pool = getPool();

  const [rows] = await pool.execute(
    `SELECT id, isRevoked FROM refresh_tokens WHERE token = ? LIMIT 1`,
    [token],
  );

  if (rows.length === 0) {
    return { success: false, reason: 'TOKEN_NOT_FOUND' };
  }

  if (rows[0].isRevoked) {
    return { success: false, reason: 'TOKEN_ALREADY_REVOKED' };
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await pool.execute(
    `UPDATE refresh_tokens SET isRevoked = true, updatedAt = ? WHERE token = ?`,
    [now, token],
  );

  return { success: true };
};


/**
 * Revoke all tokens for user (logout all devices)
 */
export const revokeAllUserTokens = async (userId) => {
  try {
    const pool = getPool();

    const nowDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `
      UPDATE refresh_tokens
      SET isRevoked = true, updatedAt = ?
      WHERE userId = ?
    `;

    const [result] = await pool.execute(sql, [nowDateTime, userId]);

    return result.affectedRows;
  } catch (error) {
    throw new Error(`Failed to revoke user tokens: ${error.message}`);
  }
};

/**
 * Delete token by ID
 */
export const deleteToken = async (tokenId) => {
  try {
    const pool = getPool();

    const sql = `
      DELETE FROM refresh_tokens
      WHERE id = ?
    `;

    const [result] = await pool.execute(sql, [tokenId]);

    return result.affectedRows;
  } catch (error) {
    throw new Error(`Failed to delete token: ${error.message}`);
  }
};

/**
 * Clean expired tokens
 */
export const cleanExpiredTokens = async () => {
  try {
    const pool = getPool();

    const sql = `
      DELETE FROM refresh_tokens
      WHERE expiresAt < NOW()
    `;

    const [result] = await pool.execute(sql);

    console.log(`[AuthService] Cleaned ${result.affectedRows} expired tokens`);
    return result.affectedRows;
  } catch (error) {
    throw new Error(`Failed to clean expired tokens: ${error.message}`);
  }
};

/**
 * Find token by ID
 */
export const findById = async (tokenId) => {
  try {
    const pool = getPool();

    const sql = `
      SELECT * FROM refresh_tokens
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [tokenId]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new Error(`Failed to find token by ID: ${error.message}`);
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
  findById,
};
