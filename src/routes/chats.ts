import { Router } from "express";

import { createChat, getChat, getChats } from "../controllers/chats.js";
import { auth } from "../middleware/auth.js";

export const chatsRouter = Router();

chatsRouter.use(auth);
chatsRouter.post("/", createChat);
chatsRouter.get("/", getChats);
chatsRouter.get("/:id", getChat);
