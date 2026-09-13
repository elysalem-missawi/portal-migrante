import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type ModerationTargetType =
  | "publication"
  | "organization"
  | "service";

export interface IModerationAction extends Document {
  targetType: ModerationTargetType;
  targetId: Types.ObjectId;

  // Transitional reference retained for existing publication moderation data.
  publicationId?: Types.ObjectId | null;
  moderatorUserId: Types.ObjectId;
  reportId?: Types.ObjectId | null;
  action:
    | "approve"
    | "reject"
    | "verify"
    | "unverify"
    | "hide"
    | "restore"
    | "archive"
    | "expire";
  reason?: string;
  previousStatus?: string;
  newStatus?: string;
  previousVerificationStatus?: string;
  newVerificationStatus?: string;
  createdAt: Date;
}

const moderationActionSchema = new Schema<IModerationAction>(
  {
    targetType: {
      type: String,
      enum: ["publication", "organization", "service"],
      default: "publication",
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    publicationId: {
      type: Schema.Types.ObjectId,
      ref: "Publication",
      default: null,
      index: true,
    },
    moderatorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      default: null,
    },
    action: {
      type: String,
      enum: [
        "approve",
        "reject",
        "verify",
        "unverify",
        "hide",
        "restore",
        "archive",
        "expire",
      ],
      required: true,
    },
    reason: { type: String, trim: true, maxlength: 2000 },
    previousStatus: { type: String, trim: true, maxlength: 40 },
    newStatus: { type: String, trim: true, maxlength: 40 },
    previousVerificationStatus: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    newVerificationStatus: {
      type: String,
      trim: true,
      maxlength: 40,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

moderationActionSchema.index({
  targetType: 1,
  targetId: 1,
  createdAt: -1,
});
moderationActionSchema.index({
  publicationId: 1,
  createdAt: -1,
});

const ModerationAction: Model<IModerationAction> =
  mongoose.model<IModerationAction>(
    "ModerationAction",
    moderationActionSchema
  );

export default ModerationAction;
