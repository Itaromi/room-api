import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/services/prisma';

export function checkRoomConstraints(req: Request, res: Response, next: NextFunction): void {
    (async () => {
        try {
            const { roomId, start, end } = req.body;
            const errors: string[] = [];

            if (!roomId || !start || !end) {
                return res.status(400).json({ error: 'roomId, start et end sont requis.' });
            }

            const room = await prisma.room.findUnique({
                where: { id: roomId },
            });

            if (!room) {
                return res.status(404).json({ error: 'Salle introuvable.' });
            }

            const rules = (room.rules || {}) as {
                maxDurationMinutes?: number;
                allowWeekends?: boolean;
                minAdvanceHours?: number;
            };

            const startDate = new Date(start);
            const endDate = new Date(end);
            const now = new Date();

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'start et end doivent être des dates valides.' });
            }

            const durationMin = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
            const hoursInAdvance = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            const dayOfWeek = startDate.getDay();

            // Vérification des règles dynamiques
            if (rules.maxDurationMinutes && durationMin > rules.maxDurationMinutes) {
                errors.push(`La salle ${room.name} n’autorise pas les réservations de plus de ${rules.maxDurationMinutes} minutes.`);
            }

            if (rules.allowWeekends === false && (dayOfWeek === 0 || dayOfWeek === 6)) {
                errors.push(`La salle ${room.name} n’autorise pas les réservations le week-end.`);
            }

            if (rules.minAdvanceHours && hoursInAdvance < rules.minAdvanceHours) {
                errors.push(`La salle ${room.name} nécessite une réservation au moins ${rules.minAdvanceHours}h à l’avance.`);
            }

            // Vérification de conflit de réservation
            const conflictingBooking = await prisma.booking.findFirst({
                where: {
                    roomId,
                    AND: [
                        { start: { lt: endDate } },
                        { end: { gt: startDate } },
                    ],
                },
            });

            if (conflictingBooking) {
                errors.push(`Une autre réservation existe déjà sur ce créneau : de ${new Date(conflictingBooking.start).toLocaleString()} à ${new Date(conflictingBooking.end).toLocaleString()}.`);
            }

            // Retour des erreurs si besoin
            if (errors.length > 0) {
                return res.status(400).json({
                    message: "Certaines contraintes de la salle n'ont pas été respectées.",
                    errors,
                });
            }

            // OK
            next();

        } catch (err) {
            console.error('[Middleware] Erreur contraintes dynamiques :', err);
            res.status(500).json({ error: 'Erreur interne serveur (contrainte salle).' });
        }
    })();
}
