// routes/category.routes.ts
import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
const categoryController = new CategoryController();

router.get('/stats', asyncHandler(categoryController.getCategoryStats)); // Admin only
router.get('/', asyncHandler(categoryController.getAllCategories));
router.get('/:id', asyncHandler(categoryController.getCategoryById));
router.post('/', asyncHandler(categoryController.createCategory)); // Admin only
router.put('/:id', asyncHandler(categoryController.updateCategory)); // Admin only
router.delete('/:id', asyncHandler(categoryController.deleteCategory)); // Admin only
router.get(
  '/:id/products',
  asyncHandler(categoryController.getProductsByCategory),
);

export default router;
