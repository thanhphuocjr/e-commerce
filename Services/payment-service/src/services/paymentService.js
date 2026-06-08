import { v4 as uuidv4 } from 'uuid';
import { PaymentRepository } from '../repositories/paymentRepository.js';
import { ApiError } from '../utils/apiError.js';

export class PaymentService {
  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async createPayment(payload) {
    const amount = Number(payload.amount);

    if (!payload.bookingId) {
      throw new ApiError(400, 'bookingId is required.');
    }

    if (!payload.userId) {
      throw new ApiError(400, 'userId is required.');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ApiError(400, 'Invalid payment amount.');
    }

    const method = payload.method || 'mock-card';
    const status = method === 'cash-on-delivery' ? 'pending' : 'paid';
    const now = new Date();

    return this.paymentRepository.createPayment({
      bookingId: payload.bookingId,
      userId: String(payload.userId),
      amount: Math.round(amount * 100) / 100,
      currency: payload.currency || 'USD',
      method,
      provider: 'mock',
      providerTransactionId: `MOCK-${uuidv4()}`,
      status,
      failureReason: null,
      paidAt: status === 'paid' ? now : null,
    });
  }

  async getPayment(id) {
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new ApiError(404, 'Payment not found.');
    }

    return payment;
  }

  async getPaymentsByBooking(bookingId) {
    return this.paymentRepository.findByBookingId(bookingId);
  }
}

