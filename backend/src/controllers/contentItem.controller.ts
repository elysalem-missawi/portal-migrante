import {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import ContentItem, {
  type ContentItemType,
} from "../models/contentItem.model";

import Need from "../models/need.model";

/* =========================================================
   Helpers
========================================================= */

const validObjectId = (
  value: unknown
): value is string =>
  typeof value === "string" &&
  mongoose.Types.ObjectId.isValid(
    value
  );

const VALID_TYPES: ContentItemType[] = [
  "information",
  "guide",
  "external_resource",
];

function normalizeNeedIds(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter(
          (
            item
          ): item is string =>
            typeof item ===
              "string" &&
            mongoose.Types.ObjectId.isValid(
              item
            )
        )
        .map((item) =>
          item.trim()
        )
    )
  );
}

async function validateNeedIds(
  needIds: string[]
): Promise<string | null> {
  if (
    needIds.length === 0
  ) {
    return "At least one need is required";
  }

  const count =
    await Need.countDocuments({
      _id: {
        $in: needIds,
      },

      status: "active",
    });

  if (
    count !== needIds.length
  ) {
    return "One or more needs do not exist or are inactive";
  }

  return null;
}

function validateBaseFields(
  data: any
): string | null {
  if (
    !VALID_TYPES.includes(
      data.type
    )
  ) {
    return "Invalid content type";
  }

  if (
    !data.translations?.es
      ?.title ||
    typeof data.translations.es
      .title !== "string" ||
    !data.translations.es.title.trim()
  ) {
    return "Spanish title is required";
  }

  if (
    !data.source?.name ||
    typeof data.source.name !==
      "string" ||
    !data.source.name.trim()
  ) {
    return "Source name is required";
  }

  if (
    data.type === "guide"
  ) {
    if (
      !Array.isArray(
        data.steps
      ) ||
      data.steps.length === 0
    ) {
      return "Guide content requires at least one step";
    }

    const invalidStep =
      data.steps.some(
        (step: any) =>
          !step?.translations?.es
            ?.title ||
          !String(
            step.translations.es
              .title
          ).trim()
      );

    if (invalidStep) {
      return "Every guide step requires a Spanish title";
    }
  }

  if (
    data.type ===
    "external_resource"
  ) {
    const resource =
      data.resourceData;

    const hasContact =
      resource?.url ||
      resource?.phone ||
      resource?.email ||
      resource?.contactText;

    if (!hasContact) {
      return "External resource requires at least one contact channel";
    }
  }

  return null;
}

function publicQuery() {
  return {
    status: "active",
  };
}

/* =========================================================
   GET /content-items
========================================================= */

export const getContentItems =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const conditions: Record<
        string,
        unknown
      >[] = [
        publicQuery(),
      ];

      /* -------------------------
         Filter by need
      ------------------------- */

      if (
        req.query.needId
      ) {
        if (
          !validObjectId(
            req.query.needId
          )
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid needId",
            });

          return;
        }

        conditions.push({
          needIds:
            req.query.needId,
        });
      }

      /* -------------------------
         Filter by type
      ------------------------- */

      if (
        typeof req.query.type ===
        "string"
      ) {
        if (
          !VALID_TYPES.includes(
            req.query
              .type as ContentItemType
          )
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid content type",
            });

          return;
        }

        conditions.push({
          type: req.query.type,
        });
      }

      const items =
        await ContentItem.find({
          $and: conditions,
        })
          .populate(
            "needIds",
            "code labels descriptions status order"
          )
          .sort({
            order: 1,
            createdAt: -1,
          });

      res
        .status(200)
        .json(items);
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch content items",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   GET /content-items/:id
========================================================= */

export const getContentItemById =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !validObjectId(
          req.params.id
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid content item id",
          });

        return;
      }

      const item =
        await ContentItem.findOne(
          {
            _id: req.params.id,
            status: "active",
          }
        ).populate(
          "needIds",
          "code labels descriptions status order"
        );

      if (!item) {
        res
          .status(404)
          .json({
            message:
              "Content item not found",
          });

        return;
      }

      res
        .status(200)
        .json(item);
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch content item",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   POST /content-items
========================================================= */

