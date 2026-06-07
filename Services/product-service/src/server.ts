/* eslint-disable semi */
/* eslint-disable no-console */
import express from 'express';
import type { Request, Response } from 'express';
import exitHook from 'async-exit-hook';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/environment.js';
import helmet from 'helmet';
import router from './routes/index.js';

import {
  initDatabase,
  createDatabase,
  testConnection,
  createTables,
  closePool,
} from './config/database.js';

import { reseedDatabase, seedDatabaseIfEmpty } from './utils/seed.js';

const START_SERVER = () => {
  const app = express();
  app.use(helmet());

  app.use(
    cors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Body parsing middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // Routes
  app.use('/v1/products', router);

  app.listen(config.app.port, '0.0.0.0', () => {
    const dbHost = `${config.database.host}:${config.database.port}`;

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║       📦 PRODUCT SERVICE IS RUNNING 📦                    ║
╠═══════════════════════════════════════════════════════════╣
║ Environment: ${(config.app.nodeEnv || 'dev').padEnd(47)}     ║
║ Port:       ${config.app.port.toString().padEnd(47)}     ║
║ Database:   ${'MySQL'.padEnd(47)}                      ║
║ Host:       ${dbHost.padEnd(47)}                         ║
║ Author:     ${('thanhphuoc jr').padEnd(47)}   ║
╠═══════════════════════════════════════════════════════════╣
║ API Endpoints:                                            ║
║ - GET    /v1/products              List products          ║
║ - GET    /v1/products/:id          Get product detail     ║
║ - POST   /v1/products              Create product         ║
║ - PUT    /v1/products/:id          Update product         ║
║ - DELETE /v1/products/:id          Delete product         ║
║                                                           ║
║ Base URL: http://${config.app.host}:${config.app.port}/v1 ║
╚═══════════════════════════════════════════════════════════╝
    `);
  });

  exitHook(() => {
    console.log('4.Server is shutting down...');
    closePool()
      .then(() => {
        console.log('5.Disconnecting from MySQL!');
      })
      .catch((err) => {
        console.error('Error closing MySQL pool:', err);
      });
  });
};

(async () => {
  try {
    console.log('1.Testing MySQL connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to MySQL database');
    }

    console.log('2.Initializing MySQL database pool...');
    await initDatabase();

    console.log('3.Creating database if not exists...');
    await createDatabase();

    console.log('4.Creating tables...');
    await createTables();

    const seedMode = (process.env.PRODUCT_SEED_MODE || 'never').toLowerCase();

    if (seedMode === 'empty') {
      console.log('5.Seeding database if empty...');
      await seedDatabaseIfEmpty();
    } else if (seedMode === 'reseed') {
      console.log('5.Re-seeding database...');
      await reseedDatabase();
    } else {
      console.log('5.Skipping database seed...');
    }

    console.log('6.MySQL is ready!');
    START_SERVER();
  } catch (error) {
    console.error('Error during server initialization:', error);
    process.exit(1);
  }
})();
