import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type OrganizationVerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export interface IOrganization extends Document {
  type:
    | "municipality"
    | "health_center"
    | "association"
    | "social_services_office"
    | "employment_office"
    | "legal_office"
    | "education_center"
    | "community_center"
    | "other";
  name: string;
  legalName?: string;
  registrationNumber?: string;
  slug: string;
  description?: string;
  website?: string;
  languages: string[];
  logo?: string;
  verificationStatus: OrganizationVerificationStatus;
  verifiedAt?: Date;
  verifiedByUserId?: Types.ObjectId | null;
  status: "active" | "inactive" | "pending" | "archived";
  createdByUserId?: Types.ObjectId | null;

  // Deprecated transitional fields. Contact data belongs to OrganizationLocation.
  address?: string;
  phone?: string;
  email?: string;
  verified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    type: {
      type: String,
      enum: [
        "municipality",
        "health_center",
        "association",
        "social_services_office",
        "employment_office",
        "legal_office",
        "education_center",
        "community_center",
        "other",
      ],
      required: true,
      default: "other",
    },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    legalName: { type: String, trim: true, maxlength: 200 },
    registrationNumber: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
      sparse: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String, trim: true, maxlength: 4000 },
    website: { type: String, trim: true },
    languages: { type: [String], default: [] },
    logo: { type: String, trim: true },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "pending",
      required: true,
      index: true,
    },
    verifiedAt: { type: Date },
    verifiedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "archived"],
      default: "pending",
      required: true,
      index: true,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Kept temporarily so the current frontend remains compatible during migration.
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    verified: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

organizationSchema.index({ type: 1, status: 1 });
organizationSchema.index({ name: "text", description: "text" });

const Organization: Model<IOrganization> = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);

export default Organization;
