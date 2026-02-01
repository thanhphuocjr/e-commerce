// src/repositories/user/sql/userRepositorySQL.js
import crypto from 'crypto';
import { getPool } from '../../../config/mysql.js';
import AppError from '../../../utils/AppError.js';
import {
  formatDateForSQL,
  getCurrentDateTimeSQL,
} from '../../../utils/dateFormatter.js';
import {
  USER_VALIDATION_SCHEMA,
  validateBeforeCreate,
  hashPassword,
  comparePassword,
  generateUserId,
} from '../../../models/sql/userModel.js';
import { UserRepositoryInterface } from '../userRepositoryInterface.js';

export class UserRepositorySQL extends UserRepositoryInterface {
  // Create new user
  async createNew(data) {
    try {
      const validData = await validateBeforeCreate(data);
      const pool = getPool();
      const userId = generateUserId();
      validData.password = await hashPassword(validData.password);
      validData.id = userId;

      const sql = `
        INSERT INTO users (id, email, password, fullName, phone, avatar, role, status, lastLogin, resetPasswordToken, resetPasswordExpires, createdAt, updatedAt, deletedAt, isDestroyed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        validData.email,
        validData.password,
        validData.fullName,
        validData.phone || null,
        validData.avatar || null,
        validData.role || 'user',
        validData.status || 'inactive',
        validData.lastLogin ? formatDateForSQL(validData.lastLogin) : null,
        validData.resetPasswordToken || null,
        validData.resetPasswordExpires
          ? formatDateForSQL(validData.resetPasswordExpires)
          : null,
        getCurrentDateTimeSQL(),
        getCurrentDateTimeSQL(),
        null,
        false,
      ];

      await pool.execute(sql, values);

      // Return created user without password
      const { password, ...userWithoutPassword } = validData;
      return { id: userId, ...userWithoutPassword };
    } catch (error) {
      throw new AppError('createNew in Repository has problems', 500, error);
    }
  }

  // Find user by email
  async findOneByEmail(email) {
    try {
      const pool = getPool();
      const sql = 'SELECT * FROM users WHERE email = ? AND isDestroyed = false';
      const [rows] = await pool.execute(sql, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new AppError('findOneByEmail has problems', 500, error);
    }
  }

  // Find user by ID
  async findOneById(id) {
    try {
      const pool = getPool();
      const sql = 'SELECT * FROM users WHERE id = ? AND isDestroyed = false';
      const [rows] = await pool.execute(sql, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new AppError('findOneById has problems', 500, error);
    }
  }

  async findOneById_ADMIN(id) {
    try {
      const pool = getPool();
      const sql = 'SELECT * FROM users WHERE id = ?';
      const [rows] = await pool.execute(sql, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new AppError('findOneById has problems', 500, error);
    }
  }

  // Get stats
  async getStats() {
    try {
      const pool = getPool();
      const statsQueries = [
        {
          query:
            'SELECT COUNT(*) as count FROM users WHERE isDestroyed = false',
          stat: 'total',
        },
        {
          query:
            'SELECT COUNT(*) as count FROM users WHERE status = "active" AND isDestroyed = false',
          stat: 'active',
        },
        {
          query:
            'SELECT COUNT(*) as count FROM users WHERE status = "inactive" AND isDestroyed = false',
          stat: 'inactive',
        },
        {
          query:
            'SELECT COUNT(*) as count FROM users WHERE status = "blocked" AND isDestroyed = false',
          stat: 'blocked',
        },
      ];

      const stats = {};
      for (const item of statsQueries) {
        const [rows] = await pool.execute(item.query);
        stats[item.stat] = rows[0].count;
      }

      return stats;
    } catch (error) {
      throw new AppError('getStats has problems', 500, error);
    }
  }

  // Update by ID
  async updateDataById(userId, updateData) {
    try {
      const pool = getPool();
      const updateFields = [];
      const values = [];

      // Hash password if provided
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }

      // Build dynamic UPDATE query
      Object.keys(updateData).forEach((key) => {
        if (key !== 'id' && key !== 'createdAt') {
          updateFields.push(`${key} = ?`);
          // Format date fields for MySQL
          if (
            key === 'lastLogin' ||
            key === 'resetPasswordExpires' ||
            key === 'deletedAt'
          ) {
            values.push(
              updateData[key] ? formatDateForSQL(updateData[key]) : null,
            );
          } else {
            values.push(updateData[key]);
          }
        }
      });

      if (updateFields.length === 0) {
        throw new AppError('No fields to update', 400);
      }

      updateFields.push('updatedAt = ?');
      values.push(getCurrentDateTimeSQL());
      values.push(userId);

      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ? AND isDestroyed = false`;
      await pool.execute(sql, values);

      // Return updated user
      return await this.findOneById(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('updateDataById has problems', 500, error);
    }
  }

  // Soft delete
  async softDelete(userId) {
    try {
      const pool = getPool();
      const existingUser = await this.findOneById(userId);

      if (!existingUser) {
        throw new AppError('Không tìm thấy user hoặc đã bị xóa', 404);
      }

      const sql =
        'UPDATE users SET isDestroyed = true, deletedAt = ?, updatedAt = ? WHERE id = ? AND isDestroyed = false';
      const now = getCurrentDateTimeSQL();
      await pool.execute(sql, [now, now, userId]);

      return { ...existingUser, isDestroyed: true, deletedAt: now };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('softDelete has problems', 500, error);
    }
  }

  // Permanent delete
  async permanentDelete(userId) {
    try {
      const pool = getPool();
      const existingUser = await this.findOneById(userId);

      if (!existingUser) {
        throw new AppError('Không tìm thấy user', 404);
      }

      const sql = 'DELETE FROM users WHERE id = ?';
      const result = await pool.execute(sql, [userId]);

      if (result[0].affectedRows === 0) {
        throw new AppError('Không thể xóa user', 400);
      }

      return result[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('permanentDelete has problems', 500, error);
    }
  }

  // Restore user
  async restoreUser(userId) {
    try {
      const pool = getPool();
      const existingUser = await this.findOneById_ADMIN(userId);

      if (!existingUser || !existingUser.isDestroyed) {
        throw new AppError('Không tìm thấy user hoặc không bị xóa', 404);
      }

      const sql =
        'UPDATE users SET isDestroyed = false, deletedAt = NULL, updatedAt = ? WHERE id = ?';
      await pool.execute(sql, [getCurrentDateTimeSQL(), userId]);

      return await this.findOneById(userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('restoreUser has problems', 500, error);
    }
  }

  async findUsersWithFilters({
    page = 1,
    limit = 10,
    fullName,
    email,
    phone,
    status,
    role,
    sort = 'createdAt:DESC',
  }) {
    try {
      const pool = getPool();

      // Validate và sanitize inputs
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(Math.max(1, parseInt(limit, 10) || 10), 100);
      const offset = (pageNum - 1) * limitNum;

      const whereConditions = ['isDestroyed = 0'];
      const params = [];

      if (fullName) {
        whereConditions.push('fullName LIKE ?');
        params.push(`%${fullName}%`);
      }

      if (email) {
        whereConditions.push('email LIKE ?');
        params.push(`%${email}%`);
      }

      if (phone) {
        whereConditions.push('phone LIKE ?');
        params.push(`%${phone}%`);
      }

      if (status) {
        whereConditions.push('status = ?');
        params.push(status);
      }

      if (role) {
        whereConditions.push('role = ?');
        params.push(role);
      }

      const whereClause = whereConditions.join(' AND ');

      // Allowed sort fields (whitelist)
      const allowedSortFields = [
        'createdAt',
        'updatedAt',
        'fullName',
        'email',
        'role',
        'status',
        'lastLogin',
      ];

      let orderBy = 'createdAt DESC';

      if (sort) {
        const orders = sort
          .split(',')
          .map((item) => {
            const [field, dir] = item.split(':');
            // Chỉ cho phép các field được whitelist
            if (!allowedSortFields.includes(field)) return null;
            const direction = dir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            return `${field} ${direction}`;
          })
          .filter(Boolean);

        if (orders.length > 0) {
          orderBy = orders.join(', ');
        }
      }

      // COUNT query
      const countSql = `SELECT COUNT(*) AS total FROM users WHERE ${whereClause}`;
      const [[{ total }]] = await pool.execute(countSql, params);

      // DATA query
      // Build LIMIT và OFFSET trực tiếp vào SQL (an toàn vì đã validate là số)
      const dataSql = `
      SELECT 
        id, 
        email, 
        fullName, 
        phone, 
        avatar, 
        role, 
        status, 
        lastLogin, 
        createdAt, 
        updatedAt
      FROM users
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ${limitNum} OFFSET ${offset}
    `;

      // Chỉ truyền params cho WHERE clause, không có LIMIT/OFFSET
      const [users] = await pool.execute(dataSql, params);

      return {
        users,
        pagination: {
          currentPage: pageNum,
          itemsPerPage: limitNum,
          totalItems: total,
          totalPages: Math.ceil(total / limitNum),
        },
      };
    } catch (error) {
      console.error('findUsersWithFilters error details:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage,
        sql: error.sql,
      });
      throw new AppError('findUsersWithFilters failed', 500, error);
    }
  }

  // Reset password token
  async setResetPasswordToken(email) {
    try {
      const pool = getPool();
      const token = crypto.randomBytes(32).toString('hex');
      const expires = formatDateForSQL(new Date(Date.now() + 60 * 60 * 1000));

      const sql =
        'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ?, updatedAt = ? WHERE email = ?';
      await pool.execute(sql, [token, expires, getCurrentDateTimeSQL(), email]);

      const user = await this.findOneByEmail(email);
      return { token, user };
    } catch (error) {
      throw new AppError('setResetPasswordToken has problems', 500, error);
    }
  }

  // Find by reset token
  async findByResetToken(token) {
    try {
      const pool = getPool();
      const sql =
        'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW() AND isDestroyed = false';
      const [rows] = await pool.execute(sql, [token]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new AppError('findByResetToken has problems', 500, error);
    }
  }

  // Clear reset token
  async clearResetToken(userId) {
    try {
      const pool = getPool();
      const sql =
        'UPDATE users SET resetPasswordToken = NULL, resetPasswordExpires = NULL, updatedAt = ? WHERE id = ?';
      await pool.execute(sql, [getCurrentDateTimeSQL(), userId]);
      return await this.findOneById(userId);
    } catch (error) {
      throw new AppError('clearResetToken has problems', 500, error);
    }
  }

  // Set active status
  async setActiveStatus(id) {
    try {
      const pool = getPool();
      const sql =
        'UPDATE users SET status = "active", updatedAt = ? WHERE id = ? AND isDestroyed = false';
      await pool.execute(sql, [getCurrentDateTimeSQL(), id]);
      return await this.findOneById(id);
    } catch (error) {
      throw new AppError('setActiveStatus has problems', 500, error);
    }
  }

  // Set inactive status
  async setInActiveStatus(id) {
    try {
      const pool = getPool();
      const sql =
        'UPDATE users SET status = "inactive", updatedAt = ? WHERE id = ? AND isDestroyed = false';
      await pool.execute(sql, [getCurrentDateTimeSQL(), id]);
      return await this.findOneById(id);
    } catch (error) {
      throw new AppError('setInActiveStatus has problems', 500, error);
    }
  }
}
