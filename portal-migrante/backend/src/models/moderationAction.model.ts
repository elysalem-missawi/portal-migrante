import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IModerationAction extends Document {
  publicationId: Types.ObjectId;
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
  createdAt: Date;
}

const moderationActionSchema = new Schema<IModerationAction>(
  {
    publicationId: {
      type: Schema.Types.ObjectId,
      ref: "Publication",
      required: true,
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
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

moderationActionSchema.index({ publicationId: 1, createdAt: -1 });

const ModerationAction: Model<IModerationAction> =
  mongoose.model<IModerationAction>(
    "ModerationAction",
    moderationActionSchema
  );

export default ModerationAction;
