import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { ServiceClient } from '../utils/serviceClient';

import config from '../config/environment';

const router = Router();

export const createProductRoutes = () => {
  const productServiceClient = new ServiceClient(
    config.services.productService,
  );
  // const authServiceClient = new ServiceClient(config.services.authService);

  // PRODUCT_SERVICE
  router.get('/featured', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/product/featured');
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/top-rated', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/product/top-rated');
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/new-arrivals', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        '/v1/products/product/new-arrivals',
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/on-sale', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/product/on-sale');
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Get all products with filters
  router.get('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/product', {
        params: req.query,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/product/${req.params.id}`,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id/similar', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/product/${req.params.id}/similar`,
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

  //   Product-service
  // Get low stock
  router.get('/low-stock', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        '/v1/products/product/low-stock',
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

  // Create product (Admin)
  router.post('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.post(
        '/v1/products/product/',
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

  //Update product
  router.put('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.put(
        `/v1/products/product/${req.params.id}`,
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

  // Patch product (Admin)
  router.patch('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.patch(
        `/v1/products/product/${req.params.id}`,
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

  // Delete product (Admin)
  router.delete('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.delete(
        `/v1/products/product/${req.params.id}`,
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
