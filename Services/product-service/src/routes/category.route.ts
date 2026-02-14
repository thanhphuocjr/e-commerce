// routes/category.routes.ts
import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const categoryRoute = Router();
const categoryController = new CategoryController();

categoryRoute.get('/stats', asyncHandler(categoryController.getCategoryStats)); // Admin only
categoryRoute.get('/', asyncHandler(categoryController.getAllCategories));
categoryRoute.get('/:id', asyncHandler(categoryController.getCategoryById));
categoryRoute.post('/', asyncHandler(categoryController.createCategory)); // Admin only
categoryRoute.put('/:id', asyncHandler(categoryController.updateCategory)); // Admin only
categoryRoute.delete('/:id', asyncHandler(categoryController.deleteCategory)); // Admin only
categoryRoute.get(
  '/:id/products',
  asyncHandler(categoryController.getProductsByCategory),
);

export default categoryRoute;
