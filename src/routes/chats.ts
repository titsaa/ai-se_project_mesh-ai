import { Router } from 'express';

import { createChat } from '../controllers/chats.js';

export const chatsRouter = Router();

chatsRouter.post('/', createChat);
