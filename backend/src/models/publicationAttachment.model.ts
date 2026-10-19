import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPublicationAttachment extends Document {
  publicationId: Types.ObjectId;
  uploadedByUserId: Types.ObjectId;
  kind: "image" | "document";
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  publicUrl?: string;
  status: "pending" | "active" | "rejected" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const publicationAttachmentSchema = new Schema<IPublicationAttachment>(
  {
    publicationId: {
      type: Schema.Types.ObjectId,
      ref: "Publication",
      required: true,
      index: true,
    },
    uploadedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    kind: {
      type: String,
      enum: ["image", "document"],
      required: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    mimeType: { type: String, required: true, trim: true, maxlength: 120 },
    sizeBytes: { type: Number, required: true, min: 1, max: 10 * 1024 * 1024 },
    storageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      select: false,
    },
    publicUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "archived"],
      default: "pending",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

publicationAttachmentSchema.index({ publicationId: 1, status: 1, createdAt: 1 });

const PublicationAttachment: Model<IPublicationAttachment> =
  mongoose.model<IPublicationAttachment>(
    "PublicationAttachment",
    publicationAttachmentSchema
  );

export default PublicationAttachment;
