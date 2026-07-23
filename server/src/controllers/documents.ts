import { readFile, unlink } from "node:fs/promises";

import type { Request, Response } from "express";

import Chunk from "../models/chunk.js";
import Document from "../models/document.js";
import { chunkText } from "../utils/chunk.js";
import { createEmbedding } from "../utils/embeddings.js";

import * as pdfParseModule from "pdf-parse";

const pdfParse = pdfParseModule as unknown as (
  buffer: Buffer,
) => Promise<{ text: string }>;

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

  try {
    const fileBuffer = await readFile(req.file.path);
    const parsed = await pdfParse(fileBuffer);
    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      fileName: req.file.originalname,
      userId,
    });

    const chunks = chunkText(parsed.text);

    await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await createEmbedding(chunk);
        await Chunk.create({
          documentId: document._id,
          text: chunk,
          embedding,
        });
      }),
    );

    await unlink(req.file.path).catch(() => undefined);

    res.status(201).json({ success: true, data: document, error: null });
  } catch (error) {
    await unlink(req.file.path).catch(() => undefined);
    res.status(500).json({
      success: false,
      data: null,
      error: { message: "Failed to process document" },
    });
    console.error(error);
  }
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
