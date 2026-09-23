import { NextFunction, Request, Response } from "express";
import AuthSession from "../models/authSession.model";
import User, { PlatformRole } from "../models/user.model";
import { hashSessionToken } from "../services/auth.service";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorization = req.header("authorization") || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      res.status(401).json({ message: "Authentication is required" });
      return;
    }

    const session = await AuthSession.findOne({
      tokenHash: hashSessionToken(token),
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).select("+tokenHash");

    if (!session) {
      res.status(401).json({ message: "Session is invalid or expired" });
      return;
    }

    const user = await User.findById(session.userId).select(
      "_id platformRole role status phoneVerified isVerified"
    );

    if (!user || user.status === "blocked" || user.status === "inactive") {
      res.status(403).json({ message: "User is not allowed to access this resource" });
      return;
    }

    session.lastUsedAt = new Date();
    await session.save();

    req.auth = {
      userId: String(user._id),
      sessionId: String(session._id),
      platformRole:
        user.platformRole ||
        (user.role === "super_admin"
          ? "super_admin"
          : user.role === "admin"
            ? "admin"
            : "user"),
      phoneVerified: user.phoneVerified,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export const requirePlatformRoles =
  (...roles: PlatformRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.platformRole)) {
      res.status(403).json({ message: "Insufficient platform permissions" });
      return;
    }
    next();
  };
