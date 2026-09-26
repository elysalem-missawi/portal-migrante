import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* =========================================================
   User types
   ========================================================= */

export type PlatformRole = "user" | "moderator" | "admin";

export type UserStatus =
  | "active"
  | "inactive"
  | "pending"
  | "blocked";

export type PreferredLanguage = "es" | "eu" | "ar" | "en";

/* =========================================================
   User interface
   ========================================================= */

export interface IUser extends Document {
  /**
   * Public name shown in the platform.
   * Can be a real name or a chosen display name.
   */
  displayName: string;

  /**
   * Real/full name.
   * Optional because we do not need it to create an account.
   */
  fullName?: string;

  /**
   * Unique login email.
   */
  email: string;

  /**
   * Optional contact phone.
   * Phone verification is not required in V1.
   */
  phone?: string;

  /**
   * Password hash.
   * select:false prevents accidental exposure.
   *
   * Optional at schema level to allow future
   * external authentication providers.
   */
  passwordHash?: string;

  /**
   * Interface language.
   */
  preferredLanguage: PreferredLanguage;

  /**
   * Optional profile information.
   */
  originCountry?: string;

  municipalityId?: Types.ObjectId | null;

  profileImage?: string;

  /**
   * Platform permissions.
   * Organization permissions do NOT belong here.
   */
  platformRole: PlatformRole;

  /**
   * Account status.
   */
  status: UserStatus;

  /**
   * Legal consent required during registration.
   */
  legalConsentAccepted: boolean;

  legalConsentAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   Schema
   ========================================================= */

const userSchema = new Schema<IUser>(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    preferredLanguage: {
      type: String,
      enum: ["es", "eu", "ar", "en"],
      default: "es",
      required: true,
    },

    originCountry: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    municipalityId: {
      type: Schema.Types.ObjectId,
      ref: "Municipality",
      default: null,
      index: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    platformRole: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "blocked"],
      default: "active",
      required: true,
      index: true,
    },

    legalConsentAccepted: {
      type: Boolean,
      default: false,
      required: true,
    },

    legalConsentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================================================
   Indexes
   ========================================================= */

userSchema.index({
  status: 1,
  platformRole: 1,
});

/* =========================================================
   Model
   ========================================================= */

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export default User;