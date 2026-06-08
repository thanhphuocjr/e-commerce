import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database.js';

const mapPayment = (row) => ({
  id: row.id,
  bookingId: row.booking_id,
  userId: row.user_id,
  amount: Number(row.amount),
  currency: row.currency,
  method: row.method,
  provider: row.provider,
  providerTransactionId: row.provider_transaction_id,
  status: row.status,
  failureReason: row.failure_reason,
  paidAt: row.paid_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class PaymentRepository {
  async createPayment(payment) {
    const db = getPool();
    const id = uuidv4();

    await db.execute(
      `
        INSERT INTO payments (
          id, booking_id, user_id, amount, currency, method, provider,
          provider_transaction_id, status, failure_reason, paid_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        payment.bookingId,
        payment.userId,
        payment.amount,
        payment.currency,
        payment.method,
        payment.provider,
        payment.providerTransactionId,
        payment.status,
        payment.failureReason || null,
        payment.paidAt || null,
      ],
    );

    return this.findById(id);
  }

  async findById(id) {
    const db = getPool();
    const [rows] = await db.execute('SELECT * FROM payments WHERE id = ?', [id]);
    return rows.length > 0 ? mapPayment(rows[0]) : null;
  }

  async findByBookingId(bookingId) {
    const db = getPool();
    const [rows] = await db.execute(
      'SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC',
      [bookingId],
    );

    return rows.map(mapPayment);
  }
}

