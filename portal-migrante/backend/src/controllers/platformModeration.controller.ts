import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import ModerationAction from "../models/moderationAction.model";
import Organization from "../models/organization.model";
import OrganizationLocation from "../models/organizationLocation.model";
import Service from "../models/service.model";
import ServiceCategory from "../models/serviceCategory.model";
import { isPlatformAdmin } from "../services/authorization.service";

type ReviewTargetType = "organization" | "service";
type ReviewDecision = "approve" | "reject";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const isTargetType = (value: unknown): value is ReviewTargetType =>
  value === "organization" || value === "service";

const isDecision = (value: unknown): value is ReviewDecision =>
  value === "approve" || value === "reject";

const populateServiceForReview = (query: any) =>
  query
    .populate(
      "organizationId",
      "name slug type status verificationStatus"
    )
    .populate("categoryId", "code name status")
    .populate({
      path: "locationIds",
      select:
        "name slug municipalityId addressLine1 postalCode phone email isHeadOffice status",
      populate: {
        path: "municipalityId",
        select: "name slug territory",
      },
    });

async function organizationsForReview() {
  const organizations = await Organization.find({
    verificationStatus: "pending",
    status: { $ne: "archived" },
  })
    .populate("createdByUserId", "fullName displayName email")
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();

  if (organizations.length === 0) return [];

  const organizationIds = organizations.map(
    (organization) => organization._id
  );
  const locations = await OrganizationLocation.find({
    organizationId: { $in: organizationIds },
    status: { $ne: "archived" },
  })
    .populate("municipalityId", "name slug territory")
    .sort({ isHeadOffice: -1, name: 1 })
    .lean();

  const locationsByOrganization = new Map<string, typeof locations>();
  locations.forEach((location) => {
    const organizationId = String(location.organizationId);
    const current = locationsByOrganization.get(organizationId) || [];
    current.push(location);
    locationsByOrganization.set(organizationId, current);
  });

  return organizations.map((organization) => ({
    ...organization,
    locations:
      locationsByOrganization.get(String(organization._id)) || [],
  }));
}

async function servicesForReview() {
  return populateServiceForReview(
    Service.find({
      verificationStatus: "pending",
      status: "draft",
    })
      .sort({ createdAt: 1 })
      .limit(100)
  );
}

export const getReviewQueue = async (
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

    const requestedType = req.query.targetType;
    if (
      requestedType &&
      requestedType !== "all" &&
      !isTargetType(requestedType)
    ) {
      res.status(400).json({
        message: "Invalid moderation target type",
      });
      return;
    }

    const canReviewOrganizations = isPlatformAdmin(
      req.auth.platformRole
    );
    const includeOrganizations =
      canReviewOrganizations &&
      (requestedType === undefined ||
        requestedType === "all" ||
        requestedType === "organization");
    const includeServices =
      requestedType === undefined ||
      requestedType === "all" ||
      requestedType === "service";

    const [organizations, services] = await Promise.all([
      includeOrganizations ? organizationsForReview() : [],
      includeServices ? servicesForReview() : [],
    ]);
    const recentActions = await ModerationAction.find({
      targetType: {
        $in: canReviewOrganizations
          ? ["organization", "service"]
          : ["service"],
      },
    })
      .populate(
        "moderatorUserId",
        "fullName displayName email"
      )
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      organizations,
      services,
      recentActions,
      counts: {
        organizations: organizations.length,
        services: services.length,
      },
      permissions: {
        canReviewOrganizations,
        canReviewServices: true,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch moderation queue",
      error: error.message,
    });
  }
};

async function verifyOrganizationCanBeApproved(
  organizationId: string
): Promise<string | null> {
  const headOffice = await OrganizationLocation.exists({
    organizationId,
    isHeadOffice: true,
    status: "active",
  });

  return headOffice
    ? null
    : "An active head office is required before approving the organization";
}

