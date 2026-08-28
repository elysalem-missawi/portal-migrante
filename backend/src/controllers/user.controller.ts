// src/controllers/user.controller.ts
import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user.model";
import {
  checkPhoneVerification,
  isTwilioVerifyConfigured,
  sendSms,
  startPhoneVerification,
} from "../services/twilio.service";

const PASSWORD_PREFIX = "scrypt";
const PHONE_CODE_TTL_MINUTES = 10;
const PHONE_CODE_MAX_ATTEMPTS = 5;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${PASSWORD_PREFIX}:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) return false;

  const [prefix, salt, hash] = storedHash.split(":");
  if (prefix !== PASSWORD_PREFIX || !salt || !hash) return false;

  const candidate = crypto.scryptSync(password, salt, 64);
  const saved = Buffer.from(hash, "hex");
  return saved.length === candidate.length && crypto.timingSafeEqual(saved, candidate);
}

function hashPhoneCode(code: string, userId: string): string {
  return crypto
    .createHash("sha256")
    .update(`${userId}:${code}:${process.env.ADMIN_API_KEY || "portal"}`)
    .digest("hex");
}

function createPhoneCode(): string {
  return String(crypto.randomInt(100000, 1000000));
}

async function assignAndSendPhoneCode(user: any) {
  if (!user.phone) {
    return { sent: false, skipped: true, reason: "missing_phone" };
  }

  if (isTwilioVerifyConfigured()) {
    user.phoneVerificationCodeHash = undefined;
    user.phoneVerificationExpiresAt = undefined;
    user.phoneVerificationSentAt = new Date();
    user.phoneVerificationAttempts = 0;
    await user.save();

    return startPhoneVerification(user.phone);
  }

  const code = createPhoneCode();
  user.phoneVerificationCodeHash = hashPhoneCode(code, String(user._id));
  user.phoneVerificationExpiresAt = new Date(
    Date.now() + PHONE_CODE_TTL_MINUTES * 60 * 1000
  );
  user.phoneVerificationSentAt = new Date();
  user.phoneVerificationAttempts = 0;
  await user.save();

  return sendSms(
    user.phone,
    `Portal Migrante Euskadi: your verification code is ${code}. It expires in ${PHONE_CODE_TTL_MINUTES} minutes.`
  );
}

function publicUser(user: any) {
  const obj = typeof user.toObject === "function" ? user.toObject() : user;
  delete obj.passwordHash;
  delete obj.phoneVerificationCodeHash;
  delete obj.phoneVerificationExpiresAt;
  delete obj.phoneVerificationSentAt;
  delete obj.phoneVerificationAttempts;
  if (obj.identityDocument) {
    delete obj.identityDocument.dataUrl;
  }
  return obj;
}

