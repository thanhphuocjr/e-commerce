// controllers/ProductController.ts
import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * GET /products
   * Lấy danh sách sản phẩm với filter và pagination
   */
  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy,
        sortOrder,
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        tags,
        search,
      } = req.query;

      const filter = {
        category: category as string,
        brand: brand as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minRating: minRating ? parseFloat(minRating as string) : undefined,
        inStock: inStock === 'true',
        tags: tags
          ? Array.isArray(tags)
            ? (tags as string[])
            : [tags as string]
          : undefined,
        search: search as string,
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      };

      const result = await this.productService.getProducts(filter, pagination);

      return ApiResponse.success(res, result.data, 'Success', {
        pagination: {
          ...result.pagination,
          hasNext: result.pagination.page < result.pagination.totalPages,
          hasPrev: result.pagination.page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /products/:id
   * Lấy chi tiết sản phẩm
   */
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'INVALID_ID', 'Product ID is required');
      }
      const product = await this.productService.getProductById(
        parseInt(id as string),
      );

      if (!product) {
        throw new ApiError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
      }

      return ApiResponse.success(res, product);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /products
   * Tạo sản phẩm mới
   */
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.createProduct(req.body);
      return ApiResponse.created(res, product, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /products/:id
   * Cập nhật sản phẩm
   */
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'INVALID_ID', 'Product ID is required');
      }
      const product = await this.productService.updateProduct(
        parseInt(id as string),
        req.body,
      );

      if (!product) {
        throw new ApiError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
      }

      return ApiResponse.success(res, product, 'Success');
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /products/:id
   * Cập nhật một phần sản phẩm
   */
  patchProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'INVALID_ID', 'Product ID is required');
      }
      const product = await this.productService.updateProduct(
        parseInt(id as string),
        req.body,
      );

      if (!product) {
        throw new ApiError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
      }

      return ApiResponse.success(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /products/:id
   * Xóa sản phẩm
   */
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'INVALID_ID', 'Product ID is required');
      }
      const deleted = await this.productService.deleteProduct(
        parseInt(id as string),
      );

      if (!deleted) {
        throw new ApiError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
      }

      return ApiResponse.success(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /products/:id/similar
   * Lấy sản phẩm tương tự
   */
  getSimilarProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { limit = 5 } = req.query;
      if (!id) {
        throw new ApiError(400, 'INVALID_ID', 'Product ID is required');
      }
      const products = await this.productService.getSimilarProducts(
        parseInt(id as string),
        parseInt(limit as string),
      );

      return ApiResponse.success(res, products);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /products/top-rated
   * Lấy sản phẩm đánh giá cao nhất
   */
  getTopRatedProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { limit = 10 } = req.query;

      const parsedLimit =
        typeof limit === 'string' && !isNaN(Number(limit)) ? Number(limit) : 10;

      const products =
        await this.productService.getTopRatedProducts(parsedLimit);

      return ApiResponse.success(res, products);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /products/new-arrivals
   * Lấy sản phẩm mới
   */
  getNewArrivals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 10 } = req.query;
      const products = await this.productService.getNewArrivals(
        parseInt(limit as string),
      );

      return ApiResponse.success(res, products);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /products/on-sale
   * Lấy sản phẩm đang giảm giá
   */
  getProductsOnSale = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page = 1, limit = 20 } = req.query;

      const result = await this.productService.getProductsOnSale({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      return ApiResponse.success(res, result.data, 'Success', {
        pagination: {
          ...result.pagination,
          hasNext: result.pagination.page < result.pagination.totalPages,
          hasPrev: result.pagination.page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /products/low-stock
   * Lấy sản phẩm sắp hết hàng (Admin only)
   */
  getLowStockProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { threshold = 10, limit = 20 } = req.query;

      const products = await this.productService.getLowStockProducts(
        parseInt(threshold as string),
        parseInt(limit as string),
      );

      return ApiResponse.success(res, products);
    } catch (error) {
      next(error);
    }
  };
}
