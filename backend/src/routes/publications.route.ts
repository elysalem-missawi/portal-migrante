import { Router } from "express";
import {
  archivePublication,
  createPublication,
  getPublicationById,
  getPublications,
  updatePublication,
} from "../controllers/publication.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.route("/").get(getPublications).post(requireAuth, createPublication);
router
  .route("/:id")
  .get(getPublicationById)
  .put(requireAuth, updatePublication)
  .delete(requireAuth, archivePublication);

export default router;
