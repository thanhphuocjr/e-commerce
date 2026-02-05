// repositories/ProductRepository.ts
import { getPool } from '../config/database.js';
import type {
  Product,
  ProductWithDetails,
  ProductFilter,
  PaginationParams,
  PaginatedResult,
} from '../models/types.js';

export class ProductRepository {
  private pool = getPool();

  /**
   * Lấy tất cả sản phẩm với thông tin đầy đủ
   */
  async findAll(
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<ProductWithDetails>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;
    const sortBy = pagination?.sortBy || 'created_at';
    const sortOrder = pagination?.sortOrder || 'DESC';

    // Get total count
    const [countResult]: any = await this.pool.execute(
      'SELECT COUNT(*) as total FROM products',
    );
    const total = countResult[0].total;

    // Get paginated data
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        GROUP_CONCAT(DISTINCT t.name ORDER BY t.name) as tags,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `,
      [limit, offset],
    );

    // Transform data
    const data = rows.map((row: any) => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : [],
      images: row.images ? row.images.split(',') : [],
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
   * Lấy sản phẩm theo ID
   */
  async findById(id: number): Promise<ProductWithDetails | null> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating
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
      SELECT image_url
      FROM product_images
      WHERE product_id = ?
      ORDER BY display_order
    `,
      [id],
    );

    return {
      ...rows[0],
      tags: tags.map((t: any) => t.name),
      images: images.map((i: any) => i.image_url),
    };
  }

  /**
   * Tìm kiếm và lọc sản phẩm
   */
  async search(
    filter: ProductFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<ProductWithDetails>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;
    const sortBy = pagination?.sortBy || 'rating';
    const sortOrder = pagination?.sortOrder || 'DESC';

    let whereConditions: string[] = [];
    let params: any[] = [];

    // Build where conditions
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
      whereConditions.push('p.stock > 0');
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

    // Get paginated data
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating,
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
   * Lấy sản phẩm theo danh mục
   */
  async findByCategory(
    categoryName: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<ProductWithDetails>> {
    return this.search({ category: categoryName }, pagination);
  }

  /**
   * Lấy sản phẩm theo thương hiệu
   */
  async findByBrand(
    brandName: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<ProductWithDetails>> {
    return this.search({ brand: brandName }, pagination);
  }

  /**
   * Lấy sản phẩm giảm giá
   */
  async findDiscounted(
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<ProductWithDetails>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;

    const [countResult]: any = await this.pool.execute(
      'SELECT COUNT(*) as total FROM products WHERE discount_percentage > 0',
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
      WHERE p.discount_percentage > 0
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
   * Lấy sản phẩm được đánh giá cao
   */
  async findTopRated(limit: number = 10): Promise<ProductWithDetails[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        COUNT(DISTINCT r.id) as review_count,
        COALESCE(AVG(r.rating), 0) as avg_rating
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN reviews r ON p.id = r.product_id
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
   * Lấy sản phẩm mới nhất
   */
  async findLatest(limit: number = 10): Promise<ProductWithDetails[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.created_at DESC
      LIMIT ?
    `,
      [limit],
    );

    return rows;
  }

  /**
   * Lấy sản phẩm tương tự
   */
  async findSimilar(
    productId: number,
    limit: number = 5,
  ): Promise<ProductWithDetails[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        p2.*,
        c.name as category_name,
        b.name as brand_name
      FROM products p1
      JOIN products p2 ON p1.category_id = p2.category_id 
        AND p2.id != p1.id
        AND ABS(p2.price - p1.price) <= 20
      LEFT JOIN categories c ON p2.category_id = c.id
      LEFT JOIN brands b ON p2.brand_id = b.id
      WHERE p1.id = ?
      ORDER BY ABS(p2.price - p1.price), p2.rating DESC
      LIMIT ?
    `,
      [productId, limit],
    );

    return rows;
  }

  /**
   * Tạo sản phẩm mới
   */
  async create(product: Partial<Product>): Promise<number> {
    const [result]: any = await this.pool.execute(
      `
      INSERT INTO products (
        title, description, category_id, brand_id, price,
        discount_percentage, rating, stock, sku, weight,
        width, height, depth, warranty_information,
        shipping_information, availability_status, return_policy,
        minimum_order_quantity, barcode, qr_code, thumbnail
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        product.title,
        product.description,
        product.category_id,
        product.brand_id,
        product.price,
        product.discount_percentage || 0,
        product.rating || 0,
        product.stock || 0,
        product.sku,
        product.weight,
        product.width,
        product.height,
        product.depth,
        product.warranty_information,
        product.shipping_information,
        product.availability_status,
        product.return_policy,
        product.minimum_order_quantity || 1,
        product.barcode,
        product.qr_code,
        product.thumbnail,
      ],
    );

    return result.insertId;
  }

  /**
   * Cập nhật sản phẩm
   */
  async update(id: number, product: Partial<Product>): Promise<boolean> {
    const [result]: any = await this.pool.execute(
      `
      UPDATE products
      SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        discount_percentage = COALESCE(?, discount_percentage),
        stock = COALESCE(?, stock),
        availability_status = COALESCE(?, availability_status)
      WHERE id = ?
    `,
      [
        product.title,
        product.description,
        product.price,
        product.discount_percentage,
        product.stock,
        product.availability_status,
        id,
      ],
    );

    return result.affectedRows > 0;
  }

  /**
   * Xóa sản phẩm
   */
  async delete(id: number): Promise<boolean> {
    const [result]: any = await this.pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id],
    );

    return result.affectedRows > 0;
  }

  /**
   * Thống kê sản phẩm theo danh mục
   */
  async getStatsByCategory() {
    const [rows]: any = await this.pool.execute(`
      SELECT 
        c.name as category,
        COUNT(p.id) as product_count,
        AVG(p.price) as avg_price,
        MIN(p.price) as min_price,
        MAX(p.price) as max_price,
        SUM(p.stock) as total_stock
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY product_count DESC
    `);

    return rows;
  }
}
