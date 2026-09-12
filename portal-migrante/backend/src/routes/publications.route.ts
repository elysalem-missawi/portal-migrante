import { Router } from "express";
import {
  archivePublication,
  createPublication,
  getPublicationById,
  getPublications,
  updatePublication,
} from "../controllers/publication.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.route("/").get(getPublications).post(requireWriteAccess, createPublication);
router
  .route("/:id")
  .get(getPublicationById)
  .put(requireWriteAccess, updatePublication)
  .delete(requireWriteAccess, archivePublication);

export default router;
