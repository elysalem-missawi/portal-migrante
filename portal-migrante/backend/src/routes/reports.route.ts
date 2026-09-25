import { Router } from "express";

import {
  createReport,
  getReports,
  updateReport,
} from "../controllers/report.controller";

import {
  requireAuth,
  requirePlatformRoles,
} from "../middlewares/requireAuth";

const router = Router();

router.post(
  "/",
  requireAuth,
  createReport
);

router.get(
  "/",
  requireAuth,
  requirePlatformRoles(
    "moderator",
    "admin"
  ),
  getReports
);

router.put(
  "/:id",
  requireAuth,
  requirePlatformRoles(
    "moderator",
    "admin"
  ),
  updateReport
);

export default router;
