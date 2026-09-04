import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { getCurrentUser } from "../controllers/users.js";

export const usersRouter = Router();

usersRouter.use(auth);
usersRouter.get("/me", getCurrentUser);
