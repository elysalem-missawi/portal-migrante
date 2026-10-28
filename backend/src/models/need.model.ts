import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type NeedStatus =
  | "active"
  | "inactive";

export interface INeed
  extends Document {
  code: string;

  labels: {
    es: string;
    eu?: string;
    ar?: string;
    en?: string;
  };

  descriptions: {
    es?: string;
    eu?: string;
    ar?: string;
    en?: string;
  };

  order: number;

  status: NeedStatus;

  createdAt: Date;
  updatedAt: Date;
}

const localizedLabelsSchema =
  new Schema(
    {
      es: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },

      eu: {
        type: String,
        trim: true,
        maxlength: 120,
        default: "",
      },

      ar: {
        type: String,
        trim: true,
        maxlength: 120,
        default: "",
      },

      en: {
        type: String,
        trim: true,
        maxlength: 120,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const localizedDescriptionsSchema =
  new Schema(
    {
      es: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      eu: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      ar: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      en: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const needSchema =
  new Schema<INeed>(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 80,
      },

      labels: {
        type: localizedLabelsSchema,
        required: true,
      },

      descriptions: {
        type: localizedDescriptionsSchema,
        default: () => ({}),
      },

      order: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "active",
          "inactive",
        ],
        default: "active",
        required: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );


needSchema.index({
  status: 1,
  order: 1,
});

const Need: Model<INeed> =
  mongoose.model<INeed>(
    "Need",
    needSchema
  );

export default Need;