import { Router } from 'express';

import { createDocument } from '../controllers/documents.js';

export const documentsRouter = Router();

documentsRouter.post('/', createDocument);
