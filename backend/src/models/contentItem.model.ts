import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type ContentItemType =
  | "information"
  | "guide"
  | "external_resource";

export type ContentItemStatus =
  | "draft"
  | "active"
  | "inactive";

export interface IContentTranslation {
  title: string;
  summary?: string;
  content?: string;
}

export interface IGuideStep {
  order: number;

  translations: {
    es: {
      title: string;
      content?: string;
    };

    eu?: {
      title?: string;
      content?: string;
    };

    ar?: {
      title?: string;
      content?: string;
    };

    en?: {
      title?: string;
      content?: string;
    };
  };
}

export interface IResourceData {
  url?: string;
  phone?: string;
  email?: string;
  contactText?: string;
}

export interface IContentItem
  extends Document {
  type: ContentItemType;

  needIds: Types.ObjectId[];

  translations: {
    es: IContentTranslation;

    eu?: IContentTranslation;

    ar?: IContentTranslation;

    en?: IContentTranslation;
  };

  steps?: IGuideStep[];

  resourceData?: IResourceData;

  source: {
    name: string;
    url?: string;
  };

  order: number;

  status: ContentItemStatus;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   Translation
========================================================= */

const contentTranslationSchema =
  new Schema<IContentTranslation>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      summary: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
      },

      content: {
        type: String,
        trim: true,
        maxlength: 20000,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Guide step translation
========================================================= */

const guideStepTranslationSchema =
  new Schema(
    {
      title: {
        type: String,
        trim: true,
        maxlength: 200,
        default: "",
      },

      content: {
        type: String,
        trim: true,
        maxlength: 5000,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Guide step
========================================================= */

const guideStepSchema =
  new Schema<IGuideStep>(
    {
      order: {
        type: Number,
        required: true,
        min: 0,
      },

      translations: {
        es: {
          type: guideStepTranslationSchema,
          required: true,
        },

        eu: {
          type: guideStepTranslationSchema,
          default: undefined,
        },

        ar: {
          type: guideStepTranslationSchema,
          default: undefined,
        },

        en: {
          type: guideStepTranslationSchema,
          default: undefined,
        },
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   External resource
========================================================= */

const resourceDataSchema =
  new Schema<IResourceData>(
    {
      url: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      phone: {
        type: String,
        trim: true,
        maxlength: 50,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 200,
      },

      contactText: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Source
========================================================= */

const sourceSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      url: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },
    {
      _id: false,
    }
  );

/* =========================================================
   Content Item
========================================================= */

const contentItemSchema =
  new Schema<IContentItem>(
    {
      type: {
        type: String,
        enum: [
          "information",
          "guide",
          "external_resource",
        ],
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
        required: true,
        default: [],
      },

      translations: {
        es: {
          type: contentTranslationSchema,
          required: true,
        },

        eu: {
          type: contentTranslationSchema,
          default: undefined,
        },

        ar: {
          type: contentTranslationSchema,
          default: undefined,
        },

        en: {
          type: contentTranslationSchema,
          default: undefined,
        },
      },

      steps: {
        type: [guideStepSchema],
        default: undefined,
      },

      resourceData: {
        type: resourceDataSchema,
        default: undefined,
      },

      source: {
        type: sourceSchema,
        required: true,
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
          "draft",
          "active",
          "inactive",
        ],
        default: "draft",
        required: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

/* =========================================================
   Validation
========================================================= */

contentItemSchema.pre(
  "validate",
  function (next) {
    if (
      !this.needIds ||
      this.needIds.length === 0
    ) {
      this.invalidate(
        "needIds",
        "At least one need is required"
      );
    }

    if (
      this.type === "guide" &&
      (!this.steps ||
        this.steps.length === 0)
    ) {
      this.invalidate(
        "steps",
        "Guide content requires at least one step"
      );
    }

    if (
      this.type ===
      "external_resource"
    ) {
      const resource =
        this.resourceData;

      const hasContact =
        resource?.url ||
        resource?.phone ||
        resource?.email ||
        resource?.contactText;

      if (!hasContact) {
        this.invalidate(
          "resourceData",
          "External resource requires at least one contact channel"
        );
      }
    }

    next();
  }
);

/* =========================================================
   Indexes
========================================================= */

contentItemSchema.index({
  needIds: 1,
  status: 1,
  order: 1,
});

contentItemSchema.index({
  type: 1,
  status: 1,
});

const ContentItem: Model<IContentItem> =
  mongoose.model<IContentItem>(
    "ContentItem",
    contentItemSchema
  );

export default ContentItem;