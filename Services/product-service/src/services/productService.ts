import { getPool } from '../config/database.js';

import type {
  Product,
  ProductWithDetails,
  ProductFilter,
  PaginationParams,
  PaginatedResult,
} from '../models/types.js';

export class ProductService {
  private pool = getPool();

  //Get products with filter and pagination

  async getProducts(
    filter: ProductFilter = {},
    pagination: PaginationParams = { page: 1, limit: 20 },
  ): Promise<PaginatedResult<ProductWithDetails>> {
    const page = pagination.page || 1;
    const limit = Math.min(pagination.limit || 20, 100); //Max 100
    const offset = (page - 1) * limit;
    const sortBy = this.validateSortBy(pagination.sortBy) || 'created_at';
    const sortOrder = pagination.sortOrder == 'ASC' ? 'ASC' : 'DESC';

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

  private validateSortBy(sortBy?: string): string | undefined {
    const allowedFields = ['price', 'rating', 'created_at', 'title', 'stock'];
    return sortBy && allowedFields.includes(sortBy) ? sortBy : undefined;
  }
}
