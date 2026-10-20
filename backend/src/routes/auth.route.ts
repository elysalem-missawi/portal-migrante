import { Router } from "express";

import {
  changePassword,
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

router.put(
  "/password",
  requireAuth,
  changePassword
);

export default router;