import type { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/tagService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class TagController {
  private tagService: TagService;
  constructor() {
    this.tagService = new TagService();
  }
  getAllTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await this.tagService.getAllTags();
      return ApiResponse.success(res, tags);
    } catch (error) {
      next(error);
    }
  };
  getTagById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tag = await this.tagService.getTagById(parseInt(id as string));
      if (!tag) {
        throw new ApiError(404, 'TAG_NOT_FOUND', 'tag not found');
      }
      return ApiResponse.success(res, tag);
    } catch (error) {
      next(error);
    }
  };

  createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag = await this.tagService.createTag(req.body);
      return ApiResponse.created(res, tag, 'Tag created successfully');
    } catch (error) {
      next(error);
    }
  };

  updateTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const tag = await this.tagService.updateTag(
        parseInt(id as string),
        req.body,
      );

      if (!tag) {
        throw new ApiError(404, 'TAG_NOT_FOUND', 'Tag not found');
      }

      return ApiResponse.success(res, tag, 'Tag updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.tagService.deleteTag(parseInt(id as string));

      if (!deleted) {
        throw new ApiError(404, 'TAG_NOT_FOUND', 'Tag not found');
      }

      return ApiResponse.success(res, null, 'Tag deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getProductsByTag = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await this.tagService.getProductsByTag(
        parseInt(id as string),
        parseInt(page as string),
        parseInt(limit as string),
      );

      return ApiResponse.success(
        res,
        result.data,
        'Get products by tag successfully',
        {
          pagination: result.pagination,
        },
      );
    } catch (error) {
      next(error);
    }
  };
}
