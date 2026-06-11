import type { Request, Response } from 'express';

export function createDocument(req: Request, res: Response) {
  void req;

  res.status(201).json({
    success: true,
    data: {},
    error: null,
  });
}
