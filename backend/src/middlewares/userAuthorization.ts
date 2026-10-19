import { NextFunction, Request, Response } from "express";
import type { PlatformRole } from "../models/user.model";

export const requireSelfOrPlatformRoles =
  (...roles: PlatformRole[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.auth) {
      res.status(401).json({
        message: "Authentication is required",
      });
      return;
    }

    const isSelf = req.auth.userId === req.params.id;
    const hasAllowedRole = roles.includes(req.auth.platformRole);

    if (!isSelf && !hasAllowedRole) {
      res.status(403).json({
        message: "You cannot access this user",
      });
      return;
    }

    next();
  };