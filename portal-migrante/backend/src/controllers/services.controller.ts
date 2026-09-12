import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Organization from "../models/organization.model";
import OrganizationLocation from "../models/organizationLocation.model";
import Service from "../models/service.model";
import ServiceCategory from "../models/serviceCategory.model";
import { canManageOrganization } from "../services/authorization.service";

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

async function validateServiceRelations(data: any): Promise<string | null> {
  if (!isObjectId(data.organizationId)) {
    return "A valid organizationId is required";
  }

  if (!isObjectId(data.categoryId)) {
    return "A valid categoryId is required";
  }

  const [organization, category] = await Promise.all([
    Organization.findById(data.organizationId).select("_id status"),
    ServiceCategory.findById(data.categoryId).select("_id status"),
  ]);

  if (!organization || organization.status === "archived") {
    return "Organization not found or archived";
  }

  if (!category || category.status !== "active") {
    return "Service category not found or inactive";
  }

  const locationIds = Array.isArray(data.locationIds) ? data.locationIds : [];
  if (locationIds.some((id: unknown) => !isObjectId(id))) {
    return "Every locationIds value must be a valid id";
  }

  if (locationIds.length > 0) {
    const uniqueIds = [...new Set(locationIds.map(String))];
    const matchingLocations = await OrganizationLocation.countDocuments({
      _id: { $in: uniqueIds.map((id) => new Types.ObjectId(id)) },
      organizationId: data.organizationId,
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
    .populate("organizationId", "name slug type status verificationStatus")
    .populate("categoryId", "code name parentCategoryId status")
    .populate(
      "locationIds",
      "name slug municipalityId addressLine1 postalCode phone email isHeadOffice status"
    );

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
      res.status(403).json({ message: "You cannot create services for this organization" });
      return;
    }

    const relationError = await validateServiceRelations(req.body);
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    const service = await Service.create(req.body);
    const populated = await populateService(Service.findById(service._id));
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
    const conditions: Record<string, unknown>[] = [];
    const { organizationId, categoryId, locationId, status, q } = req.query;

    if (organizationId) {
      if (!isObjectId(organizationId)) {
        res.status(400).json({ message: "Invalid organizationId" });
        return;
      }
      conditions.push({ organizationId });
    }

    if (categoryId) {
      if (!isObjectId(categoryId)) {
        res.status(400).json({ message: "Invalid categoryId" });
        return;
      }
      conditions.push({ categoryId });
    }

    if (locationId) {
      if (!isObjectId(locationId)) {
        res.status(400).json({ message: "Invalid locationId" });
        return;
      }
      conditions.push({ locationIds: locationId });
    }

    if (
      typeof status === "string" &&
      ["draft", "active", "inactive", "archived"].includes(status)
    ) {
      conditions.push({ status });
    } else {
      // Existing records created before the redesign have no status yet.
      conditions.push({
        $or: [{ status: "active" }, { status: { $exists: false } }],
      });
    }

    if (typeof q === "string" && q.trim()) {
      conditions.push({ $text: { $search: q.trim() } });
    }

    const filter = conditions.length > 0 ? { $and: conditions } : {};
    const services = await populateService(
      Service.find(filter).sort({ createdAt: -1 })
    );
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

export const getServiceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid service id" });
      return;
    }

    const service = await populateService(Service.findById(req.params.id));

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json(service);
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
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid service id" });
      return;
    }

    const current = await Service.findById(req.params.id).lean();
    if (!current) {
      res.status(404).json({ message: "Service not found" });
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
      res.status(403).json({ message: "You cannot update this service" });
      return;
    }

    const updates = { ...req.body };
    delete updates.organizationId;
    const candidate = { ...current, ...updates };
    const relationError = await validateServiceRelations(candidate);
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    const service = await populateService(
      Service.findByIdAndUpdate(req.params.id, updates, {
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
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid service id" });
      return;
    }

    const current = await Service.findById(req.params.id);
    if (!current) {
      res.status(404).json({ message: "Service not found" });
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
      res.status(403).json({ message: "You cannot archive this service" });
      return;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true, runValidators: true }
    );

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to archive service",
      error: error.message,
    });
  }
};
