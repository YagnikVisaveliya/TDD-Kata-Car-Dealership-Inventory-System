import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware.js';
import { createResponse } from '../utils/api-response.js';


export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json(createResponse(false, 'Authentication required', null));
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json(createResponse(false, 'Admin access required', null));
  }

  next();
}