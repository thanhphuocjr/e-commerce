import { ImageService } from '../services/imageService.js';
import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ImageController {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  getImagesByProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const images = await this.imageService.getImagesByProduct(
        parseInt(productId as string),
      );
      return ApiResponse.success(res, images);
    } catch (error) {
      next(error);
    }
  };

  createImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { images } = req.body; 

      if (!images || !Array.isArray(images)) {
        throw new ApiError(400, 'INVALID_INPUT', 'Images array is required');
      }

      const createdImages = await this.imageService.createImages(
        parseInt(productId as string),
        images,
      );
      return ApiResponse.created(
        res,
        createdImages,
        'Images uploaded successfully',
      );
    } catch (error) {
      next(error);
    }
  };

  updateImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const image = await this.imageService.updateImage(
        parseInt(id as string),
        req.body,
      );

      if (!image) {
        throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found');
      }

      return ApiResponse.success(res, image, 'Image updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.imageService.deleteImage(
        parseInt(id as string),
      );

      if (!deleted) {
        throw new ApiError(404, 'IMAGE_NOT_FOUND', 'Image not found');
      }

      return ApiResponse.success(res, null, 'Image deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  updateImageOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { productId } = req.params;
      const { orders } = req.body; // Array of {id, order}

      if (!orders || !Array.isArray(orders)) {
        throw new ApiError(400, 'INVALID_INPUT', 'Orders array is required');
      }

      await this.imageService.updateImageOrder(
        parseInt(productId as string),
        orders,
      );
      return ApiResponse.success(res, null, 'Image order updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
