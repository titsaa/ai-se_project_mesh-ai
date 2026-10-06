import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

const consoleFormat = isProduction
  ? winston.format.combine(winston.format.timestamp(), winston.format.json())
  : winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "HH:mm:ss" }),
      winston.format.printf(
        ({ timestamp, level, message, stack }) =>
          `${timestamp} ${level}: ${stack || message}`,
      ),
    );

// Morgan's "dev" format adds ANSI colors; keep them out of the log files.
const fileFormat = winston.format.combine(
  winston.format.uncolorize(),
  winston.format.timestamp(),
  winston.format.json(),
);

// Rotate at 5 MB and keep the 5 most recent files per log.
const rotation = { maxsize: 5 * 1024 * 1024, maxFiles: 5, tailable: true };

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? "http" : "debug"),
  format: winston.format.errors({ stack: true }),
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
      ...rotation,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
      ...rotation,
    }),
  ],
});
