import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IAuthSession extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  lastUsedAt: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
}

const authSessionSchema = new Schema<IAuthSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null, index: true },
    lastUsedAt: { type: Date, default: Date.now, required: true },
    userAgent: { type: String, trim: true, maxlength: 500 },
    ipAddress: { type: String, trim: true, maxlength: 100 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
authSessionSchema.index({ userId: 1, revokedAt: 1, expiresAt: 1 });

const AuthSession: Model<IAuthSession> = mongoose.model<IAuthSession>(
  "AuthSession",
  authSessionSchema
);

export default AuthSession;
