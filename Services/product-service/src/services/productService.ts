// services/ProductService.ts
import { getPool } from '../config/database.js';
import type {
  Product,
  ProductWithDetails,
  ProductFilter,
  PaginationParams,
  PaginatedResult,
} from '../models/types.js';

export class ProductService {
  private get pool() {
    return getPool();
  }

  /**
   * Lấy danh sách sản phẩm với filter và pagination
   */
  async getProducts(
    filter: ProductFilter = {},
    pagination: PaginationParams = { page: 1, limit: 20 },
  ): Promise<PaginatedResult<ProductWithDetails>> {
    const page = pagination.page || 1;
    const limit = Math.min(pagination.limit || 20, 100); // Max 100
    const offset = (page - 1) * limit;
    const sortBy = this.validateSortBy(pagination.sortBy) || 'created_at';
    const sortOrder = pagination.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    let whereConditions: string[] = [];
    let params: any[] = [];

    // Build WHERE clause
    if (filter.category) {
      whereConditions.push('c.name = ?');
      params.push(filter.category);
    }

    if (filter.brand) {
      whereConditions.push('b.name = ?');
      params.push(filter.brand);
    }

    if (filter.minPrice !== undefined) {
      whereConditions.push('p.price >= ?');
      params.push(filter.minPrice);
    }

    if (filter.maxPrice !== undefined) {
      whereConditions.push('p.price <= ?');
      params.push(filter.maxPrice);
    }

    if (filter.minRating !== undefined) {
      whereConditions.push('p.rating >= ?');
      params.push(filter.minRating);
    }

    if (filter.inStock) {
      whereConditions.push(
        "p.stock > 0 AND p.availability_status = 'In Stock'",
      );
    }

    if (filter.search) {
      whereConditions.push('(p.title LIKE ? OR p.description LIKE ?)');
      params.push(`%${filter.search}%`, `%${filter.search}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    // Get total count
    const [countResult]: any = await this.pool.execute(
      `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ${whereClause}
    `,
      params,
    );
    const total = countResult[0].total;

    // Get data
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        ROUND(p.price * (1 - p.discount_percentage/100), 2) as sale_price,
        GROUP_CONCAT(DISTINCT t.name ORDER BY t.name) as tags
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset],
    );

    const data = rows.map((row: any) => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : [],
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết sản phẩm
   */
  async getProductById(id: number): Promise<ProductWithDetails | null> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        c.description as category_description,
        b.name as brand_name,
        b.description as brand_description,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        ROUND(p.price * (1 - p.discount_percentage/100), 2) as sale_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `,
      [id],
    );

    if (rows.length === 0) return null;

    // Get tags
    const [tags]: any = await this.pool.execute(
      `
      SELECT t.name
      FROM tags t
      JOIN product_tags pt ON t.id = pt.tag_id
      WHERE pt.product_id = ?
    `,
      [id],
    );

    // Get images
    const [images]: any = await this.pool.execute(
      `
      SELECT id, image_url as url, display_order
      FROM product_images
      WHERE product_id = ?
      ORDER BY display_order
    `,
      [id],
    );

    // Get review distribution
    const [reviewDist]: any = await this.pool.execute(
      `
      SELECT 
        rating,
        COUNT(*) as count
      FROM reviews
      WHERE product_id = ?
      GROUP BY rating
      ORDER BY rating DESC
    `,
      [id],
    );

    const distribution: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewDist.forEach((r: any) => {
      distribution[r.rating] = r.count;
    });

    const product = rows[0];
    return {
      ...product,
      category: {
        id: product.category_id,
        name: product.category_name,
        description: product.category_description,
      },
      brand: product.brand_id
        ? {
            id: product.brand_id,
            name: product.brand_name,
            description: product.brand_description,
          }
        : null,
      dimensions: {
        width: product.width,
        height: product.height,
        depth: product.depth,
      },
      tags: tags.map((t: any) => t.name),
      images: images,
      reviews: {
        average: parseFloat(product.avg_rating),
        count: product.review_count,
        distribution,
      },
    };
  }

  /**
   * Tạo sản phẩm mới
   */
  async createProduct(productData: any): Promise<ProductWithDetails> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insert product
      const [result]: any = await connection.execute(
        `INSERT INTO products (
          title, description, category_id, brand_id, price,
          discount_percentage, stock, sku, weight, width, height, depth,
          warranty_information, shipping_information, availability_status,
          return_policy, minimum_order_quantity, thumbnail
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.title,
          productData.description,
          productData.category_id,
          productData.brand_id,
          productData.price,
          productData.discount_percentage || 0,
          productData.stock || 0,
          productData.sku,
          productData.weight,
          productData.dimensions?.width,
          productData.dimensions?.height,
          productData.dimensions?.depth,
          productData.warranty_information,
          productData.shipping_information,
          productData.availability_status || 'In Stock',
          productData.return_policy,
          productData.minimum_order_quantity || 1,
          productData.thumbnail,
        ],
      );

      const productId = result.insertId;

      // Insert tags
      if (productData.tags && productData.tags.length > 0) {
        for (const tagName of productData.tags) {
          const [tagResult]: any = await connection.execute(
            'INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
            [tagName],
          );
          const tagId = tagResult.insertId;

          await connection.execute(
            'INSERT INTO product_tags (product_id, tag_id) VALUES (?, ?)',
            [productId, tagId],
          );
        }
      }

      // Insert images
      if (productData.images && productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          await connection.execute(
            'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
            [productId, productData.images[i], i],
          );
        }
      }

      await connection.commit();

      // Return created product
      const product = await this.getProductById(productId);
      return product!;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  async updateProduct(
    id: number,
    productData: Partial<any>,
  ): Promise<ProductWithDetails | null> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Build update query
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      const allowedFields = [
        'title',
        'description',
        'category_id',
        'brand_id',
        'price',
        'discount_percentage',
        'stock',
        'sku',
        'weight',
        'warranty_information',
        'shipping_information',
        'availability_status',
        'return_policy',
        'minimum_order_quantity',
        'thumbnail',
      ];

      allowedFields.forEach((field) => {
        if (productData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateValues.push(productData[field]);
        }
      });

      // Update dimensions separately
      if (productData.dimensions) {
        if (productData.dimensions.width !== undefined) {
          updateFields.push('width = ?');
          updateValues.push(productData.dimensions.width);
        }
        if (productData.dimensions.height !== undefined) {
          updateFields.push('height = ?');
          updateValues.push(productData.dimensions.height);
        }
        if (productData.dimensions.depth !== undefined) {
          updateFields.push('depth = ?');
          updateValues.push(productData.dimensions.depth);
        }
      }

      if (updateFields.length > 0) {
        updateValues.push(id);
        await connection.execute(
          `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues,
        );
      }

