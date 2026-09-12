import { Router } from "express";
import {
  archiveOrganizationLocation,
  createOrganizationLocation,
  getOrganizationLocationById,
  getOrganizationLocations,
  updateOrganizationLocation,
} from "../controllers/organizationLocation.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router
  .route("/")
  .get(getOrganizationLocations)
  .post(requireWriteAccess, createOrganizationLocation);

router
  .route("/:id")
  .get(getOrganizationLocationById)
  .put(requireWriteAccess, updateOrganizationLocation)
  .delete(requireWriteAccess, archiveOrganizationLocation);

export default router;
