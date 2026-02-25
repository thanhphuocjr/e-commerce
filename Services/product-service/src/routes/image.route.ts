import { Router } from 'express';
import { ImageController } from '../controllers/imageController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const imageRoutes = Router();
const imageController = new ImageController();

imageRoutes.get(
  '/product/:productId',
  asyncHandler(imageController.getImagesByProduct),
);
imageRoutes.post('/product/:productId', asyncHandler(imageController.createImages)); // Admin only
imageRoutes.put('/:id', asyncHandler(imageController.updateImage)); // Admin only
imageRoutes.delete('/:id', asyncHandler(imageController.deleteImage)); // Admin only
imageRoutes.put(
  '/product/:productId/order',
  asyncHandler(imageController.updateImageOrder),
); // Admin only

export default imageRoutes;
