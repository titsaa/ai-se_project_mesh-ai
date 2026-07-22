import type { Request, Response } from "express";

import Chat from "../models/chat.js";
import Chunk from "../models/chunk.js";
import Document from "../models/document.js";
import Message from "../models/message.js";
import { createEmbedding } from "../utils/embeddings.js";
import { buildContext, getClient, LLM_MODEL } from "../utils/openai-client.js";
import { rankBySimilarity } from "../utils/vector-search.js";

export const createMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { content } = req.body;
  const userId = req.user?.userId;

  if (!content || !userId) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: "content and authentication are required" },
    });
    return;
  }

  const chat = await Chat.findOne({ _id: req.params.id, userId });
  if (!chat) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: "Chat not found" },
    });
    return;
  }

  const userMessage = await Message.create({
    chatId: chat._id,
    role: "user",
    content,
  });

  const userDocs = await Document.find({ userId }, "_id");
  const docIds = userDocs.map((doc) => doc._id);
  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((chunk) => ({
    id: String(chunk._id),
    documentId: String(chunk.documentId),
    text: chunk.text,
    embedding: chunk.embedding,
  }));

  const queryEmbedding = await createEmbedding(content);
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
        content: `Context:\n${context}\n\nQuestion: ${content}`,
      },
    ],
  });

  const answer =
    response.choices[0]?.message?.content ?? "No answer generated.";

  const assistantMessage = await Message.create({
    chatId: chat._id,
    role: "assistant",
    content: answer,
  });

  res.status(201).json({
    success: true,
    data: { chat, messages: [userMessage, assistantMessage] },
    error: null,
  });
};
