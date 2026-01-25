import mysql from 'mysql2/promise';
import config from './environment.js';

let pool;

export const initDatabase = async () => {
  try {
    pool = await mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('[DB] MySQL pool created successfully');
    return pool;
  } catch (error) {
    console.error('[DB] Failed to create connection pool:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
    });

    await connection.ping();
    await connection.end();
    console.log('[DB] MySQL connection test successful');
    return true;
  } catch (error) {
    console.error('[DB] MySQL connection test failed:', error.message);
    return false;
  }
};

export const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
    });

    const dbName = config.database.database;
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );

    console.log(`[DB] Database '${dbName}' created or already exists`);
    await connection.end();
  } catch (error) {
    console.error('[DB] Failed to create database:', error.message);
    throw error;
  }
};

export const createRefreshTokenTable = async () => {
  try {
    const pool = getPool();
    const sql = `
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expiresAt DATETIME NOT NULL,
        isRevoked BOOLEAN DEFAULT false,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (userId),
        INDEX idx_token (token),
        INDEX idx_expires_at (expiresAt),
        INDEX idx_created_at (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    const check = await pool.execute(sql);
    console.log(check);
    console.log('[DB] refresh_tokens table created or already exists');
  } catch (error) {
    console.error('[DB] Failed to create refresh_tokens table:', error.message);
    throw error;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase first.');
  }
  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log('[DB] Connection pool closed');
  }
};

export default {
  initDatabase,
  testConnection,
  createDatabase,
  createRefreshTokenTable,
  getPool,
  closePool,
};
