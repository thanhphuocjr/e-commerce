import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const productRoutes = Router();
const productController = new ProductController();

// Special routes first (before :id)
productRoutes.get(
  '/featured',
  asyncHandler(productController.getTopRatedProducts),
);
productRoutes.get(
  '/top-rated',
  asyncHandler(productController.getTopRatedProducts),
);
productRoutes.get(
  '/new-arrivals',
  asyncHandler(productController.getNewArrivals),
);
productRoutes.get(
  '/on-sale',
  asyncHandler(productController.getProductsOnSale),
);
productRoutes.get(
  '/low-stock',
  asyncHandler(productController.getLowStockProducts),
); // Admin only

// CRUD routes
productRoutes.get('/', asyncHandler(productController.getProducts));
productRoutes.get('/:id', asyncHandler(productController.getProductById));
productRoutes.post('/', asyncHandler(productController.createProduct)); // Admin only
productRoutes.put('/:id', asyncHandler(productController.updateProduct)); // Admin only
productRoutes.patch('/:id', asyncHandler(productController.patchProduct)); // Admin only

productRoutes.delete('/:id', asyncHandler(productController.deleteProduct)); // Admin only

// Related routes
productRoutes.get(
  '/:id/similar',
  asyncHandler(productController.getSimilarProducts),
);

export default productRoutes;
