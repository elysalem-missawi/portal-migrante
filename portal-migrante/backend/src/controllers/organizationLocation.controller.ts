import { Request, Response } from "express";
import mongoose from "mongoose";
import OrganizationLocation from "../models/organizationLocation.model";
import { canManageOrganization } from "../services/authorization.service";

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

async function authorized(req: Request, organizationId: unknown): Promise<boolean> {
  return Boolean(
    req.auth &&
      isObjectId(String(organizationId)) &&
      (await canManageOrganization(
        req.auth.userId,
        req.auth.platformRole,
        String(organizationId)
      ))
  );
}

export const getOrganizationLocations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    const { organizationId, municipalityId, status } = req.query;
    if (organizationId) {
      if (!isObjectId(organizationId)) {
        res.status(400).json({ message: "Invalid organizationId" });
        return;
      }
      filter.organizationId = organizationId;
    }
    if (municipalityId) {
      if (!isObjectId(municipalityId)) {
        res.status(400).json({ message: "Invalid municipalityId" });
        return;
      }
      filter.municipalityId = municipalityId;
    }
    filter.status =
      typeof status === "string" && ["active", "inactive"].includes(status)
        ? status
        : "active";

    const locations = await OrganizationLocation.find(filter)
      .populate("organizationId", "name slug type status verificationStatus")
      .populate("municipalityId", "name slug territory officialCode")
      .sort({ isHeadOffice: -1, name: 1 });
    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch organization locations", error: error.message });
  }
};

export const getOrganizationLocationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid location id" });
      return;
    }
    const location = await OrganizationLocation.findOne({
      _id: req.params.id,
      status: { $ne: "archived" },
    })
      .populate("organizationId", "name slug type status verificationStatus")
      .populate("municipalityId", "name slug territory officialCode");
    if (!location) {
      res.status(404).json({ message: "Organization location not found" });
      return;
    }
    res.status(200).json(location);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch organization location", error: error.message });
  }
};

export const createOrganizationLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!(await authorized(req, req.body.organizationId))) {
      res.status(403).json({ message: "You cannot add locations to this organization" });
      return;
    }
    const location = await OrganizationLocation.create(req.body);
    res.status(201).json(location);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create organization location", error: error.message });
  }
};

export const updateOrganizationLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const current = await OrganizationLocation.findById(req.params.id);
    if (!current) {
      res.status(404).json({ message: "Organization location not found" });
      return;
    }
    if (!(await authorized(req, current.organizationId))) {
      res.status(403).json({ message: "You cannot update this location" });
      return;
    }

    const data = { ...req.body };
    delete data.organizationId;
    const location = await OrganizationLocation.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    res.status(200).json(location);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update organization location", error: error.message });
  }
};

export const archiveOrganizationLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const location = await OrganizationLocation.findById(req.params.id);
    if (!location) {
      res.status(404).json({ message: "Organization location not found" });
      return;
    }
    if (!(await authorized(req, location.organizationId))) {
      res.status(403).json({ message: "You cannot archive this location" });
      return;
    }
    location.status = "archived";
    await location.save();
    res.status(200).json(location);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to archive organization location", error: error.message });
  }
};
