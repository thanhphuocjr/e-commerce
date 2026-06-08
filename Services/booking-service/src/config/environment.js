import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.BOOKING_NODE_ENV || process.env.NODE_ENV || 'dev',
  HOST: process.env.BOOKING_HOST || '0.0.0.0',
  PORT: Number(process.env.BOOKING_PORT || 8002),
  MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
  MYSQL_PORT: Number(process.env.MYSQL_PORT || 3306),
  MYSQL_USER: process.env.MYSQL_USER || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'booking-service',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:8001',
  PAYMENT_SERVICE_URL: process.env.PAYMENT_SERVICE_URL || 'http://localhost:8003',
};

