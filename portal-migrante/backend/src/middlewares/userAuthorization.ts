import { NextFunction, Request, Response } from "express";
import { PlatformRole } from "../models/user.model";

export const requireSelfOrPlatformRoles =
  (...roles: PlatformRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (
      req.auth &&
      (req.auth.userId === req.params.id ||
        roles.includes(req.auth.platformRole))
    ) {
      next();
      return;
    }

    res.status(403).json({ message: "You cannot access this user" });
  };
