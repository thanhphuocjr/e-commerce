import { get } from 'node:http';
import { getPool } from '../config/database.js';

import type { Brand } from '../models/types.js';

export class BrandService {
  private get pool() {
    return getPool();
  }

  async getAllBrands(): Promise<Brand[]> {
    const [rows]: any = await this.pool.execute(`
      SELECT 
        b.*,
        COUNT(p.id) as product_count
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      GROUP BY b.id
      ORDER BY b.name ASC
    `);
    return rows;
  }

  async getBrandById(id: number): Promise<Brand | null> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        b.*,
        COUNT(p.id) as product_count
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      WHERE b.id = ?
      GROUP BY b.id
    `,
      [id],
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createBrand(data: {
    name: string;
    description?: string;
  }): Promise<Brand> {
    const [result]: any = await this.pool.execute(
      'INSERT INTO brands (name, description) VALUES (?, ?)',
      [data.name, data.description],
    );
    return (await this.getBrandById(result.insertId))!;
  }

  async updateBrand(
    id: number,
    data: Partial<{ name: string; description: string }>,
  ): Promise<Brand | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }

    if (updates.length === 0) return this.getBrandById(id);

    values.push(id);
    await this.pool.execute(
      `UPDATE brands SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );
    return this.getBrandById(id);
  }

  async deleteBrand(id: number): Promise<boolean> {
    const [result]: any = await this.pool.execute(
      'DELETE FROM brands WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }

  async getBrandStats(): Promise<any[]> {
    const [rows]: any = await this.pool.execute(`
      SELECT 
        b.id,
        b.name as brand,
        b.description,
        COUNT(p.id) as product_count,
        COALESCE(AVG(p.price), 0) as avg_price,
        COALESCE(AVG(p.rating), 0) as avg_rating
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      GROUP BY b.id, b.name, b.description
      ORDER BY product_count DESC
    `);
    return rows;
  }
}