// src/models/organization.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

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
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  languages: string[];
  logo?: string;
  verified: boolean;
  status: "active" | "inactive" | "pending" | "archived";
  createdByUserId?: Types.ObjectId | null;
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    logo: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "archived"],
      default: "pending",
      required: true,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Organization: Model<IOrganization> = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);

export default Organization;