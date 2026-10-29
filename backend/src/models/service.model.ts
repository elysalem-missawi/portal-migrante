import mongoose, {
  Schema,
  Document,
  Model,
  Types,
} from "mongoose";

export type ServiceDeliveryMode =
  | "in_person"
  | "online"
  | "phone"
  | "mobile"
  | "hybrid";

export type ServiceTranslation = {
  title: string;
  description: string;
  eligibility?: string;
};

export interface IService
  extends Document {
  organizationId: Types.ObjectId;

  locationIds: Types.ObjectId[];

  categoryId: Types.ObjectId;

  needIds: Types.ObjectId[];

  translations?: {
    es?: ServiceTranslation;
    eu?: ServiceTranslation;
    ar?: ServiceTranslation;
    en?: ServiceTranslation;
  };

  /*
   * Transitional legacy fields.
   *
   * They remain temporarily
   * for compatibility with
   * existing forms and data.
   */
  title: string;

  description: string;

  eligibility?: string;

  deliveryModes: ServiceDeliveryMode[];

  requiredDocuments: string[];

  costType:
    | "free"
    | "paid"
    | "subsidized"
    | "unknown";

  appointmentRequired: boolean;

  website?: string;

  phone?: string;

  email?: string;

  languages: string[];

  verificationStatus:
    | "unverified"
    | "pending"
    | "verified"
    | "rejected";

  status:
    | "draft"
    | "active"
    | "inactive"
    | "archived";

  category?: string;

  municipality?: string;

  territory?: string;

  address?: string;

  verified: boolean;

  createdAt: Date;

  updatedAt: Date;
}

/* =========================================================
   Translation
========================================================= */

const serviceTranslationSchema =
  new Schema<ServiceTranslation>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 180,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 6000,
      },

      eligibility: {
        type: String,
        trim: true,
        maxlength: 3000,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Service
========================================================= */

const serviceSchema =
  new Schema<IService>(
    {
      organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
      },

      locationIds: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "OrganizationLocation",
          },
        ],
        default: [],
      },

      categoryId: {
        type: Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true,
        index: true,
      },

      needIds: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "Need",
          },
        ],
        default: [],
      },

      translations: {
        es: {
          type: serviceTranslationSchema,
          default: undefined,
        },

        eu: {
          type: serviceTranslationSchema,
          default: undefined,
        },

        ar: {
          type: serviceTranslationSchema,
          default: undefined,
        },

        en: {
          type: serviceTranslationSchema,
          default: undefined,
        },
      },

      /*
       * Transitional compatibility fields.
       *
       * Spanish remains mirrored here
       * until all existing forms are migrated.
       */
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 180,
      },

      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 6000,
      },

      eligibility: {
        type: String,
        trim: true,
        maxlength: 3000,
      },

      deliveryModes: {
        type: [
          {
            type: String,

            enum: [
              "in_person",
              "online",
              "phone",
              "mobile",
              "hybrid",
            ],
          },
        ],

        default: [
          "in_person",
        ],
      },

      requiredDocuments: {
        type: [String],
        default: [],
      },

      costType: {
        type: String,

        enum: [
          "free",
          "paid",
          "subsidized",
          "unknown",
        ],

        default: "unknown",

        required: true,
      },

      appointmentRequired: {
        type: Boolean,
        default: false,
        required: true,
      },

      website: {
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

      languages: {
        type: [String],
        default: [],
      },

      verificationStatus: {
        type: String,

        enum: [
          "unverified",
          "pending",
          "verified",
          "rejected",
        ],

        default: "pending",

        required: true,

        index: true,
      },

      status: {
        type: String,

        enum: [
          "draft",
          "active",
          "inactive",
          "archived",
        ],

        default: "draft",

        required: true,

        index: true,
      },

      /*
       * Older transitional fields.
       */
      category: {
        type: String,
        trim: true,
      },

      municipality: {
        type: String,
        trim: true,
      },

      territory: {
        type: String,
        trim: true,
      },

      address: {
        type: String,
        trim: true,
      },

      verified: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

/* =========================================================
   Indexes
========================================================= */

serviceSchema.index({
  organizationId: 1,
  status: 1,
});

serviceSchema.index({
  categoryId: 1,
  status: 1,
});

serviceSchema.index({
  locationIds: 1,
  status: 1,
});

serviceSchema.index({
  needIds: 1,
  status: 1,
  verificationStatus: 1,
});

serviceSchema.index({
  title: "text",
  description: "text",
});

/* =========================================================
   Model
========================================================= */

const Service: Model<IService> =
  mongoose.model<IService>(
    "Service",
    serviceSchema
  );

export default Service;