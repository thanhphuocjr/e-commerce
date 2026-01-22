import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import asyncExitHook from 'async-exit-hook';

// Thay đổi này trong server.js
import config from './config/environment.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createUserRoutes } from './routes/userRoutes.js';
// import { createProductRoutes } from '@routes/productRoutes';
// import { createOrderRoutes } from '@routes/orderRoutes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.client.url,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Logging and rate limiting
app.use(requestLogger);
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/users', createUserRoutes());
// app.use('/api/products', createProductRoutes());
// app.use('/api/orders', createOrderRoutes());

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Server startup
const startServer = async () => {
  try {
    const server = app.listen(config.app.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║            🚀 GATEWAY SERVICE IS RUNNING 🚀               ║
╠═══════════════════════════════════════════════════════════╣
║ Environment: ${config.app.nodeEnv.padEnd(47)}             ║
║ Port:       ${config.app.port.toString().padEnd(47)}      ║
║ Client URL: ${config.client.url.padEnd(47)}               ║
╠═══════════════════════════════════════════════════════════╣
║ Services:                                                 ║
║ - User Service:    ${config.services.userService.padEnd(39)}║
║ - Product Service: ${config.services.productService.padEnd(39)}║
║ - Order Service:   ${config.services.orderService.padEnd(39)}║
║ - Payment Service: ${config.services.paymentService.padEnd(39)}║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    asyncExitHook(async () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] Closed successfully');
      });
    });
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
