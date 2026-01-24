import 'dotenv/config';

export const config = {
  app: {
    nodeEnv: process.env.AUTH_NODE_ENV || 'development',
    port: Number(process.env.AUTH_PORT) || 3005,
    host: process.env.AUTH_HOST || 'localhost',
  },
  database: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'ecommerce_auth',
    dialect: 'mysql',
    logging: process.env.LOG_LEVEL === 'debug' ? console.log : false,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
  },
  services: {
    userService: process.env.USER_SERVICE_URL || 'http://localhost:8000',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

export default config;
