import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  checkout,
  getBooking,
  listBookings,
} from '../controllers/bookingController.js';

const router = Router();

router.use(authMiddleware);
router.post('/checkout', checkout);
router.get('/', listBookings);
router.get('/:id', getBooking);

export default router;

