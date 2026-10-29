import {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import {
  ForumMessage,
  ForumPost,
  ForumPostType,
} from "../models/forum.model";

import Need from "../models/need.model";

import User from "../models/user.model";

/* =========================================================
   Helpers
========================================================= */

const trimText = (
  value: unknown,
  fallback = ""
): string =>
  typeof value ===
  "string"
    ? value.trim()
    : fallback;

const normalizePostType = (
  value: unknown
): ForumPostType =>
  value ===
  "announcement"
    ? "announcement"
    : "question";

/* =========================================================
   ObjectId helper
========================================================= */

function idString(
  value: unknown
): string | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const candidate =
    String(value);

  return mongoose.Types.ObjectId.isValid(
    candidate
  )
    ? candidate
    : null;
}

/* =========================================================
   Need IDs normalization
========================================================= */

function normalizeNeedIds(
  value: unknown
): {
  values: string[];
  error?: string;
} {
  if (
    value === undefined ||
    value === null
  ) {
    return {
      values:
        [],
    };
  }

  if (!Array.isArray(value)) {
    return {
      values:
        [],

      error:
        "needIds must be an array",
    };
  }

  const parsed =
    value.map(
      (
        item: unknown
      ) =>
        idString(item)
    );

  if (
    parsed.some(
      (item) =>
        !item
    )
  ) {
    return {
      values:
        [],

      error:
        "Every needIds value must be a valid id",
    };
  }

  return {
    values:
      Array.from(
        new Set(
          parsed as string[]
        )
      ),
  };
}

/* =========================================================
   Need validation
========================================================= */

async function validateNeedIds(
  needIds: string[]
): Promise<string | null> {
  if (
    needIds.length ===
    0
  ) {
    return null;
  }

  const matchingNeeds =
    await Need.countDocuments(
      {
        _id: {
          $in:
            needIds,
        },

        status:
          "active",
      }
    );

  if (
    matchingNeeds !==
    needIds.length
  ) {
    return "Every need must exist and be active";
  }

  return null;
}

/* =========================================================
   Populate Forum Post
========================================================= */

function populateForumPost(
  query: any
) {
  return query.populate(
    "needIds",

    "code labels descriptions status order"
  );
}

/* =========================================================
   Forum user resolution
========================================================= */

/**
 * Temporary forum user resolution.
 *
 * The forum currently receives the
 * user id through:
 *
 * - x-user-id header
 * - or req.body.userId
 *
 * Authentication will be unified
 * later with req.auth.
 */
async function getRegisteredForumUser(
  req: Request
) {
  const userId =
    req.header(
      "x-user-id"
    ) ||
    req.body.userId;

  if (!userId) {
    return null;
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      String(userId)
    )
  ) {
    return null;
  }

  const user =
    await User.findOne(
      {
        _id:
          userId,

        status: {
          $in: [
            "active",
            "pending",
          ],
        },
      }
    );

  return user;
}

/* =========================================================
   User display name
========================================================= */

function getUserDisplayName(
  user: any
): string {
  return (
    user.displayName ||
    user.fullName ||
    "Usuario"
  );
}

/* =========================================================
   GET FORUM POSTS
   GET /api/forum/posts

   Supported filters:
   - type
   - authorUserId
   - needId
   - q
========================================================= */

