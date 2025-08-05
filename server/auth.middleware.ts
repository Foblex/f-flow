import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './env';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies['token'];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
    return;
  } catch {
    res.status(401).send('Invalid token');
    return;
  }
}