      // Update tags if provided
      if (productData.tags) {
        await connection.execute(
          'DELETE FROM product_tags WHERE product_id = ?',
          [id],
        );

        for (const tagName of productData.tags) {
          const [tagResult]: any = await connection.execute(
            'INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
            [tagName],
          );
          const tagId = tagResult.insertId;

          await connection.execute(
            'INSERT INTO product_tags (product_id, tag_id) VALUES (?, ?)',
            [id, tagId],
          );
        }
      }

      await connection.commit();

      return await this.getProductById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(id: number): Promise<boolean> {
    const [result]: any = await this.pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }

  /**
   * Lấy sản phẩm tương tự
   */
  async getSimilarProducts(
    productId: number,
    limit: number = 5,
  ): Promise<ProductWithDetails[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p2.*,
        c.name as category_name,
        b.name as brand_name,
        ROUND(p2.price * (1 - p2.discount_percentage/100), 2) as sale_price
      FROM products p1
      JOIN products p2 ON p1.category_id = p2.category_id 
        AND p2.id != p1.id
        AND ABS(p2.price - p1.price) <= (p1.price * 0.3)
      LEFT JOIN categories c ON p2.category_id = c.id
      LEFT JOIN brands b ON p2.brand_id = b.id
      WHERE p1.id = ? AND p2.stock > 0
      ORDER BY ABS(p2.price - p1.price), p2.rating DESC
      LIMIT ?
    `,
      [productId, limit],
    );

    return rows;
  }

  /**
   * Lấy sản phẩm đánh giá cao
   */
  async getTopRatedProducts(limit: number = 10): Promise<ProductWithDetails[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        ROUND(p.price * (1 - p.discount_percentage/100), 2) as sale_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.stock > 0
      GROUP BY p.id
      HAVING review_count > 0
      ORDER BY avg_rating DESC, review_count DESC
      LIMIT ?
    `,
      [limit],
    );

    return rows;
  }

  /**
   * Lấy sản phẩm mới
   */
  async getNewArrivals(limit: number = 10): Promise<ProductWithDetails[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        ROUND(p.price * (1 - p.discount_percentage/100), 2) as sale_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.stock > 0
      ORDER BY p.created_at DESC
      LIMIT ?
    `,
      [limit],
    );

    return rows;
  }

  /**
   * Lấy sản phẩm đang giảm giá
   */
  async getProductsOnSale(
    pagination: PaginationParams = { page: 1, limit: 20 },
  ): Promise<PaginatedResult<ProductWithDetails>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;

    const [countResult]: any = await this.pool.execute(
      'SELECT COUNT(*) as total FROM products WHERE discount_percentage > 0 AND stock > 0',
    );
    const total = countResult[0].total;

    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        ROUND(p.price * (1 - p.discount_percentage/100), 2) as sale_price,
        ROUND(p.price * p.discount_percentage/100, 2) as discount_amount
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.discount_percentage > 0 AND p.stock > 0
      ORDER BY p.discount_percentage DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset],
    );

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy sản phẩm sắp hết hàng
   */
  async getLowStockProducts(
    threshold: number = 10,
    limit: number = 20,
  ): Promise<ProductWithDetails[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.stock > 0 AND p.stock <= ?
      ORDER BY p.stock ASC
      LIMIT ?
    `,
      [threshold, limit],
    );

    return rows;
  }

  /**
   * Validate sortBy field
   */
  private validateSortBy(sortBy?: string): string | undefined {
    const allowedFields = ['price', 'rating', 'created_at', 'title', 'stock'];
    return sortBy && allowedFields.includes(sortBy) ? sortBy : undefined;
  }
}