export const getForumPosts =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const type =
        typeof req.query.type ===
        "string"
          ? req.query.type
          : "";

      const authorUserId =
        typeof req.query
          .authorUserId ===
        "string"
          ? req.query.authorUserId.trim()
          : "";

      const needId =
        typeof req.query.needId ===
        "string"
          ? req.query.needId.trim()
          : "";

      const q =
        typeof req.query.q ===
        "string"
          ? req.query.q.trim()
          : "";

      const filter: Record<
        string,
        any
      > = {
        status:
          "active",
      };

      /* -------------------------
         Type
      ------------------------- */

      if (
        type ===
          "announcement" ||
        type ===
          "question"
      ) {
        filter.type =
          type;
      }

      /* -------------------------
         Author
      ------------------------- */

      if (
        authorUserId
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(
            authorUserId
          )
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid authorUserId",
            });

          return;
        }

        filter.authorUserId =
          authorUserId;
      }

      /* -------------------------
         Need
      ------------------------- */

      if (needId) {
        const validNeedId =
          idString(
            needId
          );

        if (
          !validNeedId
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid needId",
            });

          return;
        }

        filter.needIds =
          validNeedId;
      }

      /* -------------------------
         Search
      ------------------------- */

      if (q) {
        filter.$or = [
          {
            title: {
              $regex:
                q,

              $options:
                "i",
            },
          },

          {
            body: {
              $regex:
                q,

              $options:
                "i",
            },
          },

          /*
           * category remains searchable
           * while the legacy field exists.
           */
          {
            category: {
              $regex:
                q,

              $options:
                "i",
            },
          },

          {
            authorCity: {
              $regex:
                q,

              $options:
                "i",
            },
          },
        ];
      }

      const posts =
        await populateForumPost(
          ForumPost.find(
            filter
          )
            .sort({
              createdAt:
                -1,
            })
            .limit(
              100
            )
        );

      res
        .status(200)
        .json(
          posts
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch forum posts",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   CREATE FORUM POST
   POST /api/forum/posts
========================================================= */

export const createForumPost =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const user =
        await getRegisteredForumUser(
          req
        );

      const title =
        trimText(
          req.body.title
        );

      const body =
        trimText(
          req.body.body
        );

      const authorCity =
        trimText(
          req.body.authorCity
        ) ||
        undefined;

      if (!user) {
        res
          .status(401)
          .json({
            message:
              "Registered user is required",
          });

        return;
      }

      if (
        !title ||
        !body
      ) {
        res
          .status(400)
          .json({
            message:
              "title and body are required",
          });

        return;
      }

      /* -------------------------
         Need IDs
      ------------------------- */

      const normalizedNeeds =
        normalizeNeedIds(
          req.body.needIds
        );

      if (
        normalizedNeeds.error
      ) {
        res
          .status(400)
          .json({
            message:
              normalizedNeeds.error,
          });

        return;
      }

      const needError =
        await validateNeedIds(
          normalizedNeeds.values
        );

      if (
        needError
      ) {
        res
          .status(400)
          .json({
            message:
              needError,
          });

        return;
      }

      /* -------------------------
         Create
      ------------------------- */

      const post =
        await ForumPost.create(
          {
            authorUserId:
              user._id,

            type:
              normalizePostType(
                req.body.type
              ),

            title,

            body,

            authorName:
              getUserDisplayName(
                user
              ),

            authorCity,

            /*
             * Temporary legacy topic.
             */
            category:
              trimText(
                req.body.category
              ) ||
              undefined,

            /*
             * New semantic relation.
             */
            needIds:
              normalizedNeeds.values,

            status:
              "active",
          }
        );

      const populated =
        await populateForumPost(
          ForumPost.findById(
            post._id
          )
        );

      res
        .status(201)
        .json(
          populated
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to create forum post",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   ADD COMMENT
   POST /api/forum/posts/:id/comments
========================================================= */

export const addForumComment =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const user =
        await getRegisteredForumUser(
          req
        );

      const body =
        trimText(
          req.body.body
        );

      const authorCity =
        trimText(
          req.body.authorCity
        ) ||
        undefined;

      if (!user) {
        res
          .status(401)
          .json({
            message:
              "Registered user is required",
          });

        return;
      }

      if (!body) {
        res
          .status(400)
          .json({
            message:
              "body is required",
          });

        return;
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid forum post id",
          });

        return;
      }

      const post =
        await populateForumPost(
          ForumPost.findOneAndUpdate(
            {
              _id:
                req.params.id,

              status:
                "active",
            },

            {
              $push: {
                comments: {
                  authorUserId:
                    user._id,

                  authorName:
                    getUserDisplayName(
                      user
                    ),

                  authorCity,

                  body,

                  createdAt:
                    new Date(),
                },
              },
            },

            {
              new:
                true,

              runValidators:
                true,
            }
          )
        );

      if (!post) {
        res
          .status(404)
          .json({
            message:
              "Forum post not found",
          });

        return;
      }

      res
        .status(201)
        .json(
          post
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to add forum comment",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   GET FORUM MESSAGES
   GET /api/forum/messages
========================================================= */

export const getForumMessages =
  async (
    _req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const messages =
        await ForumMessage.find(
          {
            status:
              "active",
          }
        )
          .sort({
            createdAt:
              -1,
          })
          .limit(
            80
          );

      res
        .status(200)
        .json(
          messages.reverse()
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch forum messages",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   CREATE FORUM MESSAGE
   POST /api/forum/messages
========================================================= */

export const createForumMessage =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const user =
        await getRegisteredForumUser(
          req
        );

      const body =
        trimText(
          req.body.body
        );

      const authorCity =
        trimText(
          req.body.authorCity
        ) ||
        undefined;

      if (!user) {
        res
          .status(401)
          .json({
            message:
              "Registered user is required",
          });

        return;
      }

      if (!body) {
        res
          .status(400)
          .json({
            message:
              "body is required",
          });

        return;
      }

      const message =
        await ForumMessage.create(
          {
            authorUserId:
              user._id,

            authorName:
              getUserDisplayName(
                user
              ),

            authorCity,

            body,

            status:
              "active",
          }
        );

      res
        .status(201)
        .json(
          message
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to create forum message",

          error:
            error.message,
        });
    }
  };