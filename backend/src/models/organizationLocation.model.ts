import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IOpeningHour {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  opensAt?: string;
  closesAt?: string;
  closed: boolean;
}

export interface IOrganizationLocation extends Document {
  organizationId: Types.ObjectId;
  municipalityId: Types.ObjectId;
  name: string;
  slug: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  openingHours: IOpeningHour[];
  isHeadOffice: boolean;
  status: "active" | "inactive" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const openingHourSchema = new Schema<IOpeningHour>(
  {
    day: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },
    opensAt: { type: String, trim: true },
    closesAt: { type: String, trim: true },
    closed: { type: Boolean, default: false, required: true },
  },
  { _id: false }
);

const organizationLocationSchema = new Schema<IOrganizationLocation>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    municipalityId: {
      type: Schema.Types.ObjectId,
      ref: "Municipality",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    addressLine1: { type: String, required: true, trim: true, maxlength: 240 },
    addressLine2: { type: String, trim: true, maxlength: 240 },
    postalCode: { type: String, trim: true, maxlength: 12 },
    phone: { type: String, trim: true, maxlength: 30 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    openingHours: { type: [openingHourSchema], default: [] },
    isHeadOffice: { type: Boolean, default: false, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);

organizationLocationSchema.index(
  { organizationId: 1, slug: 1 },
  { unique: true }
);
organizationLocationSchema.index({ municipalityId: 1, status: 1 });
organizationLocationSchema.index({ organizationId: 1, isHeadOffice: 1 });

const OrganizationLocation: Model<IOrganizationLocation> =
  mongoose.model<IOrganizationLocation>(
    "OrganizationLocation",
    organizationLocationSchema
  );

export default OrganizationLocation;
