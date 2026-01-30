import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  AUTHOR: process.env.AUTHOR,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLIENT_URL: process.env.CLIENT_URL,
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'mongodb',
  // MySQL Configuration
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  INTERNAL_SERVICE_TOKEN: process.env.INTERNAL_SERVICE_TOKEN,
};
