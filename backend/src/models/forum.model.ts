import mongoose, {
  Schema,
  Document,
  Model,
  Types,
} from "mongoose";

export type ForumPostType =
  | "announcement"
  | "question";

export type ForumStatus =
  | "active"
  | "hidden"
  | "archived";

/* =========================================================
   Comment
========================================================= */

export interface IForumComment {
  authorUserId: Types.ObjectId;
  authorName: string;
  authorCity?: string;
  body: string;
  createdAt: Date;
}

/* =========================================================
   Forum Post
========================================================= */

export interface IForumPost
  extends Document {
  authorUserId: Types.ObjectId;

  type: ForumPostType;

  title: string;

  body: string;

  authorName: string;

  authorCity?: string;

  /*
   * Legacy / free-text topic.
   *
   * Kept temporarily for compatibility
   * with existing forum posts.
   */
  category?: string;

  /*
   * Semantic relation with the
   * user's real needs.
   */
  needIds: Types.ObjectId[];

  status: ForumStatus;

  comments: IForumComment[];

  createdAt: Date;

  updatedAt: Date;
}

/* =========================================================
   Forum Message
========================================================= */

export interface IForumMessage
  extends Document {
  authorUserId: Types.ObjectId;

  authorName: string;

  authorCity?: string;

  body: string;

  status: ForumStatus;

  createdAt: Date;

  updatedAt: Date;
}

/* =========================================================
   Comment Schema
========================================================= */

const forumCommentSchema =
  new Schema<IForumComment>(
    {
      authorUserId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,
      },

      authorName: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          80,
      },

      authorCity: {
        type:
          String,

        trim:
          true,

        maxlength:
          80,
      },

      body: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          1200,
      },

      createdAt: {
        type:
          Date,

        default:
          Date.now,
      },
    },

    {
      _id:
        true,
    }
  );

/* =========================================================
   Forum Post Schema
========================================================= */

const forumPostSchema =
  new Schema<IForumPost>(
    {
      authorUserId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,
      },

      type: {
        type:
          String,

        enum: [
          "announcement",
          "question",
        ],

        required:
          true,

        default:
          "question",
      },

      title: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          160,
      },

      body: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          4000,
      },

      authorName: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          80,
      },

      authorCity: {
        type:
          String,

        trim:
          true,

        maxlength:
          80,
      },

      /*
       * Temporary legacy field.
       */
      category: {
        type:
          String,

        trim:
          true,

        maxlength:
          80,
      },

      /*
       * A forum post may be related
       * to one or several user needs.
       *
       * Empty array keeps old/general
       * posts compatible.
       */
      needIds: {
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

      status: {
        type:
          String,

        enum: [
          "active",
          "hidden",
          "archived",
        ],

        default:
          "active",

        required:
          true,
      },

      comments: {
        type: [
          forumCommentSchema,
        ],

        default:
          [],
      },
    },

    {
      timestamps:
        true,
    }
  );

/* =========================================================
   Forum Message Schema
========================================================= */

const forumMessageSchema =
  new Schema<IForumMessage>(
    {
      authorUserId: {
        type:
          Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,
      },

      authorName: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          80,
      },

      authorCity: {
        type:
          String,

        trim:
          true,

        maxlength:
          80,
      },

      body: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          1000,
      },

      status: {
        type:
          String,

        enum: [
          "active",
          "hidden",
          "archived",
        ],

        default:
          "active",

        required:
          true,
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

forumPostSchema.index({
  createdAt:
    -1,
});

forumPostSchema.index({
  authorName:
    1,

  createdAt:
    -1,
});

forumPostSchema.index({
  type:
    1,

  createdAt:
    -1,
});

/*
 * Main index for the new
 * Need-centred community flow.
 */
forumPostSchema.index({
  needIds:
    1,

  status:
    1,

  createdAt:
    -1,
});

forumMessageSchema.index({
  createdAt:
    -1,
});

/* =========================================================
   Models
========================================================= */

export const ForumPost:
  Model<IForumPost> =
  mongoose.model<IForumPost>(
    "ForumPost",

    forumPostSchema
  );

export const ForumMessage:
  Model<IForumMessage> =
  mongoose.model<IForumMessage>(
    "ForumMessage",

    forumMessageSchema
  );