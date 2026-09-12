import { Request, Response } from "express";
import mongoose from "mongoose";
import OrganizationLocation from "../models/organizationLocation.model";

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

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
      typeof status === "string" && ["active", "inactive", "archived"].includes(status)
        ? status
        : "active";

    const locations = await OrganizationLocation.find(filter)
      .populate("organizationId", "name slug type status verificationStatus")
      .populate("municipalityId", "name slug territory officialCode")
      .sort({ isHeadOffice: -1, name: 1 });

    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch organization locations",
      error: error.message,
    });
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

    const location = await OrganizationLocation.findById(req.params.id)
      .populate("organizationId", "name slug type status verificationStatus")
      .populate("municipalityId", "name slug territory officialCode");

    if (!location) {
      res.status(404).json({ message: "Organization location not found" });
      return;
    }

    res.status(200).json(location);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch organization location",
      error: error.message,
    });
  }
};

export const createOrganizationLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const location = await OrganizationLocation.create(req.body);
    res.status(201).json(location);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create organization location",
      error: error.message,
    });
  }
};

export const updateOrganizationLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid location id" });
      return;
    }

    const location = await OrganizationLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      res.status(404).json({ message: "Organization location not found" });
      return;
    }

    res.status(200).json(location);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update organization location",
      error: error.message,
    });
  }
};

export const archiveOrganizationLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid location id" });
      return;
    }

    const location = await OrganizationLocation.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true, runValidators: true }
    );

    if (!location) {
      res.status(404).json({ message: "Organization location not found" });
      return;
    }

    res.status(200).json(location);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to archive organization location",
      error: error.message,
    });
  }
};
