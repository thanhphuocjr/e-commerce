import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ServiceClient } from '../utils/serviceClient.js';
import config from '../config/environment.js';

const router = Router();

export const createProductRoutes = () => {
  const productServiceClient = new ServiceClient(
    config.services.productService
  );

  // Public routes
  router.get('/products', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/products', {
        params: req.query,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/products/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/products/${req.params.id}`
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/categories', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/categories');
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Protected routes (Admin only)
  router.post('/products', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      productServiceClient.setAuthToken(token);
      const response = await productServiceClient.post('/products', req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put('/products/:id', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      productServiceClient.setAuthToken(token);
      const response = await productServiceClient.put(
        `/products/${req.params.id}`,
        req.body
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/products/:id', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      productServiceClient.setAuthToken(token);
      const response = await productServiceClient.delete(
        `/products/${req.params.id}`
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
