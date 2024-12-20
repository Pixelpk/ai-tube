import express from "express";
import "express-async-errors";
import path from "path";
import cors from "cors";
import logger from "loglevel";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

import { getRoutes } from "./routes";
import { errorMiddleware, setupCloseOnExit } from "./middleware/error";

dotenv.config();

const prisma = new PrismaClient();

async function startServer({ port = process.env.PORT } = {}) {
  const app = express();
  app.use(morgan("dev"));
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  // Database connection check during startup
  try {
    await prisma.$connect();
    logger.info("Database connected successfully!");
  } catch (error) {
    logger.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if the database connection fails
  }

  // all API routes are prefixed with /api/v1
  app.use("/api/v1", getRoutes());

  // Generic error handler if errors are missed by 'express-async-errors' middleware
  app.use(errorMiddleware);

  // Serve React app in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app.get("*", function (req, res) {
      res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
    });
  }

  // Reliable server start and close logic
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`);

      const originalClose = server.close.bind(server);
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };

      // Ensure proper cleanup on app exit
      setupCloseOnExit(server);
      resolve(server);
    });
  });
}

export { startServer };
