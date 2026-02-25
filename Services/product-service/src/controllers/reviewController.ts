import { ReviewService } from '../services/reviewService.js';
import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 20 } = req.query;

      const result = await this.reviewService.getAllReviews(
        parseInt(page as string),
        parseInt(limit as string),
      );

      return ApiResponse.success(
        res,
        result.data,
        'Get all reviews successfully!',
        {
          pagination: result.pagination,
        },
      );
    } catch (error) {
      next(error);
    }
  };

  getReviewById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const review = await this.reviewService.getReviewById(
        parseInt(id as string),
      );

      if (!review) {
        throw new ApiError(404, 'REVIEW_NOT_FOUND', 'Review not found');
      }

      return ApiResponse.success(res, review);
    } catch (error) {
      next(error);
    }
  };

  getReviewsByProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10, rating } = req.query;

      const result = await this.reviewService.getReviewsByProduct(
        parseInt(productId as string),
        parseInt(page as string),
        parseInt(limit as string),
        rating ? parseInt(rating as string) : undefined,
      );

      return ApiResponse.success(
        res,
        result.data,
        'get review by product successfully!',
        {
          pagination: result.pagination,
          summary: result.summary,
        },
      );
    } catch (error) {
      next(error);
    }
  };

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.createReview(req.body);
      return ApiResponse.created(res, review, 'Review created successfully');
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const review = await this.reviewService.updateReview(
        parseInt(id as string),
        req.body,
      );

      if (!review) {
        throw new ApiError(404, 'REVIEW_NOT_FOUND', 'Review not found');
      }

      return ApiResponse.success(res, review, 'Review updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.reviewService.deleteReview(
        parseInt(id as string),
      );

      if (!deleted) {
        throw new ApiError(404, 'REVIEW_NOT_FOUND', 'Review not found');
      }

      return ApiResponse.success(res, null, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getRecentReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { limit = 10 } = req.query;
      const reviews = await this.reviewService.getRecentReviews(
        parseInt(limit as string),
      );
      return ApiResponse.success(res, reviews);
    } catch (error) {
      next(error);
    }
  };
}
