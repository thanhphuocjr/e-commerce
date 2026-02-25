import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const reviewRoutes = Router();
const reviewController = new ReviewController();

reviewRoutes.get('/recent', asyncHandler(reviewController.getRecentReviews));
reviewRoutes.get('/', asyncHandler(reviewController.getAllReviews)); // Admin only
reviewRoutes.get('/:id', asyncHandler(reviewController.getReviewById));
reviewRoutes.post('/', asyncHandler(reviewController.createReview)); // User/Admin
reviewRoutes.put('/:id', asyncHandler(reviewController.updateReview)); // User/Admin
reviewRoutes.delete('/:id', asyncHandler(reviewController.deleteReview)); // User/Admin
reviewRoutes.get(
  '/product/:productId',
  asyncHandler(reviewController.getReviewsByProduct),
);

export default reviewRoutes;
