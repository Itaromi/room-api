import { prisma } from '@/services/prisma';
import { Request, Response } from 'express';

export const getBookings = async (req: Request, res: Response): Promise<void> => {
    const { userId, role } = req.user!;
    const where = role === 'admin' ? {} : { userId };
    const bookings = await prisma.booking.findMany({ where, include: { room: true } });
    res.status(200).json(bookings);
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    const { roomId, start, end } = req.body;
    const userId = req.user!.userId;

    const booking = await prisma.booking.create({
        data: { roomId, userId, start: new Date(start), end: new Date(end) },
        include: { room: true },
    });

    res.status(201).json({ message: 'Réservation créée.', booking });
};
