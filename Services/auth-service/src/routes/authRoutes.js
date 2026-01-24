import { Router } from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

export const createAuthRoutes = () => {
  /* ===================== PUBLIC ===================== */

  // POST /v1/auth/create-tokens
  router.post('/create-tokens', authController.createTokens);

  // POST /v1/auth/verify-token
  router.post('/verify-token', authController.verifyAccessToken);

  // POST /v1/auth/refresh-token
  router.post('/refresh-token', authController.refreshAccessToken);

  // POST /v1/auth/revoke-token
  router.post('/revoke-token', authController.revokeToken);

  /* ===================== PROTECTED ===================== */

  // POST /v1/auth/revoke-all (logout all devices)
  router.post('/revoke-all', authMiddleware, authController.revokeAllTokens);

  // GET /v1/auth/tokens/:userId (get user's active tokens)
  router.get('/tokens/:userId', authMiddleware, authController.getUserTokens);

  return router;
};

export default router;
