import { Router } from 'express';

import { authRouter } from './auth.js';
import { chatsRouter } from './chats.js';
import { documentsRouter } from './documents.js';
import { queryRouter } from './query.js';

export const router = Router();

router.get('/health', (req, res) => {
  void req;

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
    },
    error: null,
  });
});

router.use('/auth', authRouter);
router.use('/chats', chatsRouter);
router.use('/documents', documentsRouter);
router.use('/query', queryRouter);
