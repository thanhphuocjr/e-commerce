import { Router } from 'express';

const router = Router();
console.log('[ROUTES] product router loaded');
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'index.ts',
    timestamp: new Date().toISOString(),
  });
});

export default router;
