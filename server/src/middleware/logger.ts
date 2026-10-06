import morgan from "morgan";

import { logger } from "../utils/logger.js";

const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

export const requestLogger = morgan(format, {
  stream: { write: (message) => logger.http(message.trim()) },
});
