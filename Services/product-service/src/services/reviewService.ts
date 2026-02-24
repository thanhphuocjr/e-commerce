import { getPool } from '../config/database.js';

export class ReviewService {
  private get pool() {
    return getPool();
  }

  async getAllReviews(page: number = 1, limit: number = 20): Promise<any> {
    const offset = (page - 1) * limit;

    const [countResult]: any = await this.pool.execute(
      'SELECT COUNT(*) as total FROM reviews',
    );
    const total = countResult[0].total;

    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        r.*,
        p.title as product_title,
        p.thumbnail as product_thumbnail
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.review_date DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset],
    );

    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getReviewById(id: number): Promise<any | null> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        r.*,
        p.title as product_title,
        p.thumbnail as product_thumbnail
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.id = ?
    `,
      [id],
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async getReviewsByProduct(
    productId: number,
    page: number = 1,
    limit: number = 10,
    rating?: number,
  ): Promise<any> {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE r.product_id = ?';
    const params: any[] = [productId];

    if (rating) {
      whereClause += ' AND r.rating = ?';
      params.push(rating);
    }

    const [countResult]: any = await this.pool.execute(
      `SELECT COUNT(*) as total FROM reviews r ${whereClause}`,
      params,
    );
    const total = countResult[0].total;

    const [reviews]: any = await this.pool.execute(
      `
      SELECT r.*
      FROM reviews r
      ${whereClause}
      ORDER BY r.review_date DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset],
    );

    // Get rating distribution
    const [distribution]: any = await this.pool.execute(
      `
      SELECT rating, COUNT(*) as count
      FROM reviews
      WHERE product_id = ?
      GROUP BY rating
      ORDER BY rating DESC
    `,
      [productId],
    );

    const dist: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    distribution.forEach((d: any) => {
      dist[d.rating] = d.count;
    });

    // Get average rating
    const [avgResult]: any = await this.pool.execute(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ?',
      [productId],
    );

    return {
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      summary: {
        average_rating: parseFloat(avgResult[0].avg_rating || 0),
        total_reviews: total,
        distribution: dist,
      },
    };
  }

  async createReview(data: {
    product_id: number;
    rating: number;
    comment?: string;
    reviewer_name?: string;
    reviewer_email?: string;
  }): Promise<any> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result]: any = await connection.execute(
        `INSERT INTO reviews (
          product_id, rating, comment, review_date, reviewer_name, reviewer_email
        ) VALUES (?, ?, ?, NOW(), ?, ?)`,
        [
          data.product_id,
          data.rating,
          data.comment,
          data.reviewer_name,
          data.reviewer_email,
        ],
      );

      // Update product rating
      await connection.execute(
        `UPDATE products 
         SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?)
         WHERE id = ?`,
        [data.product_id, data.product_id],
      );

      await connection.commit();

      return await this.getReviewById(result.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateReview(
    id: number,
    data: { rating?: number; comment?: string },
  ): Promise<any | null> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const updates: string[] = [];
      const values: any[] = [];

      if (data.rating) {
        updates.push('rating = ?');
        values.push(data.rating);
      }
      if (data.comment !== undefined) {
        updates.push('comment = ?');
        values.push(data.comment);
      }

      if (updates.length === 0) {
        await connection.commit();
        return this.getReviewById(id);
      }

      values.push(id);
      await connection.execute(
        `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`,
        values,
      );

      // Get product_id to update rating
      const [review]: any = await connection.execute(
        'SELECT product_id FROM reviews WHERE id = ?',
        [id],
      );

      if (review.length > 0) {
        await connection.execute(
          `UPDATE products 
           SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?)
           WHERE id = ?`,
          [review[0].product_id, review[0].product_id],
        );
      }

      await connection.commit();

      return await this.getReviewById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteReview(id: number): Promise<boolean> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get product_id before delete
      const [review]: any = await connection.execute(
        'SELECT product_id FROM reviews WHERE id = ?',
        [id],
      );

      if (review.length === 0) {
        await connection.commit();
        return false;
      }

      const productId = review[0].product_id;

      // Delete review
      await connection.execute('DELETE FROM reviews WHERE id = ?', [id]);

      // Update product rating
      await connection.execute(
        `UPDATE products 
         SET rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = ?), 0)
         WHERE id = ?`,
        [productId, productId],
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getRecentReviews(limit: number = 10): Promise<any[]> {
    const [rows]: any = await this.pool.execute(
      `
      SELECT 
        r.*,
        p.title as product_title,
        p.thumbnail as product_thumbnail
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.review_date DESC
      LIMIT ?
    `,
      [limit],
    );
    return rows;
  }
}
