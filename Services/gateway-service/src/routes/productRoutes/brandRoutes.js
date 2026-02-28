import { Router } from 'express';
import { authMiddleware, authorize } from '../../middleware/auth';
import { ServiceClient } from '../../utils/serviceClient';
import config from '../../config/environment';

const router = Router();

export const createBrandRoutes = () => {
  const productServiceClient = new ServiceClient(
    config.services.productService,
  );

  /* ================= PUBLIC ROUTES ================= */

  // Get brand stats (có thể để public hoặc admin tuỳ bạn)
  router.get('/stats', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        '/v1/products/brands/stats',
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get all brands
  router.get('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/brands');
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get brand by id
  router.get('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/brands/${req.params.id}`,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  /* ================= PROTECTED ROUTES ================= */

  router.use(authMiddleware);
  router.use(authorize('admin'));

  // Create brand
  router.post('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.post(
        '/v1/products/brands',
        req.body,
        {
          headers: {
            'x-user-id': req.user.id,
            'x-user-email': req.user.email,
            'x-user-role': req.user.role,
          },
        },
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Update brand
  router.put('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.put(
        `/v1/products/brands/${req.params.id}`,
        req.body,
        {
          headers: {
            'x-user-id': req.user.id,
            'x-user-email': req.user.email,
            'x-user-role': req.user.role,
          },
        },
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Delete brand
  router.delete('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.delete(
        `/v1/products/brands/${req.params.id}`,
        {
          headers: {
            'x-user-id': req.user.id,
            'x-user-email': req.user.email,
            'x-user-role': req.user.role,
          },
        },
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
