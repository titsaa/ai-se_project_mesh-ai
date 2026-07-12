import type { Request, Response } from "express";
import Chunk from "../models/chunk.js";
import Document from "../models/document.js";
import { buildContext, getClient, LLM_MODEL } from "../utils/openai-client.js";
import { createEmbedding } from "../utils/embeddings.js";
import { rankBySimilarity } from "../utils/vector-search.js";

export const createQuery = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { question } = req.body;
  const userId = req.user?.userId;

  if (!question || !userId) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: "question and authentication are required" },
    });
    return;
  }

  const userDocs = await Document.find({ userId }, "_id");
  const docIds = userDocs.map((doc) => doc._id);
  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((chunk) => ({
    id: String(chunk._id),
    documentId: String(chunk.documentId),
    text: chunk.text,
    embedding: chunk.embedding,
  }));

  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
  const context = buildContext(ranked);

  const response = await getClient().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You answer questions using only the provided context. If the context is insufficient, say so clearly.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  const answer =
    response.choices[0]?.message?.content ?? "No answer generated.";
  res.status(200).json({ success: true, data: { answer }, error: null });
};
