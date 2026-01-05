import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ServiceClient } from '../utils/serviceClient.js';
import config from '../config/environment.js';

const router = Router();

export const createUserRoutes = () => {
  const userServiceClient = new ServiceClient(config.services.userService);

  // Public routes
  router.post('/auth/login', async (req, res, next) => {
    try {
      const response = await userServiceClient.post('/auth/login', req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/auth/register', async (req, res, next) => {
    try {
      const response = await userServiceClient.post('/auth/register', req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/auth/logout', async (req, res, next) => {
    try {
      const response = await userServiceClient.post('/auth/logout', {});
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/auth/refresh-token', async (req, res, next) => {
    try {
      const response = await userServiceClient.post(
        '/auth/refresh-token',
        req.body
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // Protected routes
  router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      userServiceClient.setAuthToken(token);
      const response = await userServiceClient.get('/profile');
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.put('/profile', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      userServiceClient.setAuthToken(token);
      const response = await userServiceClient.put('/profile', req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post('/change-password', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      userServiceClient.setAuthToken(token);
      const response = await userServiceClient.post(
        '/change-password',
        req.body
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
