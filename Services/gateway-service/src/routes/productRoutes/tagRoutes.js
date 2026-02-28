import { Router } from 'express';
import { authMiddleware, authorize } from '../../middleware/auth';
import { ServiceClient } from '../../utils/serviceClient';
import config from '../../config/environment';

export const createTagRoutes = () => {
  const router = Router();

  const productServiceClient = new ServiceClient(
    config.services.productService,
  );

  /* ===================== PUBLIC ROUTES ===================== */

  // Get all tags
  router.get('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/tags', {
        params: req.query,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get tag by id
  router.get('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/tags/${req.params.id}`,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get products by tag
  router.get('/:id/products', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/tags/${req.params.id}/products`,
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
  router.use(authorize('admin'));
  /* ===================== PROTECTED ROUTES ===================== */

  // Create tag (Admin)
  router.post('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.post(
        '/v1/products/tags',
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

  // Update tag (Admin)
  router.put('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.put(
        `/v1/products/tags/${req.params.id}`,
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

  // Delete tag (Admin)
  router.delete('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.delete(
        `/v1/products/tags/${req.params.id}`,
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
