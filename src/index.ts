import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { logger } from "./middleware/logger.js";
import { router } from "./routes/index.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.use(logger);

app.use(router);

app.get("/test-error", (req, res) => {
  void req;
  void res;

  throw new Error("Test error");
});

app.use(notFoundHandler);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/meshai")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
