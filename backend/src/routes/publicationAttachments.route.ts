import { Router } from "express";
import {
  archivePublicationAttachment,
  createPublicationAttachment,
  getPublicationAttachments,
} from "../controllers/publicationAttachment.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/publication/:publicationId", getPublicationAttachments);
router.post("/", requireAuth, createPublicationAttachment);
router.delete("/:id", requireAuth, archivePublicationAttachment);

export default router;
