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

// Mount routes
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/brands', brandRoutes);
// router.use('/tags', tagRoutes);
// router.use('/reviews', reviewRoutes);
// router.use('/images', imageRoutes);
// router.use('/search', searchRoutes);

// export default router;

export default router;
