import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ServiceClient } from '../utils/serviceClient.js';
import config from '../config/environment.js';

const getAuthHeaders = (req) => ({
  Authorization: req.headers.authorization,
});

export const createPaymentRoutes = () => {
  const router = Router();
  const paymentServiceClient = new ServiceClient(config.services.paymentService);

  router.use(authMiddleware);

  router.get('/booking/:bookingId', async (req, res, next) => {
    try {
      const response = await paymentServiceClient.get(
        `/v1/payments/booking/${req.params.bookingId}`,
        {
          headers: getAuthHeaders(req),
        },
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const response = await paymentServiceClient.get(
        `/v1/payments/${req.params.id}`,
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
