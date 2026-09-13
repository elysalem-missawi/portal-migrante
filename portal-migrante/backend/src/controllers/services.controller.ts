import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Organization from "../models/organization.model";
import OrganizationLocation from "../models/organizationLocation.model";
import OrganizationMember from "../models/organizationMember.model";
import Service from "../models/service.model";
import ServiceCategory from "../models/serviceCategory.model";
import {
  canManageOrganization,
  isPlatformAdmin,
} from "../services/authorization.service";

const idString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const candidate = String(value);
  return mongoose.Types.ObjectId.isValid(candidate)
    ? candidate
    : null;
};

async function validateServiceRelations(
  data: any
): Promise<string | null> {
  const organizationId = idString(data.organizationId);
  const categoryId = idString(data.categoryId);

  if (!organizationId) {
    return "A valid organizationId is required";
  }
  if (!categoryId) {
    return "A valid categoryId is required";
  }

  const [organization, category] = await Promise.all([
    Organization.findById(organizationId).select("_id status"),
    ServiceCategory.findById(categoryId).select("_id status"),
  ]);

  if (!organization || organization.status === "archived") {
    return "Organization not found or archived";
  }
  if (!category || category.status !== "active") {
    return "Service category not found or inactive";
  }

  const rawLocationIds = Array.isArray(data.locationIds)
    ? data.locationIds
    : [];
  const locationIds = rawLocationIds.map(idString);

  if (locationIds.some((id: string | null) => !id)) {
    return "Every locationIds value must be a valid id";
  }

  if (locationIds.length > 0) {
    const uniqueIds = Array.from(
      new Set(locationIds as string[])
    );
    const matchingLocations =
      await OrganizationLocation.countDocuments({
        _id: {
          $in: uniqueIds.map(
            (id) => new Types.ObjectId(id)
          ),
        },
        organizationId,
        status: { $ne: "archived" },
      });

    if (matchingLocations !== uniqueIds.length) {
      return "Every location must belong to the selected organization";
    }
  }

  return null;
}

const populateService = (query: any) =>
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
    );

async function publicOrganizationIds() {
  return Organization.find({
    status: "active",
    verificationStatus: "verified",
  }).distinct("_id");
}

async function managedOrganizationIds(req: Request) {
  if (!req.auth) return [];

  if (isPlatformAdmin(req.auth.platformRole)) {
    return Organization.find({
      status: { $ne: "archived" },
    }).distinct("_id");
  }

  return OrganizationMember.find({
    userId: req.auth.userId,
    status: "active",
  }).distinct("organizationId");
}

function addRelationFilters(
  req: Request,
  conditions: Record<string, unknown>[]
): string | null {
  const { categoryId, locationId } = req.query;

  if (categoryId) {
    const validCategoryId = idString(categoryId);
    if (!validCategoryId) return "Invalid categoryId";
    conditions.push({ categoryId: validCategoryId });
  }

  if (locationId) {
    const validLocationId = idString(locationId);
    if (!validLocationId) return "Invalid locationId";
    conditions.push({ locationIds: validLocationId });
  }

  if (
    typeof req.query.q === "string" &&
    req.query.q.trim()
  ) {
    conditions.push({
      $text: { $search: req.query.q.trim() },
    });
  }

  return null;
}

export const createService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (
      !req.auth ||
      !(await canManageOrganization(
        req.auth.userId,
        req.auth.platformRole,
        String(req.body.organizationId || "")
      ))
    ) {
      res.status(403).json({
        message:
          "You cannot create services for this organization",
      });
      return;
    }

    const data = {
      ...req.body,
      status: "draft",
      verificationStatus: "pending",
      verified: false,
    };

    const relationError = await validateServiceRelations(data);
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    const service = await Service.create(data);
    const populated = await populateService(
      Service.findById(service._id)
    );
    res.status(201).json(populated);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};

export const getServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const conditions: Record<string, unknown>[] = [
      { status: "active" },
      { verificationStatus: "verified" },
    ];
    const requestedOrganizationId =
      req.query.organizationId;

    if (requestedOrganizationId) {
      const organizationId = idString(
        requestedOrganizationId
      );
      if (!organizationId) {
        res.status(400).json({
          message: "Invalid organizationId",
        });
        return;
      }

      const publicOrganization = await Organization.exists({
        _id: organizationId,
        status: "active",
        verificationStatus: "verified",
      });
      if (!publicOrganization) {
        res.status(200).json([]);
        return;
      }

      conditions.push({ organizationId });
    } else {
      conditions.push({
        organizationId: {
          $in: await publicOrganizationIds(),
        },
      });
    }

    const relationError = addRelationFilters(
      req,
      conditions
    );
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    const services = await populateService(
      Service.find({ $and: conditions }).sort({
        createdAt: -1,
      })
    );

    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

