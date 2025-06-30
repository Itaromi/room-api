// src/middlewares/auth.middleware.ts
import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Accès non autorisé, token manquant ou invalide.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, JWT_SECRET) as { userId: number; role: string; };

        next();
    } catch (error) {
        res.status(403).json({ message: 'Token invalide ou expiré.' });
        return;
    }
};