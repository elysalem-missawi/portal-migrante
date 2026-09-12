import { Request, Response } from "express";
import Organization from "../models/organization.model";
import OrganizationMember from "../models/organizationMember.model";
import {
  canManageOrganization,
  isPlatformAdmin,
} from "../services/authorization.service";

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
    res.status(400).json({ message: "Failed to create organization", error: error.message });
  }
};

export const getOrganizations = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations = await Organization.find({ status: { $ne: "archived" } })
      .populate("createdByUserId", "fullName displayName")
      .sort({ createdAt: -1 });
    res.status(200).json(organizations);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch organizations", error: error.message });
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organization = await Organization.findById(req.params.id).populate(
      "createdByUserId",
      "fullName displayName"
    );
    if (!organization || organization.status === "archived") {
      res.status(404).json({ message: "Organization not found" });
      return;
    }
    res.status(200).json(organization);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch organization", error: error.message });
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
      res.status(403).json({ message: "You cannot update this organization" });
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
    } else if (data.verificationStatus === "verified") {
      data.verified = true;
      data.verifiedAt = new Date();
      data.verifiedByUserId = req.auth.userId;
    }

    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    res.status(200).json(organization);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update organization", error: error.message });
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
      res.status(403).json({ message: "You cannot archive this organization" });
      return;
    }

    current.status = "archived";
    await current.save();
    res.status(200).json(current);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to archive organization", error: error.message });
  }
};
