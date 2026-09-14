import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed authorization header' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty token provided' });
  }

  // Bypass tokens restricted strictly to non-production environments
  const isDev = process.env.NODE_ENV !== 'production';
  const isDevToken = token === 'dev-admin-token' || token === 'izcor-admin-token';

  if (isDevToken) {
    if (isDev) {
      req.user = { 
        uid: 'izcor-admin-ventas', 
        email: 'ventasizcormedic@gmail.com',
        name: 'Administrador IZCOR',
        auth_time: Math.floor(Date.now() / 1000),
        iss: 'dev-environment',
        aud: 'izcor-medic',
        sub: 'izcor-admin-ventas',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        firebase: { identities: {}, sign_in_provider: 'custom' }
      } as unknown as DecodedIdToken;
      return next();
    } else {
      console.warn(`[SECURITY ALERT] Dev bypass token attempt rejected in production environment from IP: ${req.ip}`);
      return res.status(401).json({ error: 'Unauthorized: Development bypass tokens are disabled in production' });
    }
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.warn('Error verifying Firebase ID token, rejecting request:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
