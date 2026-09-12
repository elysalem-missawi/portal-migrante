import { Router } from "express";
import {
  createModerationAction,
  getModerationActions,
} from "../controllers/moderationAction.controller";
import { requireAuth, requirePlatformRoles } from "../middlewares/requireAuth";

const router = Router();

router.use(
  requireAuth,
  requirePlatformRoles("moderator", "admin", "super_admin")
);
router.post("/", createModerationAction);
router.get("/publication/:publicationId", getModerationActions);

export default router;
