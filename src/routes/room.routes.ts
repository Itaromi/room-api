import { Router } from 'express';
import { getAllRooms, getRoomById, createRoom } from '@/controllers/room.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { isAdmin } from '@/middlewares/isAdmin.middleware';

const router = Router();

router.get('/', authMiddleware, getAllRooms);
router.get('/:id', authMiddleware, getRoomById);
router.post('/', authMiddleware, isAdmin, createRoom);

export default router;
