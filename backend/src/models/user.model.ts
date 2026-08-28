// src/models/user.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  accountType: "individual" | "organization_account";
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
  municipality?: string;
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
  organizationId?: Types.ObjectId | null;
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
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    phoneVerificationCodeHash: {
      type: String,
      trim: true,
      select: false,
    },
    phoneVerificationExpiresAt: {
      type: Date,
      select: false,
    },
    phoneVerificationSentAt: {
      type: Date,
      select: false,
    },
    phoneVerificationAttempts: {
      type: Number,
      default: 0,
      required: true,
      select: false,
    },
    passwordHash: {
      type: String,
      trim: true,
      select: false,
    },
    preferredLanguage: {
      type: String,
      trim: true,
      default: "es",
    },
    originCountry: {
      type: String,
      trim: true,
    },
    nativeLanguage: {
      type: String,
      trim: true,
    },
    municipality: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    identityDocument: {
      fileName: {
        type: String,
        trim: true,
      },
      mimeType: {
        type: String,
        trim: true,
      },
      size: {
        type: Number,
      },
      dataUrl: {
        type: String,
      },
      uploadedAt: {
        type: Date,
      },
    },
    legalConsentAccepted: {
      type: Boolean,
      default: false,
      required: true,
    },
    legalConsentAt: {
      type: Date,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "blocked"],
      default: "active",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
