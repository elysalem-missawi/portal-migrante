import {
  Request,
  Response,
} from "express";

import mongoose, {
  Types,
} from "mongoose";

import Organization from "../models/organization.model";

import OrganizationLocation from "../models/organizationLocation.model";

import OrganizationMember from "../models/organizationMember.model";

import Service from "../models/service.model";

import ServiceCategory from "../models/serviceCategory.model";

import Need from "../models/need.model";

import {
  canManageOrganization,
  isPlatformAdmin,
} from "../services/authorization.service";

/* =========================================================
   Constants
========================================================= */

const supportedServiceLanguages = [
  "es",
  "eu",
  "ar",
  "en",
] as const;

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

/* =========================================================
   Normalize ID arrays
========================================================= */

function normalizeIdArray(
  value: unknown,
  fieldName: string
): {
  values: string[];
  error?: string;
} {
  if (!Array.isArray(value)) {
    return {
      values: [],
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
      (item) =>
        !item
    )
  ) {
    return {
      values: [],
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
   Multilingual content
========================================================= */

function normalizeServiceContent(
  data: any
):
  | {
      translations: Record<
        string,
        {
          title: string;
          description: string;
          eligibility: string;
        }
      >;

      title: string;

      description: string;

      eligibility: string;

      error?: undefined;
    }
  | {
      error: string;

      translations?: undefined;

      title?: undefined;

      description?: undefined;

      eligibility?: undefined;
    } {
  const inputTranslations =
    data?.translations &&
    typeof data.translations ===
      "object"
      ? data.translations
      : {};

  const normalizedTranslations: Record<
    string,
    {
      title: string;
      description: string;
      eligibility: string;
    }
  > = {};

  for (
    const language of
    supportedServiceLanguages
  ) {
    const translation =
      inputTranslations[
        language
      ];

    if (!translation) {
      continue;
    }

    const title =
      typeof translation.title ===
      "string"
        ? translation.title.trim()
        : "";

    const description =
      typeof translation.description ===
      "string"
        ? translation.description.trim()
        : "";

    const eligibility =
      typeof translation.eligibility ===
      "string"
        ? translation.eligibility.trim()
        : "";

    /*
     * Optional language:
     * ignore completely empty object.
     */
    if (
      language !== "es" &&
      !title &&
      !description &&
      !eligibility
    ) {
      continue;
    }

    if (
      !title ||
      !description
    ) {
      return {
        error:
          `Both title and description are required for ${language}`,
      };
    }

    normalizedTranslations[
      language
    ] = {
      title,
      description,
      eligibility,
    };
  }

  /*
   * Compatibility with old forms.
   *
   * If translations.es is absent,
   * create it from legacy fields.
   */
  if (
    !normalizedTranslations.es
  ) {
    const legacyTitle =
      typeof data?.title ===
      "string"
        ? data.title.trim()
        : "";

    const legacyDescription =
      typeof data?.description ===
      "string"
        ? data.description.trim()
        : "";

    const legacyEligibility =
      typeof data?.eligibility ===
      "string"
        ? data.eligibility.trim()
        : "";

    if (
      !legacyTitle ||
      !legacyDescription
    ) {
      return {
        error:
          "Spanish service title and description are required",
      };
    }

    normalizedTranslations.es =
      {
        title:
          legacyTitle,

        description:
          legacyDescription,

        eligibility:
          legacyEligibility,
      };
  }

  const spanish =
    normalizedTranslations.es;

  return {
    translations:
      normalizedTranslations,

    /*
     * Keep Spanish mirrored in
     * transitional legacy fields.
     */
    title:
      spanish.title,

    description:
      spanish.description,

    eligibility:
      spanish.eligibility ||
      "",
  };
}

/* =========================================================
   Merge content during update
========================================================= */

function buildUpdateContentCandidate(
  current: any,
  updates: any
) {
  const currentTranslations =
    current?.translations &&
    typeof current.translations ===
      "object"
      ? current.translations
      : {};

  const incomingTranslations =
    updates?.translations &&
    typeof updates.translations ===
      "object"
      ? updates.translations
      : {};

  const translations = {
    ...currentTranslations,
    ...incomingTranslations,
  };

  /*
   * Compatibility with legacy forms.
   *
   * If an old form updates title,
   * description or eligibility,
   * apply those values to Spanish.
   */
  if (
    updates.title !==
      undefined ||
    updates.description !==
      undefined ||
    updates.eligibility !==
      undefined
  ) {
    const currentSpanish =
      translations.es ||
      {
        title:
          current.title ||
          "",

        description:
          current.description ||
          "",

        eligibility:
          current.eligibility ||
          "",
      };

    translations.es = {
      ...currentSpanish,

      title:
        updates.title !==
        undefined
          ? updates.title
          : currentSpanish.title,

      description:
        updates.description !==
        undefined
          ? updates.description
          : currentSpanish.description,

      eligibility:
        updates.eligibility !==
        undefined
          ? updates.eligibility
          : currentSpanish
              .eligibility,
    };
  }

  return {
    ...current,
    ...updates,
    translations,
  };
}

/* =========================================================
   Relations validation
========================================================= */

async function validateServiceRelations(
  data: any
): Promise<string | null> {
  const organizationId =
    idString(
      data.organizationId
    );

  const categoryId =
    idString(
      data.categoryId
    );

  if (!organizationId) {
    return "A valid organizationId is required";
  }

  if (!categoryId) {
    return "A valid categoryId is required";
  }

  const [
    organization,
    category,
  ] = await Promise.all([
    Organization.findById(
      organizationId
    ).select(
      "_id status"
    ),

    ServiceCategory.findById(
      categoryId
    ).select(
      "_id status"
    ),
  ]);

  if (
    !organization ||
    organization.status ===
      "archived"
  ) {
    return "Organization not found or archived";
  }

  if (
    !category ||
    category.status !==
      "active"
  ) {
    return "Service category not found or inactive";
  }

  /* =======================================================
     Locations
  ======================================================= */

  const rawLocationIds =
    Array.isArray(
      data.locationIds
    )
      ? data.locationIds
      : [];

  const locationIds =
    rawLocationIds.map(
      idString
    );

  if (
    locationIds.some(
      (
        id: string | null
      ) => !id
    )
  ) {
    return "Every locationIds value must be a valid id";
  }

  if (
    locationIds.length >
    0
  ) {
    const uniqueIds =
      Array.from(
        new Set(
          locationIds as string[]
        )
      );

    const matchingLocations =
      await OrganizationLocation.countDocuments(
        {
          _id: {
            $in:
              uniqueIds.map(
                (id) =>
                  new Types.ObjectId(
                    id
                  )
              ),
          },

          organizationId,

          status: {
            $ne: "archived",
          },
        }
      );

    if (
      matchingLocations !==
      uniqueIds.length
    ) {
      return "Every location must belong to the selected organization";
    }
  }

  /* =======================================================
     Needs
  ======================================================= */

  const rawNeedIds =
    Array.isArray(
      data.needIds
    )
      ? data.needIds
      : [];

  const normalizedNeedIds =
    rawNeedIds.map(
      idString
    );

  if (
    normalizedNeedIds.some(
      (
        id: string | null
      ) => !id
    )
  ) {
    return "Every needIds value must be a valid id";
  }

  if (
    normalizedNeedIds.length >
    0
  ) {
    const uniqueNeedIds =
      Array.from(
        new Set(
          normalizedNeedIds as string[]
        )
      );

    const matchingNeeds =
      await Need.countDocuments(
        {
          _id: {
            $in:
              uniqueNeedIds.map(
                (id) =>
                  new Types.ObjectId(
                    id
                  )
              ),
          },

          status:
            "active",
        }
      );

    if (
      matchingNeeds !==
      uniqueNeedIds.length
    ) {
      return "Every need must exist and be active";
    }
  }

  return null;
}

/* =========================================================
   Populate
========================================================= */

const populateService = (
  query: any
) =>
  query
    .populate(
      "organizationId",
      "name slug type status verificationStatus"
    )

    .populate(
      "categoryId",
      "code name parentCategoryId status"
    )

    .populate(
      "locationIds",
      "name slug municipalityId addressLine1 postalCode phone email isHeadOffice status"
    )

    .populate(
      "needIds",
      "code labels descriptions status order"
    );

/* =========================================================
   Public organizations
========================================================= */

async function publicOrganizationIds() {
  return Organization.find({
    status:
      "active",

    verificationStatus:
      "verified",
  }).distinct(
    "_id"
  );
}

/* =========================================================
   Managed organizations
========================================================= */

async function managedOrganizationIds(
  req: Request
) {
  if (!req.auth) {
    return [];
  }

  if (
    isPlatformAdmin(
      req.auth.platformRole
    )
  ) {
    return Organization.find({
      status: {
        $ne:
          "archived",
      },
    }).distinct(
      "_id"
    );
  }

  return OrganizationMember.find(
    {
      userId:
        req.auth.userId,

      status:
        "active",
    }
  ).distinct(
    "organizationId"
  );
}

/* =========================================================
   Query filters
========================================================= */

function addRelationFilters(
  req: Request,

  conditions: Record<
    string,
    unknown
  >[]
): string | null {
  const {
    categoryId,
    locationId,
    needId,
  } = req.query;

  /* -------------------------
     Category
  ------------------------- */

  if (categoryId) {
    const validCategoryId =
      idString(
        categoryId
      );

    if (
      !validCategoryId
    ) {
      return "Invalid categoryId";
    }

    conditions.push({
      categoryId:
        validCategoryId,
    });
  }

  /* -------------------------
     Location
  ------------------------- */

  if (locationId) {
    const validLocationId =
      idString(
        locationId
      );

    if (
      !validLocationId
    ) {
      return "Invalid locationId";
    }

    conditions.push({
      locationIds:
        validLocationId,
    });
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
      return "Invalid needId";
    }

    conditions.push({
      needIds:
        validNeedId,
    });
  }

  /* -------------------------
     Search
  ------------------------- */

  if (
    typeof req.query.q ===
      "string" &&
    req.query.q.trim()
  ) {
    conditions.push({
      $text: {
        $search:
          req.query.q.trim(),
      },
    });
  }

  return null;
}

/* =========================================================
   CREATE
========================================================= */

export const createService =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      if (
        !req.auth ||
        !(await canManageOrganization(
          req.auth.userId,

          req.auth.platformRole,

          String(
            req.body
              .organizationId ||
              ""
          )
        ))
      ) {
        res
          .status(403)
          .json({
            message:
              "You cannot create services for this organization",
          });

        return;
      }

      /* -------------------------
         Need IDs
      ------------------------- */

      let needIds:
        string[] = [];

      if (
        req.body.needIds !==
        undefined
      ) {
        const result =
          normalizeIdArray(
            req.body.needIds,

            "needIds"
          );

        if (
          result.error
        ) {
          res
            .status(400)
            .json({
              message:
                result.error,
            });

          return;
        }

        needIds =
          result.values;
      }

      /* -------------------------
         Locations
      ------------------------- */

      let locationIds:
        string[] = [];

      if (
        req.body.locationIds !==
        undefined
      ) {
        const result =
          normalizeIdArray(
            req.body
              .locationIds,

            "locationIds"
          );

        if (
          result.error
        ) {
          res
            .status(400)
            .json({
              message:
                result.error,
            });

          return;
        }

        locationIds =
          result.values;
      }

      /* -------------------------
         Multilingual content
      ------------------------- */

      const normalizedContent =
        normalizeServiceContent(
          req.body
        );

      if (
        normalizedContent.error
      ) {
        res
          .status(400)
          .json({
            message:
              normalizedContent.error,
          });

        return;
      }

      const data = {
        ...req.body,

        locationIds,

        needIds,

        translations:
          normalizedContent
            .translations,

        title:
          normalizedContent
            .title,

        description:
          normalizedContent
            .description,

        eligibility:
          normalizedContent
            .eligibility,

        status:
          "draft",

        verificationStatus:
          "pending",

        verified:
          false,
      };

      const relationError =
        await validateServiceRelations(
          data
        );

      if (
        relationError
      ) {
        res
          .status(400)
          .json({
            message:
              relationError,
          });

        return;
      }

      const service =
        await Service.create(
          data
        );

      const populated =
        await populateService(
          Service.findById(
            service._id
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
            "Failed to create service",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   PUBLIC LIST
========================================================= */

export const getServices =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const conditions: Record<
        string,
        unknown
      >[] = [
        {
          status:
            "active",
        },

        {
          verificationStatus:
            "verified",
        },
      ];

      const requestedOrganizationId =
        req.query
          .organizationId;

      if (
        requestedOrganizationId
      ) {
        const organizationId =
          idString(
            requestedOrganizationId
          );

        if (
          !organizationId
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid organizationId",
            });

          return;
        }

        const publicOrganization =
          await Organization.exists(
            {
              _id:
                organizationId,

              status:
                "active",

              verificationStatus:
                "verified",
            }
          );

        if (
          !publicOrganization
        ) {
          res
            .status(200)
            .json([]);

          return;
        }

        conditions.push({
          organizationId,
        });
      } else {
        conditions.push({
          organizationId: {
            $in:
              await publicOrganizationIds(),
          },
        });
      }

      const relationError =
        addRelationFilters(
          req,
          conditions
        );

      if (
        relationError
      ) {
        res
          .status(400)
          .json({
            message:
              relationError,
          });

        return;
      }

      const services =
        await populateService(
          Service.find({
            $and:
              conditions,
          }).sort({
            createdAt:
              -1,
          })
        );

      res
        .status(200)
        .json(
          services
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch services",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   MANAGED LIST
========================================================= */

export const getMyServices =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      if (!req.auth) {
        res
          .status(401)
          .json({
            message:
              "Authentication is required",
          });

        return;
      }

      const allowedOrganizationIds =
        await managedOrganizationIds(
          req
        );

      const conditions: Record<
        string,
        unknown
      >[] = [];

      const requestedOrganizationId =
        req.query
          .organizationId;

      if (
        requestedOrganizationId
      ) {
        const organizationId =
          idString(
            requestedOrganizationId
          );

        if (
          !organizationId
        ) {
          res
            .status(400)
            .json({
              message:
                "Invalid organizationId",
            });

          return;
        }

        const canAccess =
          allowedOrganizationIds.some(
            (id) =>
              String(id) ===
              organizationId
          );

        if (
          !canAccess
        ) {
          res
            .status(403)
            .json({
              message:
                "You cannot access services for this organization",
            });

          return;
        }

        conditions.push({
          organizationId,
        });
      } else {
        conditions.push({
          organizationId: {
            $in:
              allowedOrganizationIds,
          },
        });
      }

      const requestedStatus =
        req.query.status;

      if (
        typeof requestedStatus ===
          "string" &&
        [
          "draft",
          "active",
          "inactive",
          "archived",
        ].includes(
          requestedStatus
        )
      ) {
        conditions.push({
          status:
            requestedStatus,
        });
      } else {
        conditions.push({
          status: {
            $ne:
              "archived",
          },
        });
      }

      const relationError =
        addRelationFilters(
          req,
          conditions
        );

      if (
        relationError
      ) {
        res
          .status(400)
          .json({
            message:
              relationError,
          });

        return;
      }

      const services =
        await populateService(
          Service.find({
            $and:
              conditions,
          }).sort({
            createdAt:
              -1,
          })
        );

      res
        .status(200)
        .json(
          services
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch managed services",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   MANAGED SINGLE
========================================================= */

export const getMyServiceById =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const serviceId =
        idString(
          req.params.id
        );

      if (!serviceId) {
        res
          .status(400)
          .json({
            message:
              "Invalid service id",
          });

        return;
      }

      const service =
        await Service.findOne(
          {
            _id:
              serviceId,

            status: {
              $ne:
                "archived",
            },
          }
        ).select(
          "organizationId"
        );

      if (!service) {
        res
          .status(404)
          .json({
            message:
              "Service not found",
          });

        return;
      }

      if (
        !req.auth ||
        !(await canManageOrganization(
          req.auth.userId,

          req.auth.platformRole,

          String(
            service.organizationId
          )
        ))
      ) {
        res
          .status(403)
          .json({
            message:
              "You cannot access this service",
          });

        return;
      }

      const populated =
        await populateService(
          Service.findById(
            serviceId
          )
        );

      res
        .status(200)
        .json(
          populated
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch managed service",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   PUBLIC SINGLE
========================================================= */

export const getServiceById =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const serviceId =
        idString(
          req.params.id
        );

      if (!serviceId) {
        res
          .status(400)
          .json({
            message:
              "Invalid service id",
          });

        return;
      }

      const service =
        await Service.findOne(
          {
            _id:
              serviceId,

            status:
              "active",

            verificationStatus:
              "verified",
          }
        );

      if (!service) {
        res
          .status(404)
          .json({
            message:
              "Service not found",
          });

        return;
      }

      const publicOrganization =
        await Organization.exists(
          {
            _id:
              service.organizationId,

            status:
              "active",

            verificationStatus:
              "verified",
          }
        );

      if (
        !publicOrganization
      ) {
        res
          .status(404)
          .json({
            message:
              "Service not found",
          });

        return;
      }

      const populated =
        await populateService(
          Service.findById(
            service._id
          )
        );

      res
        .status(200)
        .json(
          populated
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch service",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   UPDATE
========================================================= */

export const updateService =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const serviceId =
        idString(
          req.params.id
        );

      if (!serviceId) {
        res
          .status(400)
          .json({
            message:
              "Invalid service id",
          });

        return;
      }

      const current =
        await Service.findById(
          serviceId
        ).lean();

      if (!current) {
        res
          .status(404)
          .json({
            message:
              "Service not found",
          });

        return;
      }

      if (
        !req.auth ||
        !(await canManageOrganization(
          req.auth.userId,

          req.auth.platformRole,

          String(
            current.organizationId
          )
        ))
      ) {
        res
          .status(403)
          .json({
            message:
              "You cannot update this service",
          });

        return;
      }

      const updates = {
        ...req.body,
      };

      /*
       * Organization cannot be
       * moved through this endpoint.
       */
      delete updates
        .organizationId;

      /* -------------------------
         Need IDs
      ------------------------- */

      if (
        updates.needIds !==
        undefined
      ) {
        const result =
          normalizeIdArray(
            updates.needIds,

            "needIds"
          );

        if (
          result.error
        ) {
          res
            .status(400)
            .json({
              message:
                result.error,
            });

          return;
        }

        updates.needIds =
          result.values;
      }

      /* -------------------------
         Location IDs
      ------------------------- */

      if (
        updates.locationIds !==
        undefined
      ) {
        const result =
          normalizeIdArray(
            updates.locationIds,

            "locationIds"
          );

        if (
          result.error
        ) {
          res
            .status(400)
            .json({
              message:
                result.error,
            });

          return;
        }

        updates.locationIds =
          result.values;
      }

      /* -------------------------
         Multilingual content
      ------------------------- */

      const contentCandidate =
        buildUpdateContentCandidate(
          current,

          updates
        );

      const normalizedContent =
        normalizeServiceContent(
          contentCandidate
        );

      if (
        normalizedContent.error
      ) {
        res
          .status(400)
          .json({
            message:
              normalizedContent.error,
          });

        return;
      }

      updates.translations =
        normalizedContent
          .translations;

      updates.title =
        normalizedContent
          .title;

      updates.description =
        normalizedContent
          .description;

      updates.eligibility =
        normalizedContent
          .eligibility;

      /* -------------------------
         Moderation
      ------------------------- */

      if (
        !isPlatformAdmin(
          req.auth
            .platformRole
        )
      ) {
        updates.status =
          "draft";

        updates.verificationStatus =
          "pending";

        updates.verified =
          false;
      } else if (
        updates.verificationStatus ===
        "verified"
      ) {
        updates.verified =
          true;
      } else if (
        updates.verificationStatus
      ) {
        updates.verified =
          false;
      }

      const candidate = {
        ...current,
        ...updates,
      };

      const relationError =
        await validateServiceRelations(
          candidate
        );

      if (
        relationError
      ) {
        res
          .status(400)
          .json({
            message:
              relationError,
          });

        return;
      }

      const service =
        await populateService(
          Service.findByIdAndUpdate(
            serviceId,

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
          service
        );
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to update service",

          error:
            error.message,
        });
    }
  };

/* =========================================================
   ARCHIVE
========================================================= */

export const deleteService =
  async (
    req: Request,

    res: Response
  ): Promise<void> => {
    try {
      const serviceId =
        idString(
          req.params.id
        );

      if (!serviceId) {
        res
          .status(400)
          .json({
            message:
              "Invalid service id",
          });

        return;
      }

      const current =
        await Service.findById(
          serviceId
        );

      if (!current) {
        res
          .status(404)
          .json({
            message:
              "Service not found",
          });

        return;
      }

      if (
        !req.auth ||
        !(await canManageOrganization(
          req.auth.userId,

          req.auth.platformRole,

          String(
            current.organizationId
          )
        ))
      ) {
        res
          .status(403)
          .json({
            message:
              "You cannot archive this service",
          });

        return;
      }

      const service =
        await Service.findByIdAndUpdate(
          serviceId,

          {
            status:
              "archived",
          },

          {
            new:
              true,

            runValidators:
              true,
          }
        );

      res
        .status(200)
        .json(
          service
        );
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to archive service",

          error:
            error.message,
        });
    }
  };