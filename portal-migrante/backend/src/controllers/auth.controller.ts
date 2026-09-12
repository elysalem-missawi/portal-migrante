import crypto from "crypto";
import { Request, Response } from "express";
import AuthSession from "../models/authSession.model";
import User from "../models/user.model";
import { createAuthSession } from "../services/auth.service";

const PASSWORD_PREFIX = "scrypt";

function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) return false;
  const [prefix, salt, hash] = storedHash.split(":");
  if (prefix !== PASSWORD_PREFIX || !salt || !hash) return false;

  const candidate = crypto.scryptSync(password, salt, 64);
  const saved = Buffer.from(hash, "hex");
  return saved.length === candidate.length && crypto.timingSafeEqual(saved, candidate);
}

function publicUser(user: any) {
  const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.phoneVerificationCodeHash;
  delete obj.phoneVerificationExpiresAt;
  delete obj.phoneVerificationSentAt;
  delete obj.phoneVerificationAttempts;
  if (obj.identityDocument) delete obj.identityDocument.dataUrl;
  return obj;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    if (user.status === "blocked" || user.status === "inactive") {
      res.status(403).json({ message: "User is not allowed to login" });
      return;
    }

    const session = await createAuthSession(String(user._id), {
      userAgent: req.header("user-agent"),
      ipAddress: req.ip,
    });

    res.status(200).json({ user: publicUser(user), ...session });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    await AuthSession.findByIdAndUpdate(req.auth?.sessionId, {
      revokedAt: new Date(),
    });
    res.status(200).json({ message: "Session closed" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to logout", error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.auth?.userId)
      .select("-passwordHash -identityDocument.dataUrl")
      .populate("municipalityId", "name slug territory");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch current user", error: error.message });
  }
};
