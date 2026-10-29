import {
  Router,
} from "express";

import {
  closeHelpOffer,
  createHelpOffer,
  getHelpOfferById,
  getHelpOffers,
  getMyHelpOffers,
  manageHelpOffer,
  updateHelpOffer,
} from "../controllers/helpOffer.controller";

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
  createHelpOffer
);

router.get(
  "/my",
  requireAuth,
  getMyHelpOffers
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
  getHelpOffers
);

router.put(
  "/:id/manage",
  requireAuth,
  requirePlatformRoles(
    "moderator",
    "admin"
  ),
  manageHelpOffer
);

/* =========================================================
   Single offer
========================================================= */

router
  .route(
    "/:id"
  )
  .get(
    requireAuth,
    getHelpOfferById
  )
  .put(
    requireAuth,
    updateHelpOffer
  )
  .delete(
    requireAuth,
    closeHelpOffer
  );

export default router;
