// src/routes/organizations.route.ts
import { Router } from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organization.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.route("/").get(getOrganizations).post(requireWriteAccess, createOrganization);
router.route("/:id")
  .get(getOrganizationById)
  .put(requireWriteAccess, updateOrganization)
  .delete(requireWriteAccess, deleteOrganization);

export default router;
