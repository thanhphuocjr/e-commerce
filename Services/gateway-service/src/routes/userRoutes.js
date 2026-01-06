import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ServiceClient } from '../utils/serviceClient.js';
import config from '../config/environment.js';

const router = Router();

export const createUserRoutes = () => {
  const userServiceClient = new ServiceClient(config.services.userService);

  /* ===================== AUTH (PUBLIC) ===================== */

  // POST /api/v1/users/login
  router.post('/login', async (req, res, next) => {
    try {
      const response = await userServiceClient.post(
        '/v1/users/login',
        req.body
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/v1/users/register
  router.post('/register', async (req, res, next) => {
    try {
      const response = await userServiceClient.post('/v1/users/register', req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/v1/users/logout
  router.post('/logout', async (req, res, next) => {
    try {
      const response = await userServiceClient.post('/v1/users/logout', {});
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/v1/users/refresh
  router.post('/refresh', async (req, res, next) => {
    try {
      const response = await userServiceClient.post('/v1/users/refresh', req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  /* ===================== PROTECTED ===================== */

  // GET /api/v1/users/profile
  router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      userServiceClient.setAuthToken(token);
      const response = await userServiceClient.get('v1/users/profile');
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // PATCH /api/v1/users/change-password
  router.patch('/change-password', authMiddleware, async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      userServiceClient.setAuthToken(token);

      const response = await userServiceClient.patch(
        '/v1/users/change-password',
        req.body
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
