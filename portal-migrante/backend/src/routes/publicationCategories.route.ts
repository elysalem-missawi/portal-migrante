import { Router } from "express";
import {
  archivePublicationCategory,
  createPublicationCategory,
  getPublicationCategories,
  updatePublicationCategory,
} from "../controllers/publicationCategory.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.route("/").get(getPublicationCategories).post(requireWriteAccess, createPublicationCategory);
router
  .route("/:id")
  .put(requireWriteAccess, updatePublicationCategory)
  .delete(requireWriteAccess, archivePublicationCategory);

export default router;