async function verifyServiceCanBeApproved(
  service: any
): Promise<string | null> {
  const organization = await Organization.findById(
    service.organizationId
  ).select("status verificationStatus");
  if (
    !organization ||
    organization.status !== "active" ||
    organization.verificationStatus !== "verified"
  ) {
    return "The organization must be active and verified first";
  }

  const category = await ServiceCategory.findById(
    service.categoryId
  ).select("status");
  if (!category || category.status !== "active") {
    return "The service category must be active";
  }

  const locationIds: string[] = Array.from(
    new Set<string>(
      (service.locationIds || []).map((value: Types.ObjectId) =>
        String(value)
      )
    )
  );
  if (locationIds.length > 0) {
    const activeLocationCount =
      await OrganizationLocation.countDocuments({
        _id: {
          $in: locationIds.map(
            (locationId) => new Types.ObjectId(locationId)
          ),
        },
        organizationId: service.organizationId,
        status: "active",
      });
    if (activeLocationCount !== locationIds.length) {
      return "Every selected location must be active and belong to the organization";
    }
  }

  const requiresLocation = (service.deliveryModes || []).some(
    (mode: string) => mode === "in_person" || mode === "hybrid"
  );
  if (requiresLocation && locationIds.length === 0) {
    return "An in-person or hybrid service requires at least one active location";
  }

  return null;
}

export const reviewTarget = async (
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

    const { targetType, targetId, decision } = req.body;
    const reason =
      typeof req.body.reason === "string"
        ? req.body.reason.trim()
        : "";

    if (!isTargetType(targetType) || !validId(targetId)) {
      res.status(400).json({
        message: "A valid targetType and targetId are required",
      });
      return;
    }
    if (!isDecision(decision)) {
      res.status(400).json({
        message: "Decision must be approve or reject",
      });
      return;
    }
    if (decision === "reject" && !reason) {
      res.status(400).json({
        message: "A rejection reason is required",
      });
      return;
    }
    if (
      targetType === "organization" &&
      !isPlatformAdmin(req.auth.platformRole)
    ) {
      res.status(403).json({
        message:
          "Only platform administrators can review organizations",
      });
      return;
    }

    let target: any;
    if (targetType === "organization") {
      target = await Organization.findById(targetId);
    } else {
      target = await Service.findById(targetId);
    }

    if (!target || target.status === "archived") {
      res.status(404).json({
        message: "Moderation target not found",
      });
      return;
    }
    if (target.verificationStatus !== "pending") {
      res.status(409).json({
        message: "This item is no longer pending review",
      });
      return;
    }

    if (decision === "approve") {
      const prerequisiteError =
        targetType === "organization"
          ? await verifyOrganizationCanBeApproved(targetId)
          : await verifyServiceCanBeApproved(target);
      if (prerequisiteError) {
        res.status(409).json({ message: prerequisiteError });
        return;
      }
    }

    const previousStatus = target.status;
    const previousVerificationStatus =
      target.verificationStatus;

    if (targetType === "organization") {
      if (decision === "approve") {
        target.status = "active";
        target.verificationStatus = "verified";
        target.verified = true;
        target.verifiedAt = new Date();
        target.verifiedByUserId = req.auth.userId;
      } else {
        target.status = "inactive";
        target.verificationStatus = "rejected";
        target.verified = false;
        target.verifiedAt = undefined;
        target.verifiedByUserId = undefined;
      }
    } else if (decision === "approve") {
      target.status = "active";
      target.verificationStatus = "verified";
      target.verified = true;
    } else {
      target.status = "inactive";
      target.verificationStatus = "rejected";
      target.verified = false;
    }

    await target.save();

    const action = await ModerationAction.create({
      targetType,
      targetId: target._id,
      targetLabel: target.name || target.title,
      moderatorUserId: req.auth.userId,
      action: decision,
      reason: reason || undefined,
      previousStatus,
      newStatus: target.status,
      previousVerificationStatus,
      newVerificationStatus: target.verificationStatus,
    });

    const populatedTarget =
      targetType === "organization"
        ? await Organization.findById(target._id).populate(
            "createdByUserId",
            "fullName displayName email"
          )
        : await populateServiceForReview(
            Service.findById(target._id)
          );

    res.status(200).json({
      target: populatedTarget,
      action,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to review moderation target",
      error: error.message,
    });
  }
};
