/* eslint-disable no-console */
import mysql from 'mysql2/promise';
import { env } from './environment.js';

let pool;

export const initDatabase = async () => {
  try {
    pool = await mysql.createPool({
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DATABASE,
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
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
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
      host: env.MYSQL_HOST,
      port: env.MYSQL_PORT,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
    });

    const dbName = env.MYSQL_DATABASE;
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

export const createUserTable = async () => {
  try {
    const pool = getPool();
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        avatar VARCHAR(500),
        role ENUM('admin', 'user') DEFAULT 'user',
        status ENUM('active', 'inactive', 'blocked') DEFAULT 'inactive',
        lastLogin DATETIME,
        resetPasswordToken VARCHAR(255),
        resetPasswordExpires DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deletedAt DATETIME,
        isDestroyed BOOLEAN DEFAULT false,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_role (role),
        INDEX idx_created_at (createdAt),
        INDEX idx_is_destroyed (isDestroyed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await pool.execute(sql);
    console.log('[DB] users table created or already exists');
  } catch (error) {
    console.error('[DB] Failed to create users table:', error.message);
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
  createUserTable,
  getPool,
  closePool,
};
