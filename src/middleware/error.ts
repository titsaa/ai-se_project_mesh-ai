import type { NextFunction, Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    data: null,
    error: `Route ${req.method} ${req.path} not found`,
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  void req;
  void next;

  console.error(err);

  res.status(500).json({
    success: false,
    data: null,
    error: 'An error has occurred on the server',
  });
}
