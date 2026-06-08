import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.PAYMENT_NODE_ENV || process.env.NODE_ENV || 'dev',
  HOST: process.env.PAYMENT_HOST || '0.0.0.0',
  PORT: Number(process.env.PAYMENT_PORT || 8003),
  MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
  MYSQL_PORT: Number(process.env.MYSQL_PORT || 3306),
  MYSQL_USER: process.env.MYSQL_USER || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'payment-service',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

