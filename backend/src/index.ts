// src/index.ts
import dotenv from "dotenv";

import { createApp } from "./app";
import { connectDB, disconnectDB } from "./config/db";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portal";

async function bootstrap(): Promise<void> {
  const app = createApp();
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
