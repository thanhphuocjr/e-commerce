import { getPool } from '../config/database.js';

export class ImageService {
  private get pool() {
    return getPool();
  }

  async getImagesByProduct(productId: number): Promise<any[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT * FROM product_images
      WHERE product_id = ?
      ORDER BY display_order ASC
    `,
      [productId],
    );
    return rows;
  }

  async createImages(productId: number, imageUrls: string[]): Promise<any[]> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const images = [];
      for (let i = 0; i < imageUrls.length; i++) {
        const [result]: any = await connection.execute(
          'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
          [productId, imageUrls[i], i],
        );

        images.push({
          id: result.insertId,
          product_id: productId,
          image_url: imageUrls[i],
          display_order: i,
        });
      }

      await connection.commit();
      return images;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateImage(
    id: number,
    data: { image_url?: string; display_order?: number },
  ): Promise<any | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.image_url) {
      updates.push('image_url = ?');
      values.push(data.image_url);
    }
    if (data.display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(data.display_order);
    }

    if (updates.length === 0) return null;

    values.push(id);
    await this.pool.execute(
      `UPDATE product_images SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );

    const [rows]: any = await this.pool.execute(
      'SELECT * FROM product_images WHERE id = ?',
      [id],
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async deleteImage(id: number): Promise<boolean> {
    const [result]: any = await this.pool.execute(
      'DELETE FROM product_images WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }

  async updateImageOrder(
    productId: number,
    imageOrders: { id: number; order: number }[],
  ): Promise<boolean> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      for (const item of imageOrders) {
        await connection.execute(
          'UPDATE product_images SET display_order = ? WHERE id = ? AND product_id = ?',
          [item.order, item.id, productId],
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
