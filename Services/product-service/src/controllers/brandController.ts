import type { Request, Response, NextFunction } from 'express';
import { BrandService } from '../services/brandService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
export class BrandController {
  private brandService: BrandService;
  constructor() {
    this.brandService = new BrandService();
  }

  getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brands = await this.brandService.getAllBrands();
      return ApiResponse.success(res, brands);
    } catch (error) {
      next(error);
    }
  };
  getBrandById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const brand = await this.brandService.getBrandById(
        parseInt(id as string),
      );

      if (!brand) {
        throw new ApiError(404, 'BRAND_NOT_FOUND', 'brand not found');
      }

      return ApiResponse.success(res, brand);
    } catch (error) {
      next(error);
    }
  };

  createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brand = await this.brandService.createBrand(req.body);
      return ApiResponse.created(res, brand, 'Brand created successfully');
    } catch (error) {
      next(error);
    }
  };

  updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const brand = await this.brandService.updateBrand(
        parseInt(id as string),
        req.body,
      );

      if (!brand) {
        throw new ApiError(404, 'BRAND_NOT_FOUND', 'Brand not found');
      }

      return ApiResponse.success(res, brand, 'Brand updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.brandService.deleteBrand(
        parseInt(id as string),
      );

      if (!deleted) {
        throw new ApiError(404, 'BRAND_NOT_FOUND', 'Brand not found');
      }

      return ApiResponse.success(res, null, 'Brand deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getBrandStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.brandService.getBrandStats();
      return ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  };
}
