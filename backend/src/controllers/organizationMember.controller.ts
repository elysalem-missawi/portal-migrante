import { Request, Response } from "express";
import mongoose from "mongoose";
import OrganizationMember from "../models/organizationMember.model";
import {
  canManageOrganizationMembers,
  isPlatformAdmin,
} from "../services/authorization.service";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

export const getOrganizationMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organizationId, userId, status } = req.query;
    const filter: Record<string, unknown> = {};

    if (organizationId) {
      if (!validId(organizationId)) {
        res.status(400).json({ message: "Invalid organizationId" });
        return;
      }
      if (
        !req.auth ||
        !(await canManageOrganizationMembers(
          req.auth.userId,
          req.auth.platformRole,
          organizationId
        ))
      ) {
        res.status(403).json({ message: "You cannot view this organization's members" });
        return;
      }
      filter.organizationId = organizationId;
    } else if (userId && req.auth?.userId === userId) {
      filter.userId = userId;
    } else if (req.auth && isPlatformAdmin(req.auth.platformRole)) {
      if (userId) filter.userId = userId;
    } else {
      res.status(400).json({ message: "organizationId is required" });
      return;
    }

    if (
      typeof status === "string" &&
      ["invited", "active", "suspended", "left"].includes(status)
    ) {
      filter.status = status;
    }

    const members = await OrganizationMember.find(filter)
      .populate("userId", "fullName displayName email status platformRole")
      .populate("organizationId", "name slug type status")
      .populate("invitedByUserId", "fullName displayName")
      .sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch organization members", error: error.message });
  }
};

export const createOrganizationMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (
      !req.auth ||
      !validId(req.body.organizationId) ||
      !(await canManageOrganizationMembers(
        req.auth.userId,
        req.auth.platformRole,
        req.body.organizationId
      ))
    ) {
      res.status(403).json({ message: "You cannot add members to this organization" });
      return;
    }

    const status = req.body.status === "active" ? "active" : "invited";
    const member = await OrganizationMember.create({
      userId: req.body.userId,
      organizationId: req.body.organizationId,
      role: req.body.role || "member",
      permissions: Array.isArray(req.body.permissions) ? req.body.permissions : [],
      status,
      joinedAt: status === "active" ? new Date() : undefined,
      invitedByUserId: req.auth.userId,
    });
    res.status(201).json(member);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create organization member", error: error.message });
  }
};

export const updateOrganizationMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const current = await OrganizationMember.findById(req.params.id);
    if (!current) {
      res.status(404).json({ message: "Organization membership not found" });
      return;
    }
    if (
      !req.auth ||
      !(await canManageOrganizationMembers(
        req.auth.userId,
        req.auth.platformRole,
        String(current.organizationId)
      ))
    ) {
      res.status(403).json({ message: "You cannot update this membership" });
      return;
    }

    const allowed = ["role", "permissions", "status"];
    const data = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );
    if (data.status === "active" && !current.joinedAt) data.joinedAt = new Date();

    const member = await OrganizationMember.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    res.status(200).json(member);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update organization member", error: error.message });
  }
};

export const endOrganizationMembership = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const member = await OrganizationMember.findById(req.params.id);
    if (!member) {
      res.status(404).json({ message: "Organization membership not found" });
      return;
    }
    if (
      !req.auth ||
      !(await canManageOrganizationMembers(
        req.auth.userId,
        req.auth.platformRole,
        String(member.organizationId)
      ))
    ) {
      res.status(403).json({ message: "You cannot end this membership" });
      return;
    }
    member.status = "left";
    await member.save();
    res.status(200).json(member);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to end organization membership", error: error.message });
  }
};
