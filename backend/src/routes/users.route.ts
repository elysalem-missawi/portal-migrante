// src/routes/users.route.ts
import { Router } from "express";
import {
  createUser,
  registerUser,
  loginUser,
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
router.post("/login", loginUser);
router.post("/:id/send-phone-code", sendPhoneVerificationCode);
router.post("/:id/verify-phone", verifyPhoneCode);
router.route("/").get(getUsers).post(requireWriteAccess, createUser);
router
  .route("/:id")
  .get(getUserById)
  .put(requireWriteAccess, updateUser)
  .delete(requireWriteAccess, deleteUser);

export default router;
