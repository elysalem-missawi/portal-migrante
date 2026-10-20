import crypto from "crypto";
import { Request, Response } from "express";

import AuthSession from "../models/authSession.model";
import User from "../models/user.model";
import { createAuthSession } from "../services/auth.service";

/* =========================================================
   Constants
   ========================================================= */

const PASSWORD_PREFIX = "scrypt";
const MIN_PASSWORD_LENGTH = 8;

/* =========================================================
   Helpers
   ========================================================= */

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${PASSWORD_PREFIX}:${salt}:${hash}`;
}

function verifyPassword(
  password: string,
  storedHash?: string
): boolean {
  if (!storedHash) {
    return false;
  }

  const [prefix, salt, hash] =
    storedHash.split(":");

  if (
    prefix !== PASSWORD_PREFIX ||
    !salt ||
    !hash
  ) {
    return false;
  }

  const candidate = crypto.scryptSync(
    password,
    salt,
    64
  );

  const saved = Buffer.from(
    hash,
    "hex"
  );

  return (
    saved.length === candidate.length &&
    crypto.timingSafeEqual(
      saved,
      candidate
    )
  );
}

function publicUser(user: any) {
  const obj =
    typeof user.toObject === "function"
      ? user.toObject()
      : { ...user };

  delete obj.passwordHash;

  return obj;
}

/* =========================================================
   LOGIN
   POST /api/auth/login
   ========================================================= */

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email
            .trim()
            .toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string"
        ? req.body.password
        : "";

    /* -----------------------------------------------------
       Validate request
       ----------------------------------------------------- */

    if (!email || !password) {
      res.status(400).json({
        message:
          "Email and password are required",
      });
      return;
    }

    /* -----------------------------------------------------
       Find user + password hash
       ----------------------------------------------------- */

    const user = await User.findOne({
      email,
    }).select("+passwordHash");

    if (
      !user ||
      !verifyPassword(
        password,
        user.passwordHash
      )
    ) {
      /*
       * Keep the same response for:
       * - unknown email
       * - wrong password
       *
       * This avoids revealing whether
       * an email exists in the system.
       */
      res.status(401).json({
        message:
          "Invalid email or password",
      });
      return;
    }

    /* -----------------------------------------------------
       Account status
       ----------------------------------------------------- */

    if (
      user.status === "blocked" ||
      user.status === "inactive"
    ) {
      res.status(403).json({
        message:
          "User is not allowed to login",
      });
      return;
    }

    /* -----------------------------------------------------
       Create session
       ----------------------------------------------------- */

    const session =
      await createAuthSession(
        String(user._id),
        {
          userAgent:
            req.header("user-agent"),

          ipAddress:
            req.ip,
        }
      );

    /* -----------------------------------------------------
       Response
       ----------------------------------------------------- */

    res.status(200).json({
      message:
        "Login successful",

      user:
        publicUser(user),

      ...session,
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        "Failed to login",

      error:
        error.message,
    });
  }
};

/* =========================================================
   LOGOUT
   POST /api/auth/logout
   ========================================================= */

export const logout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.auth?.sessionId) {
      res.status(401).json({
        message:
          "Authentication is required",
      });
      return;
    }

    await AuthSession.findByIdAndUpdate(
      req.auth.sessionId,
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      message:
        "Session closed successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        "Failed to logout",

      error:
        error.message,
    });
  }
};

/* =========================================================
   CURRENT USER
   GET /api/auth/me
   ========================================================= */

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({
        message:
          "Authentication is required",
      });
      return;
    }

    const user = await User.findById(
      req.auth.userId
    ).populate(
      "municipalityId",
      "name slug territory"
    );

    if (!user) {
      res.status(404).json({
        message:
          "User not found",
      });
      return;
    }

    res.status(200).json({
      user:
        publicUser(user),
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        "Failed to fetch current user",

      error:
        error.message,
    });
  }
};

/* =========================================================
   CHANGE PASSWORD
   PUT /api/auth/password
   ========================================================= */

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({
        message: "Authentication is required",
      });
      return;
    }

    const currentPassword =
      typeof req.body.currentPassword === "string"
        ? req.body.currentPassword
        : "";

    const newPassword =
      typeof req.body.newPassword === "string"
        ? req.body.newPassword
        : "";

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        message: "Current password and new password are required",
      });
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      res.status(400).json({
        message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
      return;
    }

    if (currentPassword === newPassword) {
      res.status(400).json({
        message: "New password must be different from current password",
      });
      return;
    }

    const user = await User.findById(req.auth.userId).select("+passwordHash");

    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      res.status(401).json({
        message: "Current password is incorrect",
      });
      return;
    }

    user.passwordHash = hashPassword(newPassword);
    await user.save();

    await AuthSession.updateMany(
      {
        userId: user._id,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      message: "Password changed successfully. Please sign in again.",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to change password",
      error: error.message,
    });
  }
};
