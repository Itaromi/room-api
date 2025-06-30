/// <reference path="../types/express.d.ts" />
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import {prisma} from '@/services/prisma';

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
    }

    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true }
    });

    if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
    }
    res.status(200).json(user);
    return;
};