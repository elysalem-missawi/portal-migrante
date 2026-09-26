import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
} from "../controllers/auth.controller";

import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

/* =========================================================
   Authentication routes
   ========================================================= */

router.post("/login", login);

router.post(
  "/logout",
  requireAuth,
  logout
);

router.get(
  "/me",
  requireAuth,
  getCurrentUser
);

export default router;