import { Request, Response, NextFunction } from "express";

export default function requireWriteAccess(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    next();
    return;
  }

  if (process.env.NODE_ENV === "development") {
    next();
    return;
  }

  const expectedKey = process.env.ADMIN_API_KEY;
  const providedKey = req.header("x-admin-api-key");

  if (!expectedKey) {
    res.status(503).json({
      message:
        "Write access is disabled until ADMIN_API_KEY is configured on the server.",
    });
    return;
  }

  if (!providedKey || providedKey !== expectedKey) {
    res.status(403).json({
      message: "Admin credentials are required for write operations.",
    });
    return;
  }

  next();
}