export const getMyServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.auth) {
      res.status(401).json({
        message: "Authentication is required",
      });
      return;
    }

    const allowedOrganizationIds =
      await managedOrganizationIds(req);
    const conditions: Record<string, unknown>[] = [];
    const requestedOrganizationId =
      req.query.organizationId;

    if (requestedOrganizationId) {
      const organizationId = idString(
        requestedOrganizationId
      );
      if (!organizationId) {
        res.status(400).json({
          message: "Invalid organizationId",
        });
        return;
      }

      const canAccess = allowedOrganizationIds.some(
        (id) => String(id) === organizationId
      );
      if (!canAccess) {
        res.status(403).json({
          message:
            "You cannot access services for this organization",
        });
        return;
      }
      conditions.push({ organizationId });
    } else {
      conditions.push({
        organizationId: {
          $in: allowedOrganizationIds,
        },
      });
    }

    const requestedStatus = req.query.status;
    if (
      typeof requestedStatus === "string" &&
      ["draft", "active", "inactive", "archived"].includes(
        requestedStatus
      )
    ) {
      conditions.push({ status: requestedStatus });
    } else {
      conditions.push({ status: { $ne: "archived" } });
    }

    const relationError = addRelationFilters(
      req,
      conditions
    );
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    const services = await populateService(
      Service.find({ $and: conditions }).sort({
        createdAt: -1,
      })
    );

    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch managed services",
      error: error.message,
    });
  }
};

export const getServiceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const serviceId = idString(req.params.id);
    if (!serviceId) {
      res.status(400).json({
        message: "Invalid service id",
      });
      return;
    }

    const service = await Service.findOne({
      _id: serviceId,
      status: "active",
      verificationStatus: "verified",
    });

    if (!service) {
      res.status(404).json({
        message: "Service not found",
      });
      return;
    }

    const publicOrganization = await Organization.exists({
      _id: service.organizationId,
      status: "active",
      verificationStatus: "verified",
    });
    if (!publicOrganization) {
      res.status(404).json({
        message: "Service not found",
      });
      return;
    }

    const populated = await populateService(
      Service.findById(service._id)
    );
    res.status(200).json(populated);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

export const updateService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const serviceId = idString(req.params.id);
    if (!serviceId) {
      res.status(400).json({
        message: "Invalid service id",
      });
      return;
    }

    const current = await Service.findById(serviceId).lean();
    if (!current) {
      res.status(404).json({
        message: "Service not found",
      });
      return;
    }

    if (
      !req.auth ||
      !(await canManageOrganization(
        req.auth.userId,
        req.auth.platformRole,
        String(current.organizationId)
      ))
    ) {
      res.status(403).json({
        message: "You cannot update this service",
      });
      return;
    }

    const updates = { ...req.body };
    delete updates.organizationId;

    if (!isPlatformAdmin(req.auth.platformRole)) {
      updates.status = "draft";
      updates.verificationStatus = "pending";
      updates.verified = false;
    } else if (
      updates.verificationStatus === "verified"
    ) {
      updates.verified = true;
    } else if (updates.verificationStatus) {
      updates.verified = false;
    }

    const candidate = { ...current, ...updates };
    const relationError =
      await validateServiceRelations(candidate);
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    const service = await populateService(
      Service.findByIdAndUpdate(serviceId, updates, {
        new: true,
        runValidators: true,
      })
    );

    res.status(200).json(service);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};

export const deleteService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const serviceId = idString(req.params.id);
    if (!serviceId) {
      res.status(400).json({
        message: "Invalid service id",
      });
      return;
    }

    const current = await Service.findById(serviceId);
    if (!current) {
      res.status(404).json({
        message: "Service not found",
      });
      return;
    }

    if (
      !req.auth ||
      !(await canManageOrganization(
        req.auth.userId,
        req.auth.platformRole,
        String(current.organizationId)
      ))
    ) {
      res.status(403).json({
        message: "You cannot archive this service",
      });
      return;
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { status: "archived" },
      { new: true, runValidators: true }
    );

    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to archive service",
      error: error.message,
    });
  }
};
