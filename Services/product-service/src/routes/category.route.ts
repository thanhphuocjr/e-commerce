import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.get('/stats', asyncHandler(categoryController.getCategoryStats)); // Admin only
categoryRoutes.get('/', asyncHandler(categoryController.getAllCategories));
categoryRoutes.get('/:id', asyncHandler(categoryController.getCategoryById));
categoryRoutes.post('/', asyncHandler(categoryController.createCategory)); // Admin only
categoryRoutes.put('/:id', asyncHandler(categoryController.updateCategory)); // Admin only
categoryRoutes.delete('/:id', asyncHandler(categoryController.deleteCategory)); // Admin only
categoryRoutes.get(
  '/:id/products',
  asyncHandler(categoryController.getProductsByCategory),
);

export default categoryRoutes;
