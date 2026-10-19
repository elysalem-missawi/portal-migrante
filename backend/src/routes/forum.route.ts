import { Router } from "express";
import {
  addForumComment,
  createForumMessage,
  createForumPost,
  getForumMessages,
  getForumPosts,
} from "../controllers/forum.controller";

const router = Router();

router.route("/posts").get(getForumPosts).post(createForumPost);
router.route("/posts/:id/comments").post(addForumComment);
router.route("/messages").get(getForumMessages).post(createForumMessage);

export default router;
