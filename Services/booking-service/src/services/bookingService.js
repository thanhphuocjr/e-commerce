import axios from 'axios';
import { BookingRepository } from '../repositories/bookingRepository.js';
import { env } from '../config/environment.js';
import { ApiError } from '../utils/apiError.js';

const toMoney = (value) => Math.round(Number(value || 0) * 100) / 100;

const getFirstImage = (product) => {
  if (product.thumbnail) {
    return product.thumbnail;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage?.url;
  }

  return null;
};

export class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async checkout(user, payload) {
    const normalizedItems = this.normalizeItems(payload.items);
    const checkout = {
      paymentMethod: payload.paymentMethod || 'mock-card',
      customerName: payload.customerName || '',
      customerEmail: payload.customerEmail || user.email || '',
      customerPhone: payload.customerPhone || '',
      shippingAddress: payload.shippingAddress || '',
      note: payload.note || '',
    };

    const items = await Promise.all(
      normalizedItems.map((item) => this.buildCheckoutItem(item)),
    );

    const subtotal = toMoney(
      items.reduce((total, item) => total + item.subtotal, 0),
    );
    const shippingFee = subtotal > 0 ? 0 : 0;
    const totalAmount = toMoney(subtotal + shippingFee);

    const booking = await this.bookingRepository.createBooking({
      user,
      items,
      checkout,
      totals: {
        subtotal,
        shippingFee,
        totalAmount,
        currency: payload.currency || 'USD',
      },
    });

    try {
      const paymentResponse = await axios.post(
        `${env.PAYMENT_SERVICE_URL}/v1/payments`,
        {
          bookingId: booking.id,
          userId: String(user.id),
          amount: totalAmount,
          currency: booking.currency,
          method: checkout.paymentMethod,
        },
        { timeout: 10000 },
      );

      const payment = paymentResponse.data?.data;
      const paymentStatus = payment?.status === 'paid' ? 'paid' : 'pending';
      const status = paymentStatus === 'paid' ? 'paid' : 'pending_payment';
      const updatedBooking = await this.bookingRepository.updatePayment({
        bookingId: booking.id,
        paymentId: payment?.id || null,
        paymentStatus,
        status,
      });

      return {
        booking: updatedBooking,
        payment,
      };
    } catch (error) {
      const failedBooking = await this.bookingRepository.updatePayment({
        bookingId: booking.id,
        paymentId: null,
        paymentStatus: 'failed',
        status: 'payment_failed',
      });

      return {
        booking: failedBooking,
        payment: null,
        paymentError: 'Payment service is unavailable.',
      };
    }
  }

  async listBookings(user) {
    return this.bookingRepository.findByUser(user);
  }

  async getBooking(user, id) {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (user.role !== 'admin' && String(booking.userId) !== String(user.id)) {
      throw new ApiError(403, 'Forbidden');
    }

    return booking;
  }

  normalizeItems(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'Cart is empty.');
    }

    return items.map((item) => {
      const productId = Number(item.productId || item.id);
      const quantity = Number(item.quantity || 1);

      if (!Number.isInteger(productId) || productId <= 0) {
        throw new ApiError(400, 'Invalid product in cart.');
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new ApiError(400, 'Invalid product quantity.');
      }

      return { productId, quantity };
    });
  }

  async buildCheckoutItem(item) {
    const response = await axios.get(
      `${env.PRODUCT_SERVICE_URL}/v1/products/product/${item.productId}`,
      { timeout: 10000 },
    );
    const product = response.data?.data;

    if (!product) {
      throw new ApiError(404, `Product ${item.productId} not found.`);
    }

    const stock = Number(product.stock || 0);
    if (stock <= 0 || product.availability_status === 'Out of Stock') {
      throw new ApiError(400, `${product.title} is out of stock.`);
    }

    if (item.quantity > stock) {
      throw new ApiError(400, `${product.title} only has ${stock} item(s).`);
    }

    const originalPrice = Number(product.price || 0);
    const salePrice = Number(product.sale_price || originalPrice);
    const unitPrice = toMoney(salePrice > 0 ? salePrice : originalPrice);

    return {
      productId: item.productId,
      title: product.title,
      image: getFirstImage(product),
      unitPrice,
      quantity: item.quantity,
      subtotal: toMoney(unitPrice * item.quantity),
    };
  }
}

