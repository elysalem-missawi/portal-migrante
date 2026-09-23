import { Router } from "express";
import { login } from "../controllers/auth.controller";
import {
  createUser,
  registerUser,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { requireAuth, requirePlatformRoles } from "../middlewares/requireAuth";
import { requireSelfOrPlatformRoles } from "../middlewares/userAuthorization";

const router = Router();

router.post("/register", registerUser);
// Temporary compatibility alias. New clients must use POST /api/auth/login.
router.post("/login", login);
router.post("/:id/send-phone-code", sendPhoneVerificationCode);
router.post("/:id/verify-phone", verifyPhoneCode);
router
  .route("/")
  .get(
    requireAuth,
    requirePlatformRoles("moderator", "admin", "super_admin"),
    getUsers
  )
  .post(
    requireAuth,
    requirePlatformRoles("admin", "super_admin"),
    createUser
  );
router
  .route("/:id")
  .get(
    requireAuth,
    requireSelfOrPlatformRoles("moderator", "admin", "super_admin"),
    getUserById
  )
  .put(
    requireAuth,
    requireSelfOrPlatformRoles("admin", "super_admin"),
    updateUser
  )
  .delete(
    requireAuth,
    requirePlatformRoles("admin", "super_admin"),
    deleteUser
  );

export default router;
