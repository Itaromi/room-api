import { Request, Response } from 'express';
import { prisma } from '@/services/prisma';

export const getAllRooms = async (_req: Request, res: Response): Promise<void> => {
    const rooms = await prisma.room.findMany();
    res.status(200).json(rooms);
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const room = await prisma.room.findUnique({ where: { id: Number(id) } });
    if (!room) {
        res.status(404).json({ message: 'Salle non trouvée.' });
        return;
    }

    res.status(200).json(room);

};

export const createRoom = async (req: Request, res: Response): Promise<void> => {
    const { name, capacity, rules } = req.body;
    const room = await prisma.room.create({
        data: { name, capacity, rules },
    });
    res.status(201).json(room);
};
