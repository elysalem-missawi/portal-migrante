import { NextFunction, Request, Response } from "express";

import AuthSession from "../models/authSession.model";
import User, { PlatformRole } from "../models/user.model";
import { hashSessionToken } from "../services/auth.service";

/* =========================================================
   Authentication middleware
   ========================================================= */

/**
 * Validates the Bearer session token and attaches
 * the authenticated user information to req.auth.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorization = req.header("authorization") || "";

    const [scheme, token] = authorization.split(" ");

    /* -------------------------------------------------------
       1. Validate Authorization header
       ------------------------------------------------------- */

    if (scheme !== "Bearer" || !token) {
      res.status(401).json({
        message: "Authentication is required",
      });

      return;
    }

    /* -------------------------------------------------------
       2. Find active session
       ------------------------------------------------------- */

    const session = await AuthSession.findOne({
      tokenHash: hashSessionToken(token),

      revokedAt: null,

      expiresAt: {
        $gt: new Date(),
      },
    }).select("+tokenHash");

    if (!session) {
      res.status(401).json({
        message: "Session is invalid or expired",
      });

      return;
    }

    /* -------------------------------------------------------
       3. Find user
       ------------------------------------------------------- */

    const user = await User.findById(session.userId).select(
      "_id platformRole status"
    );

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });

      return;
    }

    /* -------------------------------------------------------
       4. Check account status
       ------------------------------------------------------- */

    if (
      user.status === "blocked" ||
      user.status === "inactive"
    ) {
      res.status(403).json({
        message: "User is not allowed to access this resource",
      });

      return;
    }

    /* -------------------------------------------------------
       5. Update session activity
       ------------------------------------------------------- */

    session.lastUsedAt = new Date();

    await session.save();

    /* -------------------------------------------------------
       6. Attach authentication context
       ------------------------------------------------------- */

    req.auth = {
      userId: String(user._id),

      sessionId: String(session._id),

      platformRole: user.platformRole,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/* =========================================================
   Platform role authorization
   ========================================================= */

/**
 * Allows access only to users whose platformRole
 * matches one of the required roles.
 *
 * Example:
 *
 * requirePlatformRoles("moderator", "admin")
 */
export const requirePlatformRoles =
  (...roles: PlatformRole[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (
      !req.auth ||
      !roles.includes(req.auth.platformRole)
    ) {
      res.status(403).json({
        message: "Insufficient platform permissions",
      });

      return;
    }

    next();
  };