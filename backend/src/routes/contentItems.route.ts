import { Router } from "express";

import {
  createContentItem,
  deactivateContentItem,
  getContentItemById,
  getContentItems,
  updateContentItem,
} from "../controllers/contentItem.controller";

import {
  requireAuth,
  requirePlatformRoles,
} from "../middlewares/requireAuth";

const router =
  Router();

const admins =
  requirePlatformRoles(
    "admin"
  );

/* =========================================================
   Collection
========================================================= */

router
  .route("/")
  .get(
    getContentItems
  )
  .post(
    requireAuth,
    admins,
    createContentItem
  );

/* =========================================================
   Single item
========================================================= */

router
  .route("/:id")
  .get(
    getContentItemById
  )
  .put(
    requireAuth,
    admins,
    updateContentItem
  )
  .delete(
    requireAuth,
    admins,
    deactivateContentItem
  );

export default router;