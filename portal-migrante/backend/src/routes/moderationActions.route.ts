import { Router } from "express";
import {
  createModerationAction,
  getModerationActions,
  getTargetModerationActions,
} from "../controllers/moderationAction.controller";
import {
  getReviewQueue,
  reviewTarget,
} from "../controllers/platformModeration.controller";
import {
  requireAuth,
  requirePlatformRoles,
} from "../middlewares/requireAuth";

const router = Router();

router.use(
  requireAuth,
  requirePlatformRoles("moderator", "admin")
);

router.get("/queue", getReviewQueue);
router.post("/review", reviewTarget);
router.get(
  "/target/:targetType/:targetId",
  getTargetModerationActions
);

// Existing publication moderation endpoints remain available.
router.post("/", createModerationAction);
router.get(
  "/publication/:publicationId",
  getModerationActions
);

export default router;
