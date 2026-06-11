import type { Request, Response } from 'express';

export function getCurrentUser(req: Request, res: Response) {
  void req;

  res.status(200).json({
    success: true,
    data: {
      userId: 'user_001',
      email: 'user@example.com',
      name: 'John Doe',
      createdAt: '2026-01-01T00:00:00Z',
    },
    error: null,
  });
}
