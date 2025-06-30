// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import {prisma} from '../services/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                // Le rôle par défaut est 'employee' comme défini dans le schéma Prisma
            },
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Retrouver l'utilisateur
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // 2. Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe incorrect' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Le token expirera dans 1 heure
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
};