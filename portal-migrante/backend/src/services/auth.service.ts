import crypto from "crypto";
import AuthSession from "../models/authSession.model";

const SESSION_DURATION_DAYS = 14;

export const hashSessionToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export async function createAuthSession(
  userId: string,
  metadata: { userAgent?: string; ipAddress?: string }
) {
  const token = crypto.randomBytes(48).toString("base64url");
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  const session = await AuthSession.create({
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt,
    lastUsedAt: new Date(),
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
  });

  return { token, expiresAt, sessionId: String(session._id) };
}
