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
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLIENT_URL: process.env.CLIENT_URL,
  DATABASE_TYPE: process.env.DATABASE_TYPE,
};
