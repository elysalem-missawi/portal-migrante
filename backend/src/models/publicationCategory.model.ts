import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPublicationCategory extends Document {
  code: string;
  name: string;
  description?: string;
  parentCategoryId?: Types.ObjectId | null;
  allowedTypes: Array<"announcement" | "need" | "offer" | "event" | "resource">;
  sortOrder: number;
  status: "active" | "inactive" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const publicationCategorySchema = new Schema<IPublicationCategory>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 80,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "PublicationCategory",
      default: null,
      index: true,
    },
    allowedTypes: {
      type: [
        {
          type: String,
          enum: ["announcement", "need", "offer", "event", "resource"],
        },
      ],
      default: ["announcement", "need", "offer", "event", "resource"],
    },
    sortOrder: { type: Number, default: 0, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

publicationCategorySchema.index({ status: 1, sortOrder: 1, name: 1 });

const PublicationCategory: Model<IPublicationCategory> =
  mongoose.model<IPublicationCategory>(
    "PublicationCategory",
    publicationCategorySchema
  );

export default PublicationCategory;
