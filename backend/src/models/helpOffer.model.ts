import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type HelpOfferAvailability =
  | "flexible"
  | "weekdays"
  | "weekends"
  | "specific";

export type HelpOfferStatus =
  | "active"
  | "paused"
  | "matched"
  | "closed";

export type HelpOfferContactPreference =
  | "platform"
  | "email"
  | "phone";

export interface IHelpOffer
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

  availability:
    HelpOfferAvailability;

  availabilityNote:
    string;

  status:
    HelpOfferStatus;

  contactPreference:
    HelpOfferContactPreference;

  assignedOrganizationId?:
    Types.ObjectId | null;

  matchedAt?:
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

const helpOfferSchema =
  new Schema<IHelpOffer>(
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

      availability: {
        type:
          String,

        enum: [
          "flexible",
          "weekdays",
          "weekends",
          "specific",
        ],

        required:
          true,

        default:
          "flexible",

        index:
          true,
      },

      availabilityNote: {
        type:
          String,

        trim:
          true,

        maxlength:
          1000,

        default:
          "",
      },

      status: {
        type:
          String,

        enum: [
          "active",
          "paused",
          "matched",
          "closed",
        ],

        required:
          true,

        default:
          "active",

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

      matchedAt: {
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

helpOfferSchema.index({
  userId:
    1,

  status:
    1,

  createdAt:
    -1,
});

helpOfferSchema.index({
  mainNeedId:
    1,

  status:
    1,

  createdAt:
    -1,
});

helpOfferSchema.index({
  relatedNeedIds:
    1,

  status:
    1,
});

helpOfferSchema.index({
  assignedOrganizationId:
    1,

  status:
    1,
});

/* =========================================================
   Model
========================================================= */

const HelpOffer:
  Model<IHelpOffer> =
  mongoose.model<IHelpOffer>(
    "HelpOffer",

    helpOfferSchema
  );

export default HelpOffer;
