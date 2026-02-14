import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return ApiResponse.success(res, categories);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(
        parseInt(id as string),
      );

      if (!category) {
        throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
      }

      return ApiResponse.success(res, category);
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      return ApiResponse.created(
        res,
        category,
        'Category created successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.updateCategory(
        parseInt(id as string),
        req.body,
      );

      if (!category) {
        throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
      }

      return ApiResponse.success(
        res,
        category,
        'Category updated successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.categoryService.deleteCategory(
        parseInt(id as string),
      );

      if (!deleted) {
        throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found');
      }

      return ApiResponse.success(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getCategoryStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const stats = await this.categoryService.getCategoryStats();
      return ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  };

  getProductsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await this.categoryService.getProductsByCategory(
        parseInt(id as string),
        parseInt(page as string),
        parseInt(limit as string),
      );

      return ApiResponse.success(res, result.data, 'Success', {
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };
}
