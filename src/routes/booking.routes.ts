import { Router } from 'express';
import { getBookings, createBooking } from '@/controllers/booking.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { checkRoomConstraints } from '@/middlewares/rules.middleware';

const router = Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Liste toutes les réservations de l'utilisateur
 *     tags:
 *       - Réservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   roomId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/', authMiddleware, getBookings);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Créer une réservation
 *     tags:
 *       - Réservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 roomId:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Erreur de validation ou contrainte de chambre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/', authMiddleware, checkRoomConstraints, createBooking);

export default router;