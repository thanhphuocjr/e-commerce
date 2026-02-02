import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  app: {
    nodeEnv: process.env.PRODUCT_NODE_ENV,
    port: Number(process.env.PRODUCT_PORT),
    host: process.env.PRODUCT_HOST,
  },
  database: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql',
    logging: process.env.LOG_LEVEL === 'debug' ? console.log : false,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  },
  services: {},
  logging: {
    level: process.env.LOG_LEVEL,
  },
};

console.log(config);
export default config;

