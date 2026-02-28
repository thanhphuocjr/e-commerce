import { Router } from 'express';
import { authMiddleware, authorize } from '../../middleware/auth';
import { ServiceClient } from '../../utils/serviceClient';
import config from '../../config/environment';

export const createCategoryRoutes = () => {
  const router = Router();

  const productServiceClient = new ServiceClient(
    config.services.productService,
  );

  /* ===================== PUBLIC ROUTES ===================== */

  // Get all categories
  router.get('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        '/v1/products/categories',
        {
          params: req.query,
        },
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get category by id
  router.get('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/categories/${req.params.id}`,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get products by category
  router.get('/:id/products', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/categories/${req.params.id}/products`,
        {
          params: req.query,
        },
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  /* ===================== PROTECTED ROUTES ===================== */

  router.use(authMiddleware);

  // Category stats (Admin only)
  router.get('/stats', authorize('admin'), async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        '/v1/products/categories/stats',
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

  // Create category (Admin only)
  router.post('/', authorize('admin'), async (req, res, next) => {
    try {
      const response = await productServiceClient.post(
        '/v1/products/categories',
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

  // Update category (Admin only)
  router.put('/:id', authorize('admin'), async (req, res, next) => {
    try {
      const response = await productServiceClient.put(
        `/v1/products/categories/${req.params.id}`,
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

  // Delete category (Admin only)
  router.delete('/:id', authorize('admin'), async (req, res, next) => {
    try {
      const response = await productServiceClient.delete(
        `/v1/products/categories/${req.params.id}`,
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
