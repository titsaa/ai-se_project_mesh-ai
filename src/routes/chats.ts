import { Router } from "express";

import {
  createChat,
  createMessage,
  getChat,
  getChats,
} from "../controllers/chats.js";
import { auth } from "../middleware/auth.js";

export const chatsRouter = Router();

chatsRouter.use(auth);
chatsRouter.post("/", createChat);
chatsRouter.get("/", getChats);
chatsRouter.post("/:id/messages", createMessage);
chatsRouter.get("/:id", getChat);
