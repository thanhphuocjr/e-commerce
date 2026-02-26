import { getPool } from '../config/database.js';
export class TagService {
  private get pool() {
    return getPool();
  }

  async getAllTags(): Promise<any[]> {
    const [rows]: any = await this.pool.execute(`
      SELECT 
        t.*,
        COUNT(pt.product_id) as product_count
      FROM tags t
      LEFT JOIN product_tags pt ON t.id = pt.tag_id
      GROUP BY t.id
      ORDER BY product_count DESC, t.name ASC
    `);
    return rows;
  }

  async getTagById(id: number): Promise<any | null> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        t.*,
        COUNT(pt.product_id) as product_count
      FROM tags t
      LEFT JOIN product_tags pt ON t.id = pt.tag_id
      WHERE t.id = ?
      GROUP BY t.id
    `,
      [id],
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createTag(data: { name: string }): Promise<any> {
    const [result]: any = await this.pool.execute(
      'INSERT INTO tags (name) VALUES (?)',
      [data.name],
    );
    return await this.getTagById(result.insertId);
  }

  async updateTag(id: number, data: { name: string }): Promise<any | null> {
    await this.pool.execute('UPDATE tags SET name = ? WHERE id = ?', [
      data.name,
      id,
    ]);
    return this.getTagById(id);
  }

  async deleteTag(id: number): Promise<boolean> {
    const [result]: any = await this.pool.execute(
      'DELETE FROM tags WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }

  async getProductsByTag(
    tagId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    const offset = (page - 1) * limit;

    const [countResult]: any = await this.pool.execute(
      'SELECT COUNT(DISTINCT pt.product_id) as total FROM product_tags pt WHERE pt.tag_id = ?',
      [tagId],
    );
    const total = countResult[0].total;

    const [products]: any = await this.pool.execute(
      `
      SELECT DISTINCT
        p.*,
        c.name as category_name,
        b.name as brand_name
      FROM products p
      JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE pt.tag_id = ?
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
      [tagId],
    );

    return {
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
