import type { Request, Response } from 'express';

export function createQuery(req: Request, res: Response) {
  const { query } = req.body as { query?: string };

  res.status(201).json({
    success: true,
    data: {
      queryId: 'query_001',
      query: query ?? 'What is Mesh AI?',
      answer: 'Mesh AI helps connect knowledge and workflows using AI.',
      createdAt: '2026-01-10T12:00:00Z',
    },
    error: null,
  });
}
