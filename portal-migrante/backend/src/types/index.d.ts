import type { PlatformRole } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
        platformRole: PlatformRole;
        phoneVerified: boolean;
        isVerified: boolean;
      };
    }
  }
}

export {};
