import type { NextFunction, Request, Response } from "express";

import { logger } from "../utils/logger.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    data: null,
    error: { message: `Route ${req.method} ${req.path} not found` },
  });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  void _next;
  logger.error(err);

  res.status(500).json({
    success: false,
    data: null,
    error: { message: "Internal server error" },
  });
}
