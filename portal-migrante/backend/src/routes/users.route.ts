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
import requireWriteAccess from "../middlewares/requireWriteAccess";

const router = Router();

router.post("/register", registerUser);
// Temporary compatibility alias. New clients must use POST /api/auth/login.
router.post("/login", login);
router.post("/:id/send-phone-code", sendPhoneVerificationCode);
router.post("/:id/verify-phone", verifyPhoneCode);
router.route("/").get(getUsers).post(requireWriteAccess, createUser);
router
  .route("/:id")
  .get(getUserById)
  .put(requireWriteAccess, updateUser)
  .delete(requireWriteAccess, deleteUser);

export default router;
