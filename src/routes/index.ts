import { Router } from 'express';

import { createDocument } from '../controllers/documents.js';
import { authRouter } from './auth.js';

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

router.post('/documents', createDocument);

router.use('/auth', authRouter);
