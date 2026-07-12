import type { Request, Response } from "express";
import Document from "../models/document.js";

export const createDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId || !req.file) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: "file and authentication are required" },
    });
    return;
  }

  const document = await Document.create({
    title: req.body.title || req.file.originalname,
    fileName: req.file.originalname,
    userId,
  });

  res.status(201).json({ success: true, data: document, error: null });
};

export const getDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res
      .status(401)
      .json({ success: false, data: null, error: { message: "Unauthorized" } });
    return;
  }

  const documents = await Document.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: documents, error: null });
};
