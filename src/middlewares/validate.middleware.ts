import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>): ((req: Request, res: Response, next: NextFunction) => void) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Validation error', errors: result.error.errors });
  }
  req.body = result.data;
  next();
};

