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
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      user_email VARCHAR(255),
      status ENUM('pending_payment', 'paid', 'payment_failed', 'cancelled') DEFAULT 'pending_payment',
      payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
      payment_id VARCHAR(36),
      subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
      shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
      total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
      currency VARCHAR(8) NOT NULL DEFAULT 'USD',
      payment_method VARCHAR(50) NOT NULL DEFAULT 'mock-card',
      customer_name VARCHAR(255),
      customer_email VARCHAR(255),
      customer_phone VARCHAR(50),
      shipping_address TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_booking_user (user_id),
      INDEX idx_booking_status (status),
      INDEX idx_booking_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS booking_items (
      id VARCHAR(36) PRIMARY KEY,
      booking_id VARCHAR(36) NOT NULL,
      product_id INT NOT NULL,
      product_title VARCHAR(255) NOT NULL,
      product_image TEXT,
      unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
      quantity INT NOT NULL DEFAULT 1,
      subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_booking_items_booking (booking_id),
      CONSTRAINT fk_booking_items_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Booking database pool has not been initialized.');
  }

  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
  }
};

