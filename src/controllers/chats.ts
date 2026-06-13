import type { Request, Response } from 'express';

export function createChat(req: Request, res: Response) {
  const { message } = req.body as { message?: string };

  res.status(201).json({
    success: true,
    data: {
      chatId: 'chat_001',
      message: message ?? 'Hello world',
      createdAt: '2026-01-10T12:00:00Z',
    },
    error: null,
  });
}
