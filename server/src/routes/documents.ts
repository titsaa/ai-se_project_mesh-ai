import { Router } from "express";
import multer from "multer";

import { createDocument, getDocuments } from "../controllers/documents.js";
import { auth } from "../middleware/auth.js";

export const documentsRouter = Router();
const upload = multer({ dest: "uploads/" });

documentsRouter.use(auth);
documentsRouter.post("/", upload.single("file"), createDocument);
documentsRouter.get("/", getDocuments);
