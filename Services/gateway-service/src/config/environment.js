import dotenv from 'dotenv';
import path from 'path';

// cwd = Services/gateway-service (nơi npm run dev được gọi)
const ROOT_ENV_PATH = path.resolve(process.cwd(), '../../.env');

// Load .env ROOT
dotenv.config({ path: ROOT_ENV_PATH });

// DEBUG – xóa sau khi ổn
console.log('ENV LOADED FROM:', ROOT_ENV_PATH);
console.log('ENV CHECK:', {
  GATEWAY_PORT: process.env.GATEWAY_PORT,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
});

const config = {
  app: {
    nodeEnv: process.env.GATEWAY_NODE_ENV || process.env.NODE_ENV || 'dev',
    port: Number(process.env.GATEWAY_PORT) || 5001,
  },
  client: {
    url:
      process.env.GATEWAY_CLIENT_URL ||
      process.env.CLIENT_URL ||
      'http://localhost:3000',
  },
  services: {
    userService: process.env.USER_SERVICE_URL,
    productService: process.env.PRODUCT_SERVICE_URL,
    orderService: process.env.ORDER_SERVICE_URL,
    paymentService: process.env.PAYMENT_SERVICE_URL,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expireTime: process.env.JWT_EXPIRE_TIME || '7d',
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};
console.log(config);

export default config;
