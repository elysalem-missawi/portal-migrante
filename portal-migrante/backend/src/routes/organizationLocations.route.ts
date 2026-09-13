import { Router } from "express";
import {
  archiveOrganizationLocation,
  createOrganizationLocation,
  getMyOrganizationLocations,
  getOrganizationLocationById,
  getOrganizationLocations,
  updateOrganizationLocation,
} from "../controllers/organizationLocation.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/mine", requireAuth, getMyOrganizationLocations);
router
  .route("/")
  .get(getOrganizationLocations)
  .post(requireAuth, createOrganizationLocation);
router
  .route("/:id")
  .get(getOrganizationLocationById)
  .put(requireAuth, updateOrganizationLocation)
  .delete(requireAuth, archiveOrganizationLocation);

export default router;
