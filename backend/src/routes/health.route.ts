// src/routes/health.route.ts
import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    status: "healthy",
    time: new Date().toISOString(),
  });
});

export default router;