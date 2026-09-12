import { Router } from "express";
import {
  archiveServiceCategory,
  createServiceCategory,
  getServiceCategories,
  updateServiceCategory,
} from "../controllers/serviceCategory.controller";
import { requireAuth, requirePlatformRoles } from "../middlewares/requireAuth";

const router = Router();
const admins = requirePlatformRoles("admin", "super_admin");

router.route("/").get(getServiceCategories).post(requireAuth, admins, createServiceCategory);
router
  .route("/:id")
  .put(requireAuth, admins, updateServiceCategory)
  .delete(requireAuth, admins, archiveServiceCategory);

export default router;
