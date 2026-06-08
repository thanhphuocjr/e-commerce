import { PaymentService } from '../services/paymentService.js';
import { created, success } from '../utils/apiResponse.js';

const paymentService = new PaymentService();

export const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    return created(res, payment, 'Payment created');
  } catch (error) {
    return next(error);
  }
};

export const getPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.getPayment(req.params.id);
    return success(res, payment);
  } catch (error) {
    return next(error);
  }
};

export const getPaymentsByBooking = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByBooking(
      req.params.bookingId,
    );
    return success(res, payments);
  } catch (error) {
    return next(error);
  }
};

