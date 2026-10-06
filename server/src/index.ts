import "dotenv/config";

import express from "express";
import mongoose from "mongoose";

import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { requestLogger } from "./middleware/logger.js";
import { router } from "./routes/index.js";
import { logger } from "./utils/logger.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.set("trust proxy", 1);

app.use(express.json());

app.use(requestLogger);

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
    logger.info("MongoDB connected");
    app.listen(port, () =>
      logger.info(
        `Server running on port ${port} (${process.env.NODE_ENV || "development"})`,
      ),
    );
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err.stack || err}`);
    // Let Node exit on its own so Winston can finish writing to the log files.
    process.exitCode = 1;
  });
