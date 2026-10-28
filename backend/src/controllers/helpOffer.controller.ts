import {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import Need from "../models/need.model";

import Organization from "../models/organization.model";

import HelpOffer, {
  HelpOfferStatus,
} from "../models/helpOffer.model";

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
   Validate assignment
========================================================= */

async function validateAssignment(
  assignedOrganizationId:
    string | null
): Promise<string | null> {
  if (
    !assignedOrganizationId
  ) {
    return null;
  }

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

  return null;
}

/* =========================================================
   Populate
========================================================= */

function populateHelpOffer(
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
    );
}

/* =========================================================
   CREATE
   POST /api/help-offers
========================================================= */

export const createHelpOffer =
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

      const supportedAvailability =
        [
          "flexible",
          "weekdays",
          "weekends",
          "specific",
        ];

      const availability =
        supportedAvailability.includes(
          req.body.availability
        )
          ? req.body.availability
          : "flexible";

      const availabilityNote =
        trimText(
          req.body.availabilityNote
        );

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
        await HelpOffer.create(
          {
            userId:
              req.auth.userId,

            mainNeedId,

            relatedNeedIds,

            title,

            description,

            sourceLanguage,

            availability,

            availabilityNote,

            status:
              "active",

            contactPreference,

            assignedOrganizationId:
              null,

            matchedAt:
              null,

            closedAt:
              null,
          }
        );

      const result =
        await populateHelpOffer(
          HelpOffer.findById(
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
            "Failed to create help offer",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   MY OFFERS
   GET /api/help-offers/my
========================================================= */

export const getMyHelpOffers =
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
        HelpOfferStatus[] =
        [
          "active",
          "paused",
          "matched",
          "closed",
        ];

      if (
        validStatuses.includes(
          status as HelpOfferStatus
        )
      ) {
        conditions.status =
          status;
      }

      const offers =
        await populateHelpOffer(
          HelpOffer.find(
            conditions
          ).sort({
            createdAt:
              -1,
          })
        );

      res
        .status(200)
        .json(
          offers
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch help offers",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   SINGLE OFFER
   GET /api/help-offers/:id
========================================================= */

export const getHelpOfferById =
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

      const offerId =
        idString(
          req.params.id
        );

      if (!offerId) {
        res
          .status(400)
          .json({
            message:
              "Invalid help offer id",
          });

        return;
      }

      const helpOffer =
        await populateHelpOffer(
          HelpOffer.findById(
            offerId
          )
        );

      if (
        !helpOffer
      ) {
        res
          .status(404)
          .json({
            message:
              "Help offer not found",
          });

        return;
      }

      const isOwner =
        String(
          helpOffer.userId?._id ||
            helpOffer.userId
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
              "You cannot access this help offer",
          });

        return;
      }

      res
        .status(200)
        .json(
          helpOffer
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch help offer",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   USER UPDATE
   PUT /api/help-offers/:id

   Owner may edit while offer is
   active or paused.
========================================================= */

export const updateHelpOffer =
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

      const offerId =
        idString(
          req.params.id
        );

      if (!offerId) {
        res
          .status(400)
          .json({
            message:
              "Invalid help offer id",
          });

        return;
      }

      const current =
        await HelpOffer.findById(
          offerId
        );

      if (
        !current
      ) {
        res
          .status(404)
          .json({
            message:
              "Help offer not found",
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
              "You cannot update this help offer",
          });

        return;
      }

      if (
        ![
          "active",
          "paused",
        ].includes(
          current.status
        )
      ) {
        res
          .status(409)
          .json({
            message:
              "This help offer can no longer be edited",
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
        req.body.availability !==
        undefined &&
        [
          "flexible",
          "weekdays",
          "weekends",
          "specific",
        ].includes(
          req.body.availability
        )
      ) {
        updates.availability =
          req.body.availability;
      }

      if (
        req.body.availabilityNote !==
        undefined
      ) {
        updates.availabilityNote =
          trimText(
            req.body.availabilityNote
          );
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

      /*
       * Owner may pause or reactivate
       * an offer, but may not mark it
       * matched.
       */
      if (
        req.body.status !==
        undefined
      ) {
        if (
          ![
            "active",
            "paused",
          ].includes(
            req.body.status
          )
        ) {
          res
            .status(400)
            .json({
              message:
                "Owner may only set status to active or paused",
            });

          return;
        }

        updates.status =
          req.body.status;
      }

      const updated =
        await populateHelpOffer(
          HelpOffer.findByIdAndUpdate(
            offerId,

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
            "Failed to update help offer",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   USER CLOSE
   DELETE /api/help-offers/:id

   Soft close, not physical delete.
========================================================= */

export const closeHelpOffer =
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

      const offerId =
        idString(
          req.params.id
        );

      if (!offerId) {
        res
          .status(400)
          .json({
            message:
              "Invalid help offer id",
          });

        return;
      }

      const current =
        await HelpOffer.findById(
          offerId
        );

      if (
        !current
      ) {
        res
          .status(404)
          .json({
            message:
              "Help offer not found",
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
              "You cannot close this help offer",
          });

        return;
      }

      current.status =
        "closed";

      current.closedAt =
        current.closedAt ||
        new Date();

      await current.save();

      const result =
        await populateHelpOffer(
          HelpOffer.findById(
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
            "Failed to close help offer",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   STAFF LIST
   GET /api/help-offers

   Staff only.
========================================================= */

export const getHelpOffers =
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
          "active",
          "paused",
          "matched",
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

      const offers =
        await populateHelpOffer(
          HelpOffer.find(
            conditions
          ).sort({
            createdAt:
              -1,
          })
        );

      res
        .status(200)
        .json(
          offers
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch help offers",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   STAFF UPDATE
   PUT /api/help-offers/:id/manage
========================================================= */

export const manageHelpOffer =
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

      const offerId =
        idString(
          req.params.id
        );

      if (!offerId) {
        res
          .status(400)
          .json({
            message:
              "Invalid help offer id",
          });

        return;
      }

      const current =
        await HelpOffer.findById(
          offerId
        );

      if (
        !current
      ) {
        res
          .status(404)
          .json({
            message:
              "Help offer not found",
          });

        return;
      }

      const validStatuses:
        HelpOfferStatus[] =
        [
          "active",
          "paused",
          "matched",
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
              "Invalid help offer status",
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

      const assignmentError =
        await validateAssignment(
          assignedOrganizationId
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
      };

      if (
        status ===
        "matched"
      ) {
        updates.matchedAt =
          current.matchedAt ||
          new Date();
      } else {
        updates.matchedAt =
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
        await populateHelpOffer(
          HelpOffer.findByIdAndUpdate(
            offerId,

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
            "Failed to manage help offer",

          error:
            error.message,
        });
    }
  };
