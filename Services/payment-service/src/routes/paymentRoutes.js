import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createPayment,
  getPayment,
  getPaymentsByBooking,
} from '../controllers/paymentController.js';

const router = Router();

router.post('/', createPayment);
router.get('/booking/:bookingId', authMiddleware, getPaymentsByBooking);
router.get('/:id', authMiddleware, getPayment);

export default router;
