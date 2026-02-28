import { Router } from 'express';
import { ServiceClient } from '../../utils/serviceClient';
import config from '../../config/environment';

export const createSearchRoutes = () => {
  const router = Router();

  const productServiceClient = new ServiceClient(
    config.services.productService,
  );

  /* ===================== PUBLIC ROUTES ===================== */

  // Search products (filters, keyword, pagination...)
  router.get('/', async (req, res, next) => {
    try {
      const response = await productServiceClient.get('/v1/products/search', {
        params: req.query,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Search suggestions (autocomplete)
  router.get('/suggestions', async (req, res, next) => {
    try {
      const response = await productServiceClient.get(
        '/v1/products/search/suggestions',
        {
          params: req.query,
        },
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
