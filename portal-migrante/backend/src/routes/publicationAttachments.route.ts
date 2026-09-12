import { Router } from "express";
import {
  archivePublicationAttachment,
  createPublicationAttachment,
  getPublicationAttachments,
} from "../controllers/publicationAttachment.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.get("/publication/:publicationId", getPublicationAttachments);
router.post("/", requireWriteAccess, createPublicationAttachment);
router.delete("/:id", requireWriteAccess, archivePublicationAttachment);

export default router;
