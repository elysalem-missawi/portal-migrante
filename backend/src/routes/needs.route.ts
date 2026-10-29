import { Router } from "express";

import {
  createNeed,
  deactivateNeed,
  getNeedById,
  getNeeds,
  updateNeed,
} from "../controllers/need.controller";

import {
  requireAuth,
  requirePlatformRoles,
} from "../middlewares/requireAuth";

const router = Router();

const admins =
  requirePlatformRoles("admin");

router
  .route("/")
  .get(getNeeds)
  .post(
    requireAuth,
    admins,
    createNeed
  );

router
  .route("/:id")
  .get(getNeedById)
  .put(
    requireAuth,
    admins,
    updateNeed
  )
  .delete(
    requireAuth,
    admins,
    deactivateNeed
  );

export default router;