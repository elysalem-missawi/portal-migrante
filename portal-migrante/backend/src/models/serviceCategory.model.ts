import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IServiceCategory extends Document {
  code: string;
  name: string;
  description?: string;
  parentCategoryId?: Types.ObjectId | null;
  sortOrder: number;
  status: "active" | "inactive" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
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
      ref: "ServiceCategory",
      default: null,
      index: true,
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

serviceCategorySchema.index({ status: 1, sortOrder: 1, name: 1 });

const ServiceCategory: Model<IServiceCategory> =
  mongoose.model<IServiceCategory>("ServiceCategory", serviceCategorySchema);

export default ServiceCategory;
