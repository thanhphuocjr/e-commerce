import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ServiceClient } from '../utils/serviceClient.js';
import config from '../config/environment.js';

const getAuthHeaders = (req) => ({
  Authorization: req.headers.authorization,
});

export const createBookingRoutes = (targetPath = '/v1/bookings') => {
  const router = Router();
  const bookingServiceClient = new ServiceClient(
    config.services.bookingService || config.services.orderService,
  );

  router.use(authMiddleware);

  router.post('/checkout', async (req, res, next) => {
    try {
      const response = await bookingServiceClient.post(
        `${targetPath}/checkout`,
        req.body,
        {
          headers: getAuthHeaders(req),
        },
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const response = await bookingServiceClient.get(targetPath, {
        params: req.query,
        headers: getAuthHeaders(req),
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const response = await bookingServiceClient.get(
        `${targetPath}/${req.params.id}`,
        {
          headers: getAuthHeaders(req),
        },
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

