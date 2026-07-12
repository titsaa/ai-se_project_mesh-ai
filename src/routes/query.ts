import { Router } from "express";

import { createQuery } from "../controllers/query.js";
import { auth } from "../middleware/auth.js";

export const queryRouter = Router();

queryRouter.use(auth);
queryRouter.post("/", createQuery);
