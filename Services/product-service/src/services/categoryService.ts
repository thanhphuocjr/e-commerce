import { getPool } from '../config/database.js';
import type { Category } from '../models/types.js';

export class CategoryService {
  private get pool() {
    return getPool();
  }

  /**
   * Lấy tất cả danh mục
   */
  async getAllCategories(): Promise<Category[]> {
    const [rows]: any = await this.pool.execute(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    return rows;
  }

  /**
   * Lấy danh mục theo ID
   */
  async getCategoryById(id: number): Promise<Category | null> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `,
      [id],
    );

    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Tạo danh mục mới
   */
  async createCategory(data: {
    name: string;
    description?: string;
  }): Promise<Category> {
    const [result]: any = await this.pool.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [data.name, data.description],
    );

    const category = await this.getCategoryById(result.insertId);
    return category!;
  }

  /**
   * Cập nhật danh mục
   */
  async updateCategory(
    id: number,
    data: Partial<{ name: string; description: string }>,
  ): Promise<Category | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }

    if (updates.length === 0) {
      return this.getCategoryById(id);
    }

    values.push(id);
    await this.pool.execute(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );

    return this.getCategoryById(id);
  }

  /**
   * Xóa danh mục
   */
  async deleteCategory(id: number): Promise<boolean> {
    // Check if category has products
    const [products]: any = await this.pool.execute(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id],
    );

    if (products[0].count > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    const [result]: any = await this.pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [id],
    );

    return result.affectedRows > 0;
  }

  /**
   * Lấy thống kê theo danh mục
   */
  async getCategoryStats(): Promise<any[]> {
    const [rows]: any = await this.pool.execute(`
      SELECT 
        c.id,
        c.name as category,
        c.description,
        COUNT(p.id) as product_count,
        COALESCE(AVG(p.price), 0) as avg_price,
        COALESCE(MIN(p.price), 0) as min_price,
        COALESCE(MAX(p.price), 0) as max_price,
        COALESCE(SUM(p.stock), 0) as total_stock,
        COALESCE(AVG(p.rating), 0) as avg_rating
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.description
      ORDER BY product_count DESC
    `);

    return rows;
  }

  /**
   * Lấy sản phẩm theo danh mục
   */
  async getProductsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    const offset = (page - 1) * limit;

    const [countResult]: any = await this.pool.execute(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ?',
      [categoryId],
    );
    const total = countResult[0].total;

    const [products]: any = await this.pool.execute(
      `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        ROUND(p.price * (1 - p.discount_percentage/100), 2) as sale_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.category_id = ?
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
      [categoryId],
    );

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
