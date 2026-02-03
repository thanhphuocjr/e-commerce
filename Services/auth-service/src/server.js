import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config/environment.js';
import {
  testConnection,
  initDatabase,
  createDatabase,
  createRefreshTokenTable,
  closePool,
} from './config/database.js';
import { createAuthRoutes } from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Body parsing
app.use((req, res, next) => {
  console.log(`[Middleware] ${req.method} ${req.path}`);
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint
app.post('/test', (req, res) => {
  console.log('[Test] Received request:', req.body);
  res.json({ success: true, message: 'Test received' });
});
``
// API routes
app.use('/v1/auth', createAuthRoutes());

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
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('[Server] Database connection failed. Exiting...');
      process.exit(1);
    }

    // Initialize database (create pool)
    await initDatabase();

    // Create database if not exists
    await createDatabase();

    // Create tables
    await createRefreshTokenTable();

    console.log('[Server] Config values:', {
      port: config.app.port,
      host: config.app.host,
      portType: typeof config.app.port,
    });

    const server = app.listen(config.app.port, config.app.host, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║            🔐 AUTH SERVICE IS RUNNING 🔐                  ║
╠═══════════════════════════════════════════════════════════╣
║ Environment: ${config.app.nodeEnv.padEnd(47)}             ║
║ Port:       ${config.app.port.toString().padEnd(47)}      ║
║ Database:   MySQL at ${config.database.host}:${config.database.port}${' '.repeat(37 - config.database.host.length - config.database.port.toString().length)}║
╠═══════════════════════════════════════════════════════════╣
║ Endpoints:                                                ║
║ - POST /v1/auth/create-tokens                         ║
║ - POST /v1/auth/verify-token                              ║
║ - POST /v1/auth/refresh-token                             ║
║ - POST /v1/auth/revoke-token                              ║
║ - POST /v1/auth/revoke-all                                ║
║ - GET  /v1/auth/tokens/:userId                            ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('[Server] SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('[Server] HTTP server closed');
        await closePool();
        console.log('[Server] Database pool closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
