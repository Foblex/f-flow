import { Router } from 'express';
import { authRouter } from './auth.routes';
import { authMiddleware } from './auth.middleware';

export function setupServerRoutes(router: Router) {
  router.use(authRouter);

  router.get('/api/me', authMiddleware, (req, res) => {
    res.json((req as any).user);
  });
}
