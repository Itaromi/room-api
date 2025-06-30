// src/routes/user.routes.ts
import { Router } from 'express';
import { getMyProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authMiddleware, getMyProfile);

export default router;