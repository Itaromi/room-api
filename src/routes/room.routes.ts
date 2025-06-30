import { Router } from 'express';
import { getAllRooms, getRoomById, createRoom } from '@/controllers/room.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { isAdmin } from '@/middlewares/isAdmin.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { roomCreateSchema } from '@/validators/room.validator';

const router = Router();

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Liste toutes les chambres
 *     tags:
 *       - Chambre
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des chambres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   capacity:
 *                     type: integer
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
router.get('/', authMiddleware, getAllRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Détail d'une chambre
 *     tags:
 *       - Chambre
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chambre trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 capacity:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Chambre non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/:id', authMiddleware, getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Créer une chambre (admin)
 *     tags:
 *       - Chambre
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Chambre créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 capacity:
 *                   type: integer
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié ou non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/', authMiddleware, isAdmin, validate(roomCreateSchema), createRoom);

export default router;
