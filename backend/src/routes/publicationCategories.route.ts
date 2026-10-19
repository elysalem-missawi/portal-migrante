import { Router } from "express";
import {
  archivePublicationCategory,
  createPublicationCategory,
  getPublicationCategories,
  updatePublicationCategory,
} from "../controllers/publicationCategory.controller";
import { requireAuth, requirePlatformRoles } from "../middlewares/requireAuth";

const router = Router();
const admins = requirePlatformRoles("admin");

router.route("/").get(getPublicationCategories).post(requireAuth, admins, createPublicationCategory);
router
  .route("/:id")
  .put(requireAuth, admins, updatePublicationCategory)
  .delete(requireAuth, admins, archivePublicationCategory);

export default router;
