import { Router } from 'express';
import { authMiddleware, authorize } from '../../middleware/auth';
import { ServiceClient } from '../../utils/serviceClient';
import config from '../../config/environment';

export const createImageRoutes = () => {
  const router = Router();

  const productServiceClient = new ServiceClient(
    config.services.productService,
  );

  /* ===================== PUBLIC ROUTES ===================== */

  // Get images by product
  router.get('/:productId', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        `/v1/products/images/product/${req.params.productId}`,
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

  // Create images for product (Admin)
  router.post('/:productId', async (req, res, next) => {
    try {
      const response = await productServiceClient.post(
        `/v1/products/images/product/${req.params.productId}`,
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

  // Update single image (Admin)
  router.put('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.put(
        `/v1/products/images/${req.params.id}`,
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

  // Delete image (Admin)
  router.delete('/:id', async (req, res, next) => {
    try {
      const response = await productServiceClient.delete(
        `/v1/products/images/${req.params.id}`,
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

  // Update image order (Admin)
  router.put('/:productId/order', async (req, res, next) => {
    try {
      const response = await productServiceClient.put(
        `/v1/products/images/product/${req.params.productId}/order`,
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

  return router;
};
