import { z } from 'zod';

export const roomCreateSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive(),
});

