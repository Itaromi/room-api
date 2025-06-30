import { Router } from 'express';
import { getBookings, createBooking } from '@/controllers/booking.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { checkRoomConstraints } from '@/middlewares/rules.middleware';

const router = Router();

router.get('/', authMiddleware, getBookings);
router.post('/', authMiddleware, checkRoomConstraints, createBooking);

export default router;