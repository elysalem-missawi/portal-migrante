// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB, disconnectDB } from "./config/db";
import router from "./routes";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portal";
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://portal-migrante-frontend.onrender.com",
];
const configuredAllowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.ALLOWED_ORIGINS,
]
  .filter(Boolean)
  .flatMap((value) => String(value).split(","))
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  ...defaultAllowedOrigins,
  ...configuredAllowedOrigins,
]);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Portal Migrante API is running",
    status: "ok",
  });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "Portal Migrante API",
    status: "ok",
  });
});

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

async function bootstrap(): Promise<void> {
  const server = app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });

  try {
    await connectDB(MONGO_URI);
  } catch (err) {
    console.error(
      "MongoDB connection failed. API will keep running with read-only fallback data where available.",
      err
    );
  }

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Closing gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

bootstrap().catch((err) => {
  console.error("Bootstrap error:", err);
  process.exit(1);
});
