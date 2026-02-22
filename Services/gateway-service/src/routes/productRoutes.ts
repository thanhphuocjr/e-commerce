import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/auth';
import { ServiceClient } from '../utils/serviceClient';
import config from '../config/environment';

const router = Router();

export const createProductRoutes = () => {
  const productServiceClient = new ServiceClient(
    config.services.productService,
  );

  const authServiceClient = new ServiceClient(config.services.authService);
};
