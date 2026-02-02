import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable : ${key}`);
  }
  return value;
};

const requiredNumber = (key: string): number => {
  const value = required(key);
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new Error(`❌ Environment variable ${key} must be a number`);
  }
  return num;
};

/* ========= config ========= */

const config = {
  app: {
    nodeEnv: required('PRODUCT_NODE_ENV'),
    port: requiredNumber('PRODUCT_PORT'),
    host: required('PRODUCT_HOST'),
  },

  database: {
    host: required('MYSQL_HOST'),
    port: requiredNumber('MYSQL_PORT'),
    user: required('MYSQL_USER'),
    password: required('MYSQL_PASSWORD'),
    database: required('MYSQL_DATABASE'),
    dialect: 'mysql' as const,
    logging: process.env.LOG_LEVEL === 'debug' ? console.log : false,
  },

  jwt: {
    secretKey: required('JWT_SECRET_KEY'),
    accessTokenExpiry: required('JWT_ACCESS_TOKEN_EXPIRY'),
    refreshTokenExpiry: required('JWT_REFRESH_TOKEN_EXPIRY'),
  },

  services: {},

  logging: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
};

export default config;
