import mysql from 'mysql2/promise';
import { env } from './environment.js';

let pool;

export const createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
  });

  await connection.execute(
    `CREATE DATABASE IF NOT EXISTS \`${env.MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
};

export const initDatabase = async () => {
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

  return pool;
};

export const createTables = async () => {
  const db = getPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(36) PRIMARY KEY,
      booking_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(64) NOT NULL,
      amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
      currency VARCHAR(8) NOT NULL DEFAULT 'USD',
      method VARCHAR(50) NOT NULL DEFAULT 'mock-card',
      provider VARCHAR(50) NOT NULL DEFAULT 'mock',
      provider_transaction_id VARCHAR(80),
      status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
      failure_reason VARCHAR(255),
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_payment_booking (booking_id),
      INDEX idx_payment_user (user_id),
      INDEX idx_payment_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Payment database pool has not been initialized.');
  }

  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
  }
};