function normalizeIdentityDocument(value: any) {
  if (!value) return undefined;

  const fileName = typeof value.fileName === "string" ? value.fileName.trim() : "";
  const mimeType = typeof value.mimeType === "string" ? value.mimeType.trim() : "";
  const dataUrl = typeof value.dataUrl === "string" ? value.dataUrl.trim() : "";
  const size = Number(value.size || 0);

  if (!fileName || !mimeType || !dataUrl || !Number.isFinite(size) || size <= 0) {
    return undefined;
  }

  if (size > 3 * 1024 * 1024) {
    return undefined;
  }

  return {
    fileName,
    mimeType,
    size,
    dataUrl,
    uploadedAt: new Date(),
  };
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = { ...req.body };

    if (typeof data.password === "string" && data.password.length >= 8) {
      data.passwordHash = hashPassword(data.password);
      delete data.password;
    }

    if (data.identityDocument) {
      data.identityDocument = normalizeIdentityDocument(data.identityDocument);
    }

    const user = await User.create(data);
    res.status(201).json(publicUser(user));
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const filter = q
      ? {
          $or: [
            { fullName: { $regex: q, $options: "i" } },
            { displayName: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(filter)
      .select("-passwordHash -identityDocument.dataUrl")
      .populate("organizationId", "name type slug status verified")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select("-passwordHash -identityDocument.dataUrl")
      .populate("organizationId", "name type slug status verified");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .select("-passwordHash -identityDocument.dataUrl")
      .populate("organizationId", "name type slug status verified");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    const identityDocument = normalizeIdentityDocument(req.body.identityDocument);
    const legalConsentAccepted = Boolean(req.body.legalConsentAccepted);

    if (password.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters" });
      return;
    }

    if (!phone) {
      res.status(400).json({ message: "Phone is required" });
      return;
    }

    if (!legalConsentAccepted) {
      res.status(400).json({ message: "Legal consent is required" });
      return;
    }

    const user = await User.create({
      accountType: req.body.accountType || "individual",
      role: req.body.role || "community_user",
      fullName: req.body.fullName,
      displayName: req.body.displayName,
      email: req.body.email,
      phone,
      phoneVerified: false,
      preferredLanguage: req.body.preferredLanguage,
      originCountry: req.body.originCountry,
      nativeLanguage: req.body.nativeLanguage,
      municipality: req.body.municipality,
      profileImage: req.body.profileImage,
      organizationId: req.body.organizationId || null,
      status: "pending",
      isVerified: false,
      passwordHash: hashPassword(password),
      identityDocument,
      legalConsentAccepted,
      legalConsentAt: new Date(),
    });

    const sms = await assignAndSendPhoneCode(user).catch((error) => ({
      sent: false,
      reason: error.message,
    }));

    res.status(201).json({
      user: publicUser(user),
      phoneVerification: sms,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const sendPhoneVerificationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select(
      "+phoneVerificationCodeHash +phoneVerificationExpiresAt +phoneVerificationSentAt +phoneVerificationAttempts"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.phone) {
      res.status(400).json({ message: "User phone is required" });
      return;
    }

    const sms = await assignAndSendPhoneCode(user);
    if (sms.skipped && sms.reason === "twilio_not_configured") {
      res.status(503).json({
        message: "Twilio is not configured",
        phoneVerification: sms,
      });
      return;
    }

    res.status(200).json({
      message: "Verification code sent",
      phoneVerification: sms,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to send verification code",
      error: error.message,
    });
  }
};

export const verifyPhoneCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const code = typeof req.body.code === "string" ? req.body.code.trim() : "";
    const user = await User.findById(req.params.id).select(
      "+phoneVerificationCodeHash +phoneVerificationExpiresAt +phoneVerificationSentAt +phoneVerificationAttempts"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!code || !/^\d{6}$/.test(code)) {
      res.status(400).json({ message: "A valid 6-digit code is required" });
      return;
    }

    if (isTwilioVerifyConfigured()) {
      if (user.phoneVerificationAttempts >= PHONE_CODE_MAX_ATTEMPTS) {
        res.status(429).json({ message: "Too many verification attempts" });
        return;
      }

      user.phoneVerificationAttempts += 1;
      const verification = await checkPhoneVerification(user.phone || "", code);

      if (!verification.approved) {
        await user.save();
        res.status(400).json({ message: "Invalid verification code" });
        return;
      }

      user.phoneVerified = true;
      user.phoneVerificationCodeHash = undefined;
      user.phoneVerificationExpiresAt = undefined;
      user.phoneVerificationAttempts = 0;
      await user.save();

      res.status(200).json(publicUser(user));
      return;
    }

    if (
      !user.phoneVerificationCodeHash ||
      !user.phoneVerificationExpiresAt ||
      user.phoneVerificationExpiresAt.getTime() < Date.now()
    ) {
      res.status(400).json({ message: "Verification code expired" });
      return;
    }

    if (user.phoneVerificationAttempts >= PHONE_CODE_MAX_ATTEMPTS) {
      res.status(429).json({ message: "Too many verification attempts" });
      return;
    }

    user.phoneVerificationAttempts += 1;

    const expected = hashPhoneCode(code, String(user._id));
    if (expected !== user.phoneVerificationCodeHash) {
      await user.save();
      res.status(400).json({ message: "Invalid verification code" });
      return;
    }

    user.phoneVerified = true;
    user.phoneVerificationCodeHash = undefined;
    user.phoneVerificationExpiresAt = undefined;
    user.phoneVerificationAttempts = 0;
    await user.save();

    res.status(200).json(publicUser(user));
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to verify phone",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash"
    );

    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (user.status === "blocked" || user.status === "inactive") {
      res.status(403).json({ message: "User is not allowed to login" });
      return;
    }

    res.status(200).json(publicUser(user));
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};
