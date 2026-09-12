import { Router } from "express";
import {
  createModerationAction,
  getModerationActions,
} from "../controllers/moderationAction.controller";
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.use(requireWriteAccess);
router.post("/", createModerationAction);
router.get("/publication/:publicationId", getModerationActions);

export default router;
