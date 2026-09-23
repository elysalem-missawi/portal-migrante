import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IReport extends Document {
  publicationId: Types.ObjectId;
  reporterUserId: Types.ObjectId;
  reason:
    | "false_information"
    | "fraud"
    | "spam"
    | "abuse"
    | "privacy"
    | "expired"
    | "other";
  details?: string;
  status: "open" | "under_review" | "resolved" | "dismissed";
  assignedToUserId?: Types.ObjectId | null;
  resolutionNote?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    publicationId: {
      type: Schema.Types.ObjectId,
      ref: "Publication",
      required: true,
      index: true,
    },
    reporterUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: [
        "false_information",
        "fraud",
        "spam",
        "abuse",
        "privacy",
        "expired",
        "other",
      ],
      required: true,
    },
    details: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "dismissed"],
      default: "open",
      required: true,
      index: true,
    },
    assignedToUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolutionNote: { type: String, trim: true, maxlength: 2000 },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

reportSchema.index({ publicationId: 1, status: 1, createdAt: -1 });
reportSchema.index({ reporterUserId: 1, publicationId: 1, createdAt: -1 });

const Report: Model<IReport> = mongoose.model<IReport>("Report", reportSchema);

export default Report;