export const createContentItem =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const needIds =
        normalizeNeedIds(
          req.body.needIds
        );

      const needError =
        await validateNeedIds(
          needIds
        );

      if (needError) {
        res
          .status(400)
          .json({
            message:
              needError,
          });

        return;
      }

      const data = {
        ...req.body,
        needIds,
      };

      const validationError =
        validateBaseFields(
          data
        );

      if (
        validationError
      ) {
        res
          .status(400)
          .json({
            message:
              validationError,
          });

        return;
      }

      /*
       * New administrative content
       * starts as draft unless the
       * administrator explicitly
       * sets active.
       */
      const status =
        req.body.status ===
        "active"
          ? "active"
          : "draft";

      const item =
        await ContentItem.create(
          {
            ...data,
            status,
          }
        );

      const populated =
        await ContentItem.findById(
          item._id
        ).populate(
          "needIds",
          "code labels descriptions status order"
        );

      res
        .status(201)
        .json(populated);
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to create content item",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   PUT /content-items/:id
========================================================= */

export const updateContentItem =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !validObjectId(
          req.params.id
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid content item id",
          });

        return;
      }

      const current =
        await ContentItem.findById(
          req.params.id
        ).lean();

      if (!current) {
        res
          .status(404)
          .json({
            message:
              "Content item not found",
          });

        return;
      }

      const allowedFields = [
        "type",
        "needIds",
        "translations",
        "steps",
        "resourceData",
        "source",
        "order",
        "status",
      ];

      const updates =
        Object.fromEntries(
          Object.entries(
            req.body
          ).filter(
            ([key]) =>
              allowedFields.includes(
                key
              )
          )
        );

      /* -------------------------
         Need validation
      ------------------------- */

      let needIds: string[];

      if (
        updates.needIds !==
        undefined
      ) {
        needIds =
          normalizeNeedIds(
            updates.needIds
          );

        const needError =
          await validateNeedIds(
            needIds
          );

        if (needError) {
          res
            .status(400)
            .json({
              message:
                needError,
            });

          return;
        }

        updates.needIds =
          needIds;
      } else {
        needIds =
          current.needIds.map(
            (id) =>
              String(id)
          );
      }

      /* -------------------------
         Build candidate
      ------------------------- */

      const candidate = {
        ...current,
        ...updates,
        needIds,
      };

      const validationError =
        validateBaseFields(
          candidate
        );

      if (
        validationError
      ) {
        res
          .status(400)
          .json({
            message:
              validationError,
          });

        return;
      }

      /* -------------------------
         Status validation
      ------------------------- */

      if (
        updates.status !==
          undefined &&
        ![
          "draft",
          "active",
          "inactive",
        ].includes(
          String(
            updates.status
          )
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid content status",
          });

        return;
      }

      const item =
        await ContentItem.findByIdAndUpdate(
          req.params.id,
          updates,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "needIds",
          "code labels descriptions status order"
        );

      if (!item) {
        res
          .status(404)
          .json({
            message:
              "Content item not found",
          });

        return;
      }

      res
        .status(200)
        .json(item);
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to update content item",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   DELETE /content-items/:id
   Soft deactivate
========================================================= */

export const deactivateContentItem =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !validObjectId(
          req.params.id
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid content item id",
          });

        return;
      }

      const item =
        await ContentItem.findByIdAndUpdate(
          req.params.id,
          {
            status:
              "inactive",
          },
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "needIds",
          "code labels descriptions status order"
        );

      if (!item) {
        res
          .status(404)
          .json({
            message:
              "Content item not found",
          });

        return;
      }

      res
        .status(200)
        .json(item);
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to deactivate content item",

          error:
            error.message,
        });
    }
  };