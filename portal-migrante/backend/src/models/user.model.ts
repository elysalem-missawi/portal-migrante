import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type PlatformRole = "user" | "moderator" | "admin" | "super_admin";

export interface IUser extends Document {
  accountType: "individual" | "organization_account";
  platformRole: PlatformRole;

  // Deprecated compatibility role; organization roles belong to OrganizationMember.
  role:
    | "community_user"
    | "organization_manager"
    | "admin"
    | "super_admin";

  fullName: string;
  displayName?: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  phoneVerificationCodeHash?: string;
  phoneVerificationExpiresAt?: Date;
  phoneVerificationSentAt?: Date;
  phoneVerificationAttempts: number;
  passwordHash?: string;
  preferredLanguage?: string;
  originCountry?: string;
  nativeLanguage?: string;
  municipalityId?: Types.ObjectId | null;

  // Deprecated transitional fields.
  municipality?: string;
  organizationId?: Types.ObjectId | null;

  // Extended profile fields
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  cif?: string;
  contactPersonName?: string;
  address?: string;
  postalCode?: string;
  googleId?: string;

  profileImage?: string;
  identityDocument?: {
    fileName: string;
    mimeType: string;
    size: number;
    dataUrl: string;
    uploadedAt: Date;
  };
  legalConsentAccepted: boolean;
  legalConsentAt?: Date;
  status: "active" | "inactive" | "pending" | "blocked";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    accountType: {
      type: String,
      enum: ["individual", "organization_account"],
      default: "individual",
      required: true,
    },
    platformRole: {
      type: String,
      enum: ["user", "moderator", "admin", "super_admin"],
      default: "user",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: [
        "community_user",
        "organization_manager",
        "admin",
        "super_admin",
      ],
      default: "community_user",
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    displayName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, trim: true },
    phoneVerified: { type: Boolean, default: false, required: true },
    phoneVerificationCodeHash: { type: String, trim: true, select: false },
    phoneVerificationExpiresAt: { type: Date, select: false },
    phoneVerificationSentAt: { type: Date, select: false },
    phoneVerificationAttempts: {
      type: Number,
      default: 0,
      required: true,
      select: false,
    },
    passwordHash: { type: String, trim: true, select: false },
    preferredLanguage: { type: String, trim: true, default: "es" },
    originCountry: { type: String, trim: true },
    nativeLanguage: { type: String, trim: true },
    municipalityId: {
      type: Schema.Types.ObjectId,
      ref: "Municipality",
      default: null,
      index: true,
    },

    // Kept temporarily while existing records and forms are migrated.
    municipality: { type: String, trim: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    // Extended profile fields
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    organizationName: { type: String, trim: true },
    cif: { type: String, trim: true, uppercase: true },
    contactPersonName: { type: String, trim: true },
    address: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    googleId: { type: String, trim: true, index: true, sparse: true },

    profileImage: { type: String, trim: true },
    identityDocument: {
      fileName: { type: String, trim: true },
      mimeType: { type: String, trim: true },
      size: { type: Number },
      dataUrl: { type: String },
      uploadedAt: { type: Date },
    },
    legalConsentAccepted: {
      type: Boolean,
      default: false,
      required: true,
    },
    legalConsentAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "blocked"],
      default: "active",
      required: true,
      index: true,
    },
    isVerified: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

userSchema.index({ status: 1, platformRole: 1 });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;