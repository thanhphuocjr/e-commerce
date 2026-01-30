import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ServiceClient } from '../utils/serviceClient.js';
import config from '../config/environment.js';

const router = Router();

export const createUserRoutes = () => {
  const userServiceClient = new ServiceClient(config.services.userService);
  const authServiceClient = new ServiceClient(config.services.authService);

  /* ===================== AUTH (PUBLIC) ===================== */

  // POST /api/users/login
  // Quy trình: Gateway -> User Service (xác thực) -> Auth Service (tạo token)
  router.post('/login', async (req, res, next) => {
    try {
      const userResponse = await userServiceClient.post(
        '/v1/users/login',
        req.body,
      );
      const tokenResponse = await authServiceClient.post(
        '/v1/auth/create-tokens',
        {
          user: {
            id: userResponse.data.id,
            email: userResponse.data.email,
            role: userResponse.data.role,
          },
        },
      );
      console.log('Auth service response:', tokenResponse.data);

      res.json({
        success: userResponse.success,
        message: userResponse.message,
        data: {
          user: userResponse.data,
          ...tokenResponse.data,
        },
      });
    } catch (error) {
      console.error(
        'Error in login route:',
        error.response?.data || error.message,
      );
      next(error);
    }
  });

  // POST /api/users/register
  router.post('/register', async (req, res, next) => {
    try {
      const response = await userServiceClient.post(
        '/v1/users/register',
        req.body,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/users/logout
  router.post('/logout', async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const response = await authServiceClient.post('/v1/auth/revoke-token', {
        refreshToken,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/users/refresh
  // Làm mới access token bằng refresh token
  router.post('/refresh', async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      // Gọi Auth Service để tạo access token mới
      const tokenResponse = await authServiceClient.post(
        '/v1/auth/refresh-token',
        {
          refreshToken,
        },
      );

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokenResponse.data,
      });
    } catch (error) {
      next(error);
    }
  });

  /* ===================== PROTECTED ===================== */

  // GET /api/users/profile
  router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
      const response = await userServiceClient.get('/v1/users/profile', {
        headers: {
          'x-user-id': req.user.id,
          'x-user-email': req.user.email,
          'x-user-role': req.user.role,
        },
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  // PATCH /api/users/change-password
  router.patch('/change-password', authMiddleware, async (req, res, next) => {
    try {
      const response = await userServiceClient.patch(
        '/v1/users/change-password',
        req.body,
        {
          headers: {
            'x-user-id': req.user.id,
            'x-user-email': req.user.email,
            'x-user-role': req.user.role,
          },
        },
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
