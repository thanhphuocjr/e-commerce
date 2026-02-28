import { Router } from 'express';
import { authMiddleware, authorize } from '../../middleware/auth';
import { ServiceClient } from '../../utils/serviceClient';
import config from '../../config/environment';

export const createReviewRoutes = () => {
  const router = Router();

  const productServiceClient = new ServiceClient(
    config.services.productService,
  );

  /* ===================== PUBLIC ROUTES ===================== */

  // Get recent reviews
  router.get('/recent', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        '/v1/products/reviews/recent',
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get reviews by product
  router.get('/product/:productId', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/reviews/product/${req.params.productId}`,
        {
          params: req.query,
        },
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get review by id
  router.get('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/reviews/${req.params.id}`,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  /* ===================== PROTECTED ROUTES ===================== */

  // Tất cả route dưới cần login
  router.use(authMiddleware);

  // Get all reviews (Admin only)
  router.get('/', authorize('admin'), async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/reviews', {
        params: req.query,
        headers: {
          'x-user-id': req.user.id,
          'x-user-email': req.user.email,
          'x-user-role': req.user.role,
        },
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Create review (User/Admin)
  router.post('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.post(
        '/v1/products/reviews',
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

  // Update review (User/Admin)
  router.put('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.put(
        `/v1/products/reviews/${req.params.id}`,
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

  // Delete review (User/Admin)
  router.delete('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.delete(
        `/v1/products/reviews/${req.params.id}`,
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
