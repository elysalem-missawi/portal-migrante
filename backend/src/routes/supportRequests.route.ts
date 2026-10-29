import {
  Router,
} from "express";

import {
  closeSupportRequest,
  createSupportRequest,
  getMySupportRequests,
  getSupportRequestById,
  getSupportRequests,
  manageSupportRequest,
  updateSupportRequest,
} from "../controllers/supportRequest.controller";

import {
  requireAuth,
  requirePlatformRoles,
} from "../middlewares/requireAuth";

const router =
  Router();

/* =========================================================
   User
========================================================= */

router.post(
  "/",
  requireAuth,
  createSupportRequest
);

router.get(
  "/my",
  requireAuth,
  getMySupportRequests
);

/* =========================================================
   Staff
========================================================= */

router.get(
  "/",
  requireAuth,
  requirePlatformRoles(
    "moderator",
    "admin"
  ),
  getSupportRequests
);

router.put(
  "/:id/manage",
  requireAuth,
  requirePlatformRoles(
    "moderator",
    "admin"
  ),
  manageSupportRequest
);

/* =========================================================
   Single request
========================================================= */

router
  .route(
    "/:id"
  )
  .get(
    requireAuth,
    getSupportRequestById
  )
  .put(
    requireAuth,
    updateSupportRequest
  )
  .delete(
    requireAuth,
    closeSupportRequest
  );

export default router;