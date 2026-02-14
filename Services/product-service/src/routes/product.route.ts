import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const productRouter = Router();
const productController = new ProductController();

// Special routes first (before :id)
productRouter.get(
  '/featured',
  asyncHandler(productController.getTopRatedProducts),
);
productRouter.get(
  '/top-rated',
  asyncHandler(productController.getTopRatedProducts),
);
productRouter.get(
  '/new-arrivals',
  asyncHandler(productController.getNewArrivals),
);
productRouter.get(
  '/on-sale',
  asyncHandler(productController.getProductsOnSale),
);
productRouter.get(
  '/low-stock',
  asyncHandler(productController.getLowStockProducts),
); // Admin only

// CRUD routes
productRouter.get('/', asyncHandler(productController.getProducts));
productRouter.get('/:id', asyncHandler(productController.getProductById));
productRouter.post('/', asyncHandler(productController.createProduct)); // Admin only
productRouter.put('/:id', asyncHandler(productController.updateProduct)); // Admin only
productRouter.patch('/:id', asyncHandler(productController.patchProduct)); // Admin only

productRouter.delete('/:id', asyncHandler(productController.deleteProduct)); // Admin only

// Related routes
productRouter.get(
  '/:id/similar',
  asyncHandler(productController.getSimilarProducts),
);

export default productRouter;
