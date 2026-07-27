import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
  userId?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '30d' });
};
