import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
// Fallback to local .env
dotenv.config();

const config = {
  app: {
    nodeEnv: process.env.GATEWAY_NODE_ENV || process.env.NODE_ENV || 'dev',
    port: parseInt(process.env.GATEWAY_PORT) || 5001,
  },
  client: {
    url:
      process.env.GATEWAY_CLIENT_URL ||
      process.env.CLIENT_URL ||
      'http://localhost:3000',
  },
  services: {
    userService: process.env.USER_SERVICE_URL || 'http://localhost:8000',
    productService: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
    orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
    paymentService: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'your_jwt_secret_key_here',
    expireTime: process.env.JWT_EXPIRE_TIME || '7d',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

export default config;
