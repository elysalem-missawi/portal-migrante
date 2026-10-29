import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type SupportRequestUrgency =
  | "normal"
  | "urgent"
  | "critical";

export type SupportRequestStatus =
  | "open"
  | "in_review"
  | "in_progress"
  | "resolved"
  | "closed";

export type SupportContactPreference =
  | "platform"
  | "email"
  | "phone";

export interface ISupportRequest
  extends Document {
  userId:
    Types.ObjectId;

  mainNeedId:
    Types.ObjectId;

  relatedNeedIds:
    Types.ObjectId[];

  title:
    string;

  description:
    string;

  sourceLanguage:
    "es" | "eu" | "ar" | "en";

  urgency:
    SupportRequestUrgency;

  status:
    SupportRequestStatus;

  contactPreference:
    SupportContactPreference;

  assignedOrganizationId?:
    Types.ObjectId | null;

  assignedUserId?:
    Types.ObjectId | null;

  resolvedAt?:
    Date | null;

  closedAt?:
    Date | null;

  createdAt:
    Date;

  updatedAt:
    Date;
}

/* =========================================================
   Schema
========================================================= */

const supportRequestSchema =
  new Schema<ISupportRequest>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,
      },

      mainNeedId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Need",

        required:
          true,

        index:
          true,
      },

      relatedNeedIds: {
        type: [
          {
            type:
              Schema.Types.ObjectId,

            ref:
              "Need",
          },
        ],

        default:
          [],
      },

      title: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          180,
      },

      description: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          6000,
      },

      sourceLanguage: {
        type:
          String,

        enum: [
          "es",
          "eu",
          "ar",
          "en",
        ],

        required:
          true,

        default:
          "es",

        index:
          true,
      },

      urgency: {
        type:
          String,

        enum: [
          "normal",
          "urgent",
          "critical",
        ],

        required:
          true,

        default:
          "normal",

        index:
          true,
      },

      status: {
        type:
          String,

        enum: [
          "open",
          "in_review",
          "in_progress",
          "resolved",
          "closed",
        ],

        required:
          true,

        default:
          "open",

        index:
          true,
      },

      contactPreference: {
        type:
          String,

        enum: [
          "platform",
          "email",
          "phone",
        ],

        required:
          true,

        default:
          "platform",
      },

      assignedOrganizationId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "Organization",

        default:
          null,

        index:
          true,
      },

      assignedUserId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        default:
          null,

        index:
          true,
      },

      resolvedAt: {
        type:
          Date,

        default:
          null,
      },

      closedAt: {
        type:
          Date,

        default:
          null,
      },
    },

    {
      timestamps:
        true,
    }
  );

/* =========================================================
   Indexes
========================================================= */

supportRequestSchema.index({
  userId:
    1,

  status:
    1,

  createdAt:
    -1,
});

supportRequestSchema.index({
  mainNeedId:
    1,

  status:
    1,

  createdAt:
    -1,
});

supportRequestSchema.index({
  relatedNeedIds:
    1,

  status:
    1,
});

supportRequestSchema.index({
  assignedOrganizationId:
    1,

  status:
    1,
});

supportRequestSchema.index({
  assignedUserId:
    1,

  status:
    1,
});

/* =========================================================
   Model
========================================================= */

const SupportRequest:
  Model<ISupportRequest> =
  mongoose.model<ISupportRequest>(
    "SupportRequest",

    supportRequestSchema
  );

export default SupportRequest;