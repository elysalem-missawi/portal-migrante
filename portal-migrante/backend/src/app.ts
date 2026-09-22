import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";

export interface CreateAppOptions {
  requestLogging?: boolean;
}

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://portal-migrante-frontend.onrender.com",
];

function getAllowedOrigins(): Set<string> {
  const configuredAllowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.ALLOWED_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set([
    ...defaultAllowedOrigins,
    ...configuredAllowedOrigins,
  ]);
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("CORS blocked origin: " + origin));
      },
      credentials: true,
    })
  );
  if (options.requestLogging !== false) app.use(morgan("dev"));
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

  return app;
}

export default createApp;
