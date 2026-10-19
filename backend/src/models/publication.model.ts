import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type PublicationType =
  | "announcement"
  | "need"
  | "offer"
  | "event"
  | "resource";

export type PublicationStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "expired"
  | "rejected"
  | "hidden"
  | "archived";

export interface IPublication extends Document {
  authorUserId?: Types.ObjectId | null;
  organizationId?: Types.ObjectId | null;
  municipalityId: Types.ObjectId;
  categoryId: Types.ObjectId;
  type: PublicationType;
  title: string;
  description: string;
  sourceLanguage: string;
  urgency: "normal" | "urgent" | "critical";
  contactMethod: "platform" | "email" | "phone" | "whatsapp" | "external_url";
  contactValue?: string;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  status: PublicationStatus;
  publishedAt?: Date;
  expiresAt?: Date | null;
  reviewedByUserId?: Types.ObjectId | null;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const publicationSchema = new Schema<IPublication>(
  {
    authorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true,
    },
    municipalityId: {
      type: Schema.Types.ObjectId,
      ref: "Municipality",
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "PublicationCategory",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["announcement", "need", "offer", "event", "resource"],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    sourceLanguage: {
      type: String,
      required: true,
      default: "es",
      trim: true,
      lowercase: true,
      maxlength: 10,
    },
    urgency: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
      required: true,
      index: true,
    },
    contactMethod: {
      type: String,
      enum: ["platform", "email", "phone", "whatsapp", "external_url"],
      default: "platform",
      required: true,
    },
    contactValue: { type: String, trim: true, maxlength: 500 },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "pending",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending_review",
        "published",
        "expired",
        "rejected",
        "hidden",
        "archived",
      ],
      default: "pending_review",
      required: true,
      index: true,
    },
    publishedAt: { type: Date },
    expiresAt: { type: Date, default: null, index: true },
    reviewedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

publicationSchema.index({ municipalityId: 1, status: 1, publishedAt: -1 });
publicationSchema.index({ categoryId: 1, status: 1, publishedAt: -1 });
publicationSchema.index({ organizationId: 1, status: 1, publishedAt: -1 });
publicationSchema.index({ expiresAt: 1, status: 1 });
publicationSchema.index({ title: "text", description: "text" });

const Publication: Model<IPublication> = mongoose.model<IPublication>(
  "Publication",
  publicationSchema
);

export default Publication;
