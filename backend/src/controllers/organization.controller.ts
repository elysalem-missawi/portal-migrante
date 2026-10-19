import { Request, Response } from "express";
import mongoose from "mongoose";
import Organization from "../models/organization.model";
import OrganizationMember from "../models/organizationMember.model";
import {
  canManageOrganization,
  isPlatformAdmin,
} from "../services/authorization.service";

const publicOrganizationFilter = {
  status: "active",
  verificationStatus: "verified",
} as const;

const populateOrganization = (query: any) =>
  query.populate("createdByUserId", "fullName displayName");

export const createOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organization = await Organization.create({
      ...req.body,
      createdByUserId: req.auth?.userId,
      status: "pending",
      verificationStatus: "pending",
      verified: false,
      verifiedAt: undefined,
      verifiedByUserId: undefined,
    });

    await OrganizationMember.create({
      userId: req.auth?.userId,
      organizationId: organization._id,
      role: "organization_admin",
      status: "active",
      joinedAt: new Date(),
      invitedByUserId: null,
    });

    res.status(201).json(organization);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create organization",
      error: error.message,
    });
  }
};

export const getOrganizations = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations = await populateOrganization(
      Organization.find(publicOrganizationFilter).sort({ name: 1 })
    );
    res.status(200).json(organizations);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch organizations",
      error: error.message,
    });
  }
};

export const getMyOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.auth) {
      res.status(401).json({ message: "Authentication is required" });
      return;
    }

    const filter: Record<string, unknown> = {
      status: { $ne: "archived" },
    };

    if (!isPlatformAdmin(req.auth.platformRole)) {
      const organizationIds = await OrganizationMember.find({
        userId: req.auth.userId,
        status: "active",
      }).distinct("organizationId");

      filter._id = { $in: organizationIds };
    }

    const organizations = await populateOrganization(
      Organization.find(filter).sort({ createdAt: -1 })
    );

    res.status(200).json(organizations);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch managed organizations",
      error: error.message,
    });
  }
};

export const getMyOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.auth) {
      res.status(401).json({ message: "Authentication is required" });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Invalid organization id" });
      return;
    }

    const organization = await Organization.findOne({
      _id: req.params.id,
      status: { $ne: "archived" },
    });
    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    const allowed = await canManageOrganization(
      req.auth.userId,
      req.auth.platformRole,
      String(organization._id)
    );
    if (!allowed) {
      res.status(403).json({
        message: "You cannot access this organization",
      });
      return;
    }

    const populated = await populateOrganization(
      Organization.findById(organization._id)
    );
    res.status(200).json(populated);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch managed organization",
      error: error.message,
    });
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Invalid organization id" });
      return;
    }

    const organization = await populateOrganization(
      Organization.findOne({
        _id: req.params.id,
        ...publicOrganizationFilter,
      })
    );

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.status(200).json(organization);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch organization",
      error: error.message,
    });
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const current = await Organization.findById(req.params.id);
    if (!current) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    if (
      !req.auth ||
      !(await canManageOrganization(
        req.auth.userId,
        req.auth.platformRole,
        String(current._id)
      ))
    ) {
      res.status(403).json({
        message: "You cannot update this organization",
      });
      return;
    }

    const data = { ...req.body };
    if (!isPlatformAdmin(req.auth.platformRole)) {
      for (const field of [
        "status",
        "verificationStatus",
        "verified",
        "verifiedAt",
        "verifiedByUserId",
        "createdByUserId",
      ]) {
        delete data[field];
      }

      // Material changes by organization managers require a fresh review.
      data.status = "pending";
      data.verificationStatus = "pending";
      data.verified = false;
      data.verifiedAt = null;
      data.verifiedByUserId = null;
    } else if (data.verificationStatus === "verified") {
      data.verified = true;
      data.verifiedAt = new Date();
      data.verifiedByUserId = req.auth.userId;
    } else if (
      data.verificationStatus &&
      data.verificationStatus !== "verified"
    ) {
      data.verified = false;
      data.verifiedAt = undefined;
      data.verifiedByUserId = undefined;
    }

    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    res.status(200).json(organization);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update organization",
      error: error.message,
    });
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const current = await Organization.findById(req.params.id);
    if (!current) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    if (
      !req.auth ||
      !(await canManageOrganization(
        req.auth.userId,
        req.auth.platformRole,
        String(current._id)
      ))
    ) {
      res.status(403).json({
        message: "You cannot archive this organization",
      });
      return;
    }

    current.status = "archived";
    await current.save();
    res.status(200).json(current);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to archive organization",
      error: error.message,
    });
  }
};
