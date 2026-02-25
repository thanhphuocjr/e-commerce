import { Router } from 'express';
import { BrandController } from '../controllers/brandController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const brandRoutes = Router();
const brandController = new BrandController();

brandRoutes.get('/stats', asyncHandler(brandController.getBrandStats)); // Admin only
brandRoutes.get('/', asyncHandler(brandController.getAllBrands));
brandRoutes.get('/:id', asyncHandler(brandController.getBrandById));
brandRoutes.post('/', asyncHandler(brandController.createBrand)); // Admin only
brandRoutes.put('/:id', asyncHandler(brandController.updateBrand)); // Admin only
brandRoutes.delete('/:id', asyncHandler(brandController.deleteBrand)); // Admin only

export default brandRoutes;
