import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ServiceClient } from '../utils/serviceClient.js';
import config from '../config/environment.js';

const router = Router();

export const createOrderRoutes = () => {
  const orderServiceClient = new ServiceClient(config.services.orderService);

  // Protected routes
  router.get('/orders', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      orderServiceClient.setAuthToken(token);
      const response = await orderServiceClient.get('/orders', {
        params: req.query,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/orders/:id', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      orderServiceClient.setAuthToken(token);
      const response = await orderServiceClient.get(`/orders/${req.params.id}`);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/orders', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      orderServiceClient.setAuthToken(token);
      const response = await orderServiceClient.post('/orders', req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put('/orders/:id', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      orderServiceClient.setAuthToken(token);
      const response = await orderServiceClient.put(
        `/orders/${req.params.id}`,
        req.body
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/orders/:id', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      orderServiceClient.setAuthToken(token);
      const response = await orderServiceClient.delete(
        `/orders/${req.params.id}`
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
