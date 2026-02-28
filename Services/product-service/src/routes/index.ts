import { Router } from 'express';
import productRoutes from './product.route.js';
import categoryRoutes from './category.route.js';
import brandRoutes from './brand.route.js';
import tagRoutes from './tag.route.js';
import reviewRoutes from './review.route.js';
import imageRoutes from './image.route.js';
import searchRoutes from './search.route.js';

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
router.use('/product', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/tags', tagRoutes);
router.use('/reviews', reviewRoutes);
router.use('/images', imageRoutes);
router.use('/search', searchRoutes);


// export default router;

export default router;
