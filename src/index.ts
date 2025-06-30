// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes'; // <-- 1. Importer le routeur
import userRouter from "./routes/user.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Bienvenue sur l\'API de WorkEase !');
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.listen(port, () => {
    console.log(`[server]: Serveur démarré sur http://localhost:${port}`);
});