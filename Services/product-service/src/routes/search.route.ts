// routes/search.routes.ts
import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const searchRoutes = Router();
const productController = new ProductController();
searchRoutes.get('/', asyncHandler(productController.getProducts));
searchRoutes.get('/suggestions', async (req, res) => {
  const { q, limit = 10 } = req.query;
  res.json({
    success: true,
    data: {
      products: [],
      categories: [],
      brands: [],
      tags: [],
    },
  });
});

export default searchRoutes;
