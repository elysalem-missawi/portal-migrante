import { Request, Response } from "express";
import mongoose from "mongoose";
import OrganizationMember from "../models/organizationMember.model";

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

export const getOrganizationMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    const { organizationId, userId, status } = req.query;

    if (organizationId) {
      if (!isObjectId(organizationId)) {
        res.status(400).json({ message: "Invalid organizationId" });
        return;
      }
      filter.organizationId = organizationId;
    }

    if (userId) {
      if (!isObjectId(userId)) {
        res.status(400).json({ message: "Invalid userId" });
        return;
      }
      filter.userId = userId;
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
    res.status(500).json({
      message: "Failed to fetch organization members",
      error: error.message,
    });
  }
};

export const createOrganizationMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = { ...req.body };
    if (data.status === "active" && !data.joinedAt) {
      data.joinedAt = new Date();
    }

    const member = await OrganizationMember.create(data);
    res.status(201).json(member);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create organization member",
      error: error.message,
    });
  }
};

export const updateOrganizationMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid membership id" });
      return;
    }

    const data = { ...req.body };
    if (data.status === "active" && !data.joinedAt) {
      data.joinedAt = new Date();
    }

    const member = await OrganizationMember.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!member) {
      res.status(404).json({ message: "Organization membership not found" });
      return;
    }

    res.status(200).json(member);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update organization member",
      error: error.message,
    });
  }
};

export const endOrganizationMembership = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid membership id" });
      return;
    }

    const member = await OrganizationMember.findByIdAndUpdate(
      req.params.id,
      { status: "left" },
      { new: true, runValidators: true }
    );

    if (!member) {
      res.status(404).json({ message: "Organization membership not found" });
      return;
    }

    res.status(200).json(member);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to end organization membership",
      error: error.message,
    });
  }
};
