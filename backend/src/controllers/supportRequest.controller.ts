import {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import Need from "../models/need.model";

import Organization from "../models/organization.model";

import SupportRequest, {
  SupportRequestStatus,
} from "../models/supportRequest.model";

import User from "../models/user.model";

import {
  isPlatformStaff,
} from "../services/authorization.service";

/* =========================================================
   Helpers
========================================================= */

const idString = (
  value: unknown
): string | null => {
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
};

const trimText = (
  value: unknown,
  fallback = ""
): string =>
  typeof value ===
  "string"
    ? value.trim()
    : fallback;

/* =========================================================
   Normalize IDs
========================================================= */

function normalizeIdArray(
  value: unknown,
  fieldName: string
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
        `${fieldName} must be an array`,
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
      (
        item
      ) =>
        !item
    )
  ) {
    return {
      values:
        [],

      error:
        `Every ${fieldName} value must be a valid id`,
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
   Validate Needs
========================================================= */

async function validateNeeds(
  mainNeedId: string,
  relatedNeedIds: string[]
): Promise<string | null> {
  const allIds =
    Array.from(
      new Set([
        mainNeedId,
        ...relatedNeedIds,
      ])
    );

  const count =
    await Need.countDocuments(
      {
        _id: {
          $in:
            allIds,
        },

        status:
          "active",
      }
    );

  if (
    count !==
    allIds.length
  ) {
    return "Every need must exist and be active";
  }

  return null;
}

/* =========================================================
   Validate assignments
========================================================= */

async function validateAssignments(
  assignedOrganizationId:
    string | null,

  assignedUserId:
    string | null
): Promise<string | null> {
  if (
    assignedOrganizationId
  ) {
    const organization =
      await Organization.findById(
        assignedOrganizationId
      ).select(
        "_id status"
      );

    if (
      !organization ||
      organization.status ===
        "archived"
    ) {
      return "Assigned organization not found or archived";
    }
  }

  if (
    assignedUserId
  ) {
    const user =
      await User.findById(
        assignedUserId
      ).select(
        "_id status"
      );

    if (
      !user ||
      user.status ===
        "blocked" ||
      user.status ===
        "inactive"
    ) {
      return "Assigned user not found or unavailable";
    }
  }

  return null;
}

/* =========================================================
   Populate
========================================================= */

function populateSupportRequest(
  query: any
) {
  return query
    .populate(
      "userId",

      "displayName fullName profileImage status"
    )
    .populate(
      "mainNeedId",

      "code labels descriptions status order"
    )
    .populate(
      "relatedNeedIds",

      "code labels descriptions status order"
    )
    .populate(
      "assignedOrganizationId",

      "name slug status verificationStatus"
    )
    .populate(
      "assignedUserId",

      "displayName fullName profileImage status"
    );
}

/* =========================================================
   CREATE
   POST /api/support-requests
========================================================= */

export const createSupportRequest =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth
      ) {
        res
          .status(401)
          .json({
            message:
              "Authentication is required",
          });

        return;
      }

      const mainNeedId =
        idString(
          req.body.mainNeedId
        );

      if (!mainNeedId) {
        res
          .status(400)
          .json({
            message:
              "A valid mainNeedId is required",
          });

        return;
      }

      const normalizedRelatedNeeds =
        normalizeIdArray(
          req.body.relatedNeedIds,
          "relatedNeedIds"
        );

      if (
        normalizedRelatedNeeds.error
      ) {
        res
          .status(400)
          .json({
            message:
              normalizedRelatedNeeds.error,
          });

        return;
      }

      /*
       * mainNeedId is not duplicated
       * inside relatedNeedIds.
       */
      const relatedNeedIds =
        normalizedRelatedNeeds.values.filter(
          (
            id
          ) =>
            id !==
            mainNeedId
        );

      const needsError =
        await validateNeeds(
          mainNeedId,
          relatedNeedIds
        );

      if (
        needsError
      ) {
        res
          .status(400)
          .json({
            message:
              needsError,
          });

        return;
      }

      const title =
        trimText(
          req.body.title
        );

      const description =
        trimText(
          req.body.description
        );

      if (
        !title ||
        !description
      ) {
        res
          .status(400)
          .json({
            message:
              "title and description are required",
          });

        return;
      }

      const supportedLanguages =
        [
          "es",
          "eu",
          "ar",
          "en",
        ];

      const sourceLanguage =
        supportedLanguages.includes(
          req.body.sourceLanguage
        )
          ? req.body.sourceLanguage
          : "es";

      const supportedUrgencies =
        [
          "normal",
          "urgent",
          "critical",
        ];

      const urgency =
        supportedUrgencies.includes(
          req.body.urgency
        )
          ? req.body.urgency
          : "normal";

      const supportedContactPreferences =
        [
          "platform",
          "email",
          "phone",
        ];

      const contactPreference =
        supportedContactPreferences.includes(
          req.body.contactPreference
        )
          ? req.body.contactPreference
          : "platform";

      const created =
        await SupportRequest.create(
          {
            userId:
              req.auth.userId,

            mainNeedId,

            relatedNeedIds,

            title,

            description,

            sourceLanguage,

            urgency,

            status:
              "open",

            contactPreference,

            assignedOrganizationId:
              null,

            assignedUserId:
              null,

            resolvedAt:
              null,

            closedAt:
              null,
          }
        );

      const result =
        await populateSupportRequest(
          SupportRequest.findById(
            created._id
          )
        );

      res
        .status(201)
        .json(
          result
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to create support request",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   MY REQUESTS
   GET /api/support-requests/my
========================================================= */

export const getMySupportRequests =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth
      ) {
        res
          .status(401)
          .json({
            message:
              "Authentication is required",
          });

        return;
      }

      const conditions: Record<
        string,
        unknown
      > = {
        userId:
          req.auth.userId,
      };

      const status =
        typeof req.query.status ===
        "string"
          ? req.query.status
          : "";

      const validStatuses:
        SupportRequestStatus[] =
        [
          "open",
          "in_review",
          "in_progress",
          "resolved",
          "closed",
        ];

      if (
        validStatuses.includes(
          status as SupportRequestStatus
        )
      ) {
        conditions.status =
          status;
      }

      const requests =
        await populateSupportRequest(
          SupportRequest.find(
            conditions
          ).sort({
            createdAt:
              -1,
          })
        );

      res
        .status(200)
        .json(
          requests
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch support requests",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   SINGLE USER REQUEST
   GET /api/support-requests/:id
========================================================= */

export const getSupportRequestById =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth
      ) {
        res
          .status(401)
          .json({
            message:
              "Authentication is required",
          });

        return;
      }

      const requestId =
        idString(
          req.params.id
        );

      if (!requestId) {
        res
          .status(400)
          .json({
            message:
              "Invalid support request id",
          });

        return;
      }

      const supportRequest =
        await populateSupportRequest(
          SupportRequest.findById(
            requestId
          )
        );

      if (
        !supportRequest
      ) {
        res
          .status(404)
          .json({
            message:
              "Support request not found",
          });

        return;
      }

      const isOwner =
        String(
          supportRequest.userId?._id ||
            supportRequest.userId
        ) ===
        req.auth.userId;

      const isStaff =
        isPlatformStaff(
          req.auth.platformRole
        );

      if (
        !isOwner &&
        !isStaff
      ) {
        res
          .status(403)
          .json({
            message:
              "You cannot access this support request",
          });

        return;
      }

      res
        .status(200)
        .json(
          supportRequest
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch support request",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   USER UPDATE
   PUT /api/support-requests/:id

   Owner may edit only while request
   has not entered active processing.
========================================================= */

export const updateSupportRequest =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth
      ) {
        res
          .status(401)
          .json({
            message:
              "Authentication is required",
          });

        return;
      }

      const requestId =
        idString(
          req.params.id
        );

      if (!requestId) {
        res
          .status(400)
          .json({
            message:
              "Invalid support request id",
          });

        return;
      }

      const current =
        await SupportRequest.findById(
          requestId
        );

      if (
        !current
      ) {
        res
          .status(404)
          .json({
            message:
              "Support request not found",
          });

        return;
      }

      const isOwner =
        String(
          current.userId
        ) ===
        req.auth.userId;

      if (!isOwner) {
        res
          .status(403)
          .json({
            message:
              "You cannot update this support request",
          });

        return;
      }

      if (
        ![
          "open",
          "in_review",
        ].includes(
          current.status
        )
      ) {
        res
          .status(409)
          .json({
            message:
              "This support request can no longer be edited",
          });

        return;
      }

      const mainNeedId =
        req.body.mainNeedId !==
        undefined
          ? idString(
              req.body.mainNeedId
            )
          : String(
              current.mainNeedId
            );

      if (!mainNeedId) {
        res
          .status(400)
          .json({
            message:
              "A valid mainNeedId is required",
          });

        return;
      }

      const normalizedRelatedNeeds =
        req.body.relatedNeedIds !==
        undefined
          ? normalizeIdArray(
              req.body.relatedNeedIds,
              "relatedNeedIds"
            )
          : {
              values:
                current.relatedNeedIds.map(
                  (
                    id
                  ) =>
                    String(id)
                ),
            };

      if (
        normalizedRelatedNeeds.error
      ) {
        res
          .status(400)
          .json({
            message:
              normalizedRelatedNeeds.error,
          });

        return;
      }

      const relatedNeedIds =
        normalizedRelatedNeeds.values.filter(
          (
            id
          ) =>
            id !==
            mainNeedId
        );

      const needsError =
        await validateNeeds(
          mainNeedId,
          relatedNeedIds
        );

      if (
        needsError
      ) {
        res
          .status(400)
          .json({
            message:
              needsError,
          });

        return;
      }

      const updates: Record<
        string,
        unknown
      > = {
        mainNeedId,

        relatedNeedIds,
      };

      if (
        req.body.title !==
        undefined
      ) {
        const title =
          trimText(
            req.body.title
          );

        if (!title) {
          res
            .status(400)
            .json({
              message:
                "title cannot be empty",
            });

          return;
        }

        updates.title =
          title;
      }

      if (
        req.body.description !==
        undefined
      ) {
        const description =
          trimText(
            req.body.description
          );

        if (
          !description
        ) {
          res
            .status(400)
            .json({
              message:
                "description cannot be empty",
            });

          return;
        }

        updates.description =
          description;
      }

      if (
        req.body.sourceLanguage !==
        undefined &&
        [
          "es",
          "eu",
          "ar",
          "en",
        ].includes(
          req.body.sourceLanguage
        )
      ) {
        updates.sourceLanguage =
          req.body.sourceLanguage;
      }

      if (
        req.body.urgency !==
        undefined &&
        [
          "normal",
          "urgent",
          "critical",
        ].includes(
          req.body.urgency
        )
      ) {
        updates.urgency =
          req.body.urgency;
      }

      if (
        req.body.contactPreference !==
        undefined &&
        [
          "platform",
          "email",
          "phone",
        ].includes(
          req.body.contactPreference
        )
      ) {
        updates.contactPreference =
          req.body.contactPreference;
      }

      const updated =
        await populateSupportRequest(
          SupportRequest.findByIdAndUpdate(
            requestId,

            updates,

            {
              new:
                true,

              runValidators:
                true,
            }
          )
        );

      res
        .status(200)
        .json(
          updated
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to update support request",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   USER CLOSE
   DELETE /api/support-requests/:id

   Soft close, not physical delete.
========================================================= */

export const closeSupportRequest =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth
      ) {
        res
          .status(401)
          .json({
            message:
              "Authentication is required",
          });

        return;
      }

      const requestId =
        idString(
          req.params.id
        );

      if (!requestId) {
        res
          .status(400)
          .json({
            message:
              "Invalid support request id",
          });

        return;
      }

      const current =
        await SupportRequest.findById(
          requestId
        );

      if (
        !current
      ) {
        res
          .status(404)
          .json({
            message:
              "Support request not found",
          });

        return;
      }

      const isOwner =
        String(
          current.userId
        ) ===
        req.auth.userId;

      const isStaff =
        isPlatformStaff(
          req.auth.platformRole
        );

      if (
        !isOwner &&
        !isStaff
      ) {
        res
          .status(403)
          .json({
            message:
              "You cannot close this support request",
          });

        return;
      }

      current.status =
        "closed";

      current.closedAt =
        new Date();

      await current.save();

      const result =
        await populateSupportRequest(
          SupportRequest.findById(
            current._id
          )
        );

      res
        .status(200)
        .json(
          result
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to close support request",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   STAFF LIST
   GET /api/support-requests

   Staff only.
========================================================= */

export const getSupportRequests =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth ||
        !isPlatformStaff(
          req.auth.platformRole
        )
      ) {
        res
          .status(403)
          .json({
            message:
              "Insufficient platform permissions",
          });

        return;
      }

      const conditions: Record<
        string,
        unknown
      > = {};

      const status =
        typeof req.query.status ===
        "string"
          ? req.query.status
          : "";

      if (
        [
          "open",
          "in_review",
          "in_progress",
          "resolved",
          "closed",
        ].includes(
          status
        )
      ) {
        conditions.status =
          status;
      }

      const mainNeedId =
        typeof req.query.mainNeedId ===
        "string"
          ? req.query.mainNeedId
          : "";

      if (
        mainNeedId
      ) {
        const validNeedId =
          idString(
            mainNeedId
          );

        if (
          !validNeedId
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid mainNeedId",
            });

          return;
        }

        conditions.mainNeedId =
          validNeedId;
      }

      const userId =
        typeof req.query.userId ===
        "string"
          ? req.query.userId
          : "";

      if (
        userId
      ) {
        const validUserId =
          idString(
            userId
          );

        if (
          !validUserId
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid userId",
            });

          return;
        }

        conditions.userId =
          validUserId;
      }

      const assignedOrganizationId =
        typeof req.query
          .assignedOrganizationId ===
        "string"
          ? req.query.assignedOrganizationId
          : "";

      if (
        assignedOrganizationId
      ) {
        const validOrganizationId =
          idString(
            assignedOrganizationId
          );

        if (
          !validOrganizationId
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid assignedOrganizationId",
            });

          return;
        }

        conditions.assignedOrganizationId =
          validOrganizationId;
      }

      const requests =
        await populateSupportRequest(
          SupportRequest.find(
            conditions
          ).sort({
            createdAt:
              -1,
          })
        );

      res
        .status(200)
        .json(
          requests
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch support requests",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   STAFF UPDATE
   PUT /api/support-requests/:id/manage
========================================================= */

export const manageSupportRequest =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth ||
        !isPlatformStaff(
          req.auth.platformRole
        )
      ) {
        res
          .status(403)
          .json({
            message:
              "Insufficient platform permissions",
          });

        return;
      }

      const requestId =
        idString(
          req.params.id
        );

      if (!requestId) {
        res
          .status(400)
          .json({
            message:
              "Invalid support request id",
          });

        return;
      }

      const current =
        await SupportRequest.findById(
          requestId
        );

      if (
        !current
      ) {
        res
          .status(404)
          .json({
            message:
              "Support request not found",
          });

        return;
      }

      const validStatuses:
        SupportRequestStatus[] =
        [
          "open",
          "in_review",
          "in_progress",
          "resolved",
          "closed",
        ];

      const status =
        req.body.status !==
        undefined
          ? req.body.status
          : current.status;

      if (
        !validStatuses.includes(
          status
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid support request status",
          });

        return;
      }

      const assignedOrganizationId =
        req.body.assignedOrganizationId ===
        null ||
        req.body.assignedOrganizationId ===
        ""
          ? null
          : req.body.assignedOrganizationId !==
            undefined
          ? idString(
              req.body.assignedOrganizationId
            )
          : current.assignedOrganizationId
          ? String(
              current.assignedOrganizationId
            )
          : null;

      if (
        req.body.assignedOrganizationId !==
          undefined &&
        req.body.assignedOrganizationId !==
          null &&
        req.body.assignedOrganizationId !==
          "" &&
        !assignedOrganizationId
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid assignedOrganizationId",
          });

        return;
      }

      const assignedUserId =
        req.body.assignedUserId ===
        null ||
        req.body.assignedUserId ===
        ""
          ? null
          : req.body.assignedUserId !==
            undefined
          ? idString(
              req.body.assignedUserId
            )
          : current.assignedUserId
          ? String(
              current.assignedUserId
            )
          : null;

      if (
        req.body.assignedUserId !==
          undefined &&
        req.body.assignedUserId !==
          null &&
        req.body.assignedUserId !==
          "" &&
        !assignedUserId
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid assignedUserId",
          });

        return;
      }

      const assignmentError =
        await validateAssignments(
          assignedOrganizationId,
          assignedUserId
        );

      if (
        assignmentError
      ) {
        res
          .status(400)
          .json({
            message:
              assignmentError,
          });

        return;
      }

      const updates: Record<
        string,
        unknown
      > = {
        status,

        assignedOrganizationId,

        assignedUserId,
      };

      if (
        status ===
        "resolved"
      ) {
        updates.resolvedAt =
          current.resolvedAt ||
          new Date();
      } else {
        updates.resolvedAt =
          null;
      }

      if (
        status ===
        "closed"
      ) {
        updates.closedAt =
          current.closedAt ||
          new Date();
      } else {
        updates.closedAt =
          null;
      }

      const updated =
        await populateSupportRequest(
          SupportRequest.findByIdAndUpdate(
            requestId,

            updates,

            {
              new:
                true,

              runValidators:
                true,
            }
          )
        );

      res
        .status(200)
        .json(
          updated
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to manage support request",

          error:
            error.message,
        });
    }
  };