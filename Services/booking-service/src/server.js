import express from 'express';
import cors from 'cors';
import exitHook from 'async-exit-hook';
import { env } from './config/environment.js';
import {
  closePool,
  createDatabase,
  createTables,
  initDatabase,
} from './config/database.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const startServer = async () => {
  await createDatabase();
  await initDatabase();
  await createTables();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/v1/bookings', bookingRoutes);
  app.use('/v1/orders', bookingRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Booking endpoint not found',
    });
  });

  app.use(errorHandler);

  app.listen(env.PORT, env.HOST, () => {
    console.log(`Booking service running on ${env.HOST}:${env.PORT}`);
  });

  exitHook(() => {
    closePool().catch((error) => {
      console.error('Failed to close booking DB pool:', error);
    });
  });
};

startServer().catch((error) => {
  console.error('Failed to start booking service:', error);
  process.exit(1);
});

