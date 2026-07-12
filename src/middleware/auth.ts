import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: "Unauthorized" },
    });
    return;
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "object" && decoded && "userId" in decoded) {
      req.user = { userId: String(decoded.userId) };
      next();
      return;
    }
  } catch {
    // fall through to unauthorized
  }

  res.status(401).json({
    success: false,
    data: null,
    error: { message: "Unauthorized" },
  });
};
