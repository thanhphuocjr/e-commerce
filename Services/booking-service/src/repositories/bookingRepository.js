import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database.js';

const mapBooking = (row, items = []) => ({
  id: row.id,
  userId: row.user_id,
  userEmail: row.user_email,
  status: row.status,
  paymentStatus: row.payment_status,
  paymentId: row.payment_id,
  subtotal: Number(row.subtotal),
  shippingFee: Number(row.shipping_fee),
  totalAmount: Number(row.total_amount),
  currency: row.currency,
  paymentMethod: row.payment_method,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
  shippingAddress: row.shipping_address,
  note: row.note,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  items,
});

const mapItem = (row) => ({
  id: row.id,
  bookingId: row.booking_id,
  productId: Number(row.product_id),
  title: row.product_title,
  image: row.product_image,
  unitPrice: Number(row.unit_price),
  quantity: Number(row.quantity),
  subtotal: Number(row.subtotal),
});

export class BookingRepository {
  async createBooking({ user, items, totals, checkout }) {
    const db = getPool();
    const connection = await db.getConnection();
    const bookingId = uuidv4();

    try {
      await connection.beginTransaction();

      await connection.execute(
        `
          INSERT INTO bookings (
            id, user_id, user_email, subtotal, shipping_fee, total_amount,
            currency, payment_method, customer_name, customer_email,
            customer_phone, shipping_address, note
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          bookingId,
          String(user.id),
          user.email || checkout.customerEmail || null,
          totals.subtotal,
          totals.shippingFee,
          totals.totalAmount,
          totals.currency,
          checkout.paymentMethod,
          checkout.customerName || null,
          checkout.customerEmail || user.email || null,
          checkout.customerPhone || null,
          checkout.shippingAddress || null,
          checkout.note || null,
        ],
      );

      for (const item of items) {
        await connection.execute(
          `
            INSERT INTO booking_items (
              id, booking_id, product_id, product_title, product_image,
              unit_price, quantity, subtotal
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            uuidv4(),
            bookingId,
            item.productId,
            item.title,
            item.image || null,
            item.unitPrice,
            item.quantity,
            item.subtotal,
          ],
        );
      }

      await connection.commit();
      return this.findById(bookingId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updatePayment({ bookingId, paymentId, paymentStatus, status }) {
    const db = getPool();

    await db.execute(
      `
        UPDATE bookings
        SET payment_id = ?, payment_status = ?, status = ?
        WHERE id = ?
      `,
      [paymentId, paymentStatus, status, bookingId],
    );

    return this.findById(bookingId);
  }

  async findById(id) {
    const db = getPool();
    const [bookingRows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [
      id,
    ]);

    if (bookingRows.length === 0) {
      return null;
    }

    const [itemRows] = await db.execute(
      'SELECT * FROM booking_items WHERE booking_id = ? ORDER BY created_at ASC',
      [id],
    );

    return mapBooking(bookingRows[0], itemRows.map(mapItem));
  }

  async findByUser(user) {
    const db = getPool();
    const isAdmin = user.role === 'admin';
    const [rows] = await db.execute(
      isAdmin
        ? 'SELECT * FROM bookings ORDER BY created_at DESC'
        : 'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      isAdmin ? [] : [String(user.id)],
    );

    return rows.map((row) => mapBooking(row));
  }
}

