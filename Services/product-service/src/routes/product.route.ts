import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
const productController = new ProductController();

// Special routes first (before :id)
router.get('/featured', asyncHandler(productController.getTopRatedProducts));
router.get('/top-rated', asyncHandler(productController.getTopRatedProducts));
router.get('/new-arrivals', asyncHandler(productController.getNewArrivals));
router.get('/on-sale', asyncHandler(productController.getProductsOnSale));
router.get('/low-stock', asyncHandler(productController.getLowStockProducts)); // Admin only

// CRUD routes
router.get('/', asyncHandler(productController.getProducts));
router.get('/:id', asyncHandler(productController.getProductById));
router.post('/', asyncHandler(productController.createProduct)); // Admin only
router.put('/:id', asyncHandler(productController.updateProduct)); // Admin only
router.patch('/:id', asyncHandler(productController.patchProduct)); // Admin only
router.delete('/:id', asyncHandler(productController.deleteProduct)); // Admin only

// Related routes
router.get('/:id/similar', asyncHandler(productController.getSimilarProducts));

export default router;
