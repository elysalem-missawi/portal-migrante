import { Router } from "express";
import {
  archiveServiceCategory,
  createServiceCategory,
  getServiceCategories,
  updateServiceCategory,
} from "../controllers/serviceCategory.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router
  .route("/")
  .get(getServiceCategories)
  .post(requireWriteAccess, createServiceCategory);

router
  .route("/:id")
  .put(requireWriteAccess, updateServiceCategory)
  .delete(requireWriteAccess, archiveServiceCategory);

export default router;
