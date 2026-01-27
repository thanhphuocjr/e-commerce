// src/repositories/user/sql/refreshTokenRepository.js
import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../../../config/mysql.js';
import AppError from '../../../utils/AppError.js';

export const createNew = async (data) => {
  try {
    const pool = getPool();
    const tokenId = uuidv4();

    const sql = `
      INSERT INTO refresh_tokens (id, userId, token, expiresAt, isRevoked, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      tokenId,
      data.userId,
      data.token,
      data.expiresAt,
      false,
      new Date(),
      new Date(),
    ];

    await pool.execute(sql, values);
    return {
      id: tokenId,
      ...data,
      isRevoked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    throw new AppError('Repository: Lỗi khi tạo refresh token', 500, error);
  }
};

// Find refresh token (only get non-expired tokens)
export const findByToken = async (token) => {
  try {
    const pool = getPool();
    const sql = `
      SELECT * FROM refresh_tokens 
      WHERE token = ? AND expiresAt > NOW() AND isRevoked = false
      LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [token]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw new AppError('Repository: Lỗi khi tìm refresh token', 500, error);
  }
};

// Delete refresh token by token
export const deleteByToken = async (token) => {
  try {
    const pool = getPool();
    const sql = 'DELETE FROM refresh_tokens WHERE token = ?';
    const result = await pool.execute(sql, [token]);
    return result[0];
  } catch (error) {
    throw new AppError('Repository: Lỗi khi xóa refresh token', 500, error);
  }
};

// Delete all refresh tokens for a user
export const deleteByUserId = async (userId) => {
  try {
    const pool = getPool();
    const sql = 'DELETE FROM refresh_tokens WHERE userId = ?';
    const result = await pool.execute(sql, [userId]);
    return result[0];
  } catch (error) {
    throw new AppError(
      'Repository: Lỗi khi xóa tất cả refresh token của user',
      500,
      error,
    );
  }
};

// Cleanup expired tokens
export const deleteExpiredTokens = async () => {
  try {
    const pool = getPool();
    const sql = 'DELETE FROM refresh_tokens WHERE expiresAt < NOW()';
    const result = await pool.execute(sql);
    return result[0];
  } catch (error) {
    throw new AppError(
      'Repository: Lỗi khi xóa refresh token hết hạn',
      500,
      error,
    );
  }
};

// Revoke token (mark as revoked instead of deleting)
export const revokeToken = async (token) => {
  try {
    const pool = getPool();
    const sql =
      'UPDATE refresh_tokens SET isRevoked = true, updatedAt = ? WHERE token = ?';
    await pool.execute(sql, [new Date(), token]);
    return await findByToken(token);
  } catch (error) {
    throw new AppError('Repository: Lỗi khi revoke refresh token', 500, error);
  }
};

// Revoke all tokens for a user
export const revokeAllTokensByUserId = async (userId) => {
  try {
    const pool = getPool();
    const sql =
      'UPDATE refresh_tokens SET isRevoked = true, updatedAt = ? WHERE userId = ?';
    const result = await pool.execute(sql, [new Date(), userId]);
    return result[0];
  } catch (error) {
    throw new AppError(
      'Repository: Lỗi khi revoke tất cả refresh token của user',
      500,
      error,
    );
  }
};
