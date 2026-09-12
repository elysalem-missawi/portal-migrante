import { Router } from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organization.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.route("/").get(getOrganizations).post(requireAuth, createOrganization);
router
  .route("/:id")
  .get(getOrganizationById)
  .put(requireAuth, updateOrganization)
  .delete(requireAuth, deleteOrganization);

export default router;
