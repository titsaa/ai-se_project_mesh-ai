import test from "node:test";
import assert from "node:assert/strict";

import { chunkText } from "./chunk.js";
import { buildContext } from "./openai-client.js";

test("chunkText splits a long string into fixed-size chunks", () => {
  const text = "a".repeat(1200);
  const chunks = chunkText(text);

  assert.equal(chunks.length, 3);
  assert.equal(chunks[0]?.length, 500);
  assert.equal(chunks[1]?.length, 500);
  assert.equal(chunks[2]?.length, 200);
});

test("buildContext returns a helpful fallback when no chunks are available", () => {
  const context = buildContext([]);

  assert.equal(context, "No relevant context found.");
});
