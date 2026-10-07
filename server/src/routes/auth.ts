import { Router } from "express";

import { login, register } from "../controllers/auth.js";
import { loginLimiter, registerLimiter } from "../middleware/rate-limit.js";

export const authRouter = Router();

authRouter.post("/register", registerLimiter, register);
authRouter.post("/login", loginLimiter, login);
