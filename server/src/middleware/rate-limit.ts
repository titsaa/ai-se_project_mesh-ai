import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function tooManyRequests(_req: Request, res: Response) {
  res.status(429).json({
    success: false,
    data: null,
    error: { message: "Too many requests, please try again later." },
  });
}

export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: tooManyRequests,
});

export const registerLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: tooManyRequests,
});
