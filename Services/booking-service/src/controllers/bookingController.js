import { BookingService } from '../services/bookingService.js';
import { created, success } from '../utils/apiResponse.js';

const bookingService = new BookingService();

export const checkout = async (req, res, next) => {
  try {
    const result = await bookingService.checkout(req.user, req.body);
    return created(res, result, 'Checkout completed');
  } catch (error) {
    return next(error);
  }
};

export const listBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.listBookings(req.user);
    return success(res, bookings);
  } catch (error) {
    return next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBooking(req.user, req.params.id);
    return success(res, booking);
  } catch (error) {
    return next(error);
  }
};

