import { Router } from 'express';
import { TagController } from '../controllers/tagController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const tagRoutes = Router();
const tagController = new TagController();

tagRoutes.get('/', asyncHandler(tagController.getAllTags));
tagRoutes.get('/:id', asyncHandler(tagController.getTagById));
tagRoutes.post('/', asyncHandler(tagController.createTag)); // Admin only
tagRoutes.put('/:id', asyncHandler(tagController.updateTag)); // Admin only
tagRoutes.delete('/:id', asyncHandler(tagController.deleteTag)); // Admin only
tagRoutes.get('/:id/products', asyncHandler(tagController.getProductsByTag));

export default tagRoutes;
