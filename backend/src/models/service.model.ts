import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ServiceDeliveryMode =
  | "in_person"
  | "online"
  | "phone"
  | "mobile"
  | "hybrid";

export interface IService extends Document {
  organizationId: Types.ObjectId;
  locationIds: Types.ObjectId[];
  categoryId: Types.ObjectId;
  title: string;
  description: string;
  deliveryModes: ServiceDeliveryMode[];
  eligibility?: string;
  requiredDocuments: string[];
  costType: "free" | "paid" | "subsidized" | "unknown";
  appointmentRequired: boolean;
  website?: string;
  phone?: string;
  email?: string;
  languages: string[];
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  status: "draft" | "active" | "inactive" | "archived";

  // Deprecated transitional location/category fields.
  category?: string;
  municipality?: string;
  territory?: string;
  address?: string;
  verified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    locationIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "OrganizationLocation" }],
      default: [],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true, trim: true, maxlength: 6000 },
    deliveryModes: {
      type: [
        {
          type: String,
          enum: ["in_person", "online", "phone", "mobile", "hybrid"],
        },
      ],
      default: ["in_person"],
    },
    eligibility: { type: String, trim: true, maxlength: 3000 },
    requiredDocuments: { type: [String], default: [] },
    costType: {
      type: String,
      enum: ["free", "paid", "subsidized", "unknown"],
      default: "unknown",
      required: true,
    },
    appointmentRequired: { type: Boolean, default: false, required: true },
    website: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    languages: { type: [String], default: [] },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "pending",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
      required: true,
      index: true,
    },

    // Kept temporarily until current service records and forms are migrated.
    category: { type: String, trim: true },
    municipality: { type: String, trim: true },
    territory: { type: String, trim: true },
    address: { type: String, trim: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

serviceSchema.index({ organizationId: 1, status: 1 });
serviceSchema.index({ categoryId: 1, status: 1 });
serviceSchema.index({ locationIds: 1, status: 1 });
serviceSchema.index({ title: "text", description: "text" });

const Service: Model<IService> = mongoose.model<IService>("Service", serviceSchema);

export default Service;
