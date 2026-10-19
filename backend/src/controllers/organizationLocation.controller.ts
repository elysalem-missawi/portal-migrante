import { Request, Response } from "express";
import mongoose from "mongoose";
import Municipality from "../models/municipality.model";
import Organization from "../models/organization.model";
import OrganizationLocation from "../models/organizationLocation.model";
import OrganizationMember from "../models/organizationMember.model";
import {
  canManageOrganization,
  isPlatformAdmin,
} from "../services/authorization.service";

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const publicOrganizationFilter = {
  status: "active",
  verificationStatus: "verified",
} as const;

async function authorized(
  req: Request,
  organizationId: unknown
): Promise<boolean> {
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

async function validateLocationRelations(
  organizationId: unknown,
  municipalityId: unknown
): Promise<string | null> {
  if (!isObjectId(organizationId)) {
    return "A valid organizationId is required";
  }
  if (!isObjectId(municipalityId)) {
    return "A valid municipalityId is required";
  }

  const [organization, municipality] = await Promise.all([
    Organization.findById(organizationId).select("_id status"),
    Municipality.findById(municipalityId).select("_id status"),
  ]);

  if (!organization || organization.status === "archived") {
    return "Organization not found or archived";
  }
  if (!municipality || municipality.status !== "active") {
    return "Municipality not found or inactive";
  }

  return null;
}

const populateLocation = (query: any) =>
  query
    .populate(
      "organizationId",
      "name slug type status verificationStatus"
    )
    .populate(
      "municipalityId",
      "name slug territory officialCode"
    );

async function makeOnlyHeadOffice(
  organizationId: unknown,
  locationId: unknown
) {
  await OrganizationLocation.updateMany(
    {
      organizationId,
      _id: { $ne: locationId },
      status: { $ne: "archived" },
      isHeadOffice: true,
    },
    { $set: { isHeadOffice: false } }
  );
}

export const getOrganizationLocations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filter: Record<string, unknown> = { status: "active" };
    const { organizationId, municipalityId } = req.query;

    if (municipalityId) {
      if (!isObjectId(municipalityId)) {
        res.status(400).json({ message: "Invalid municipalityId" });
        return;
      }
      filter.municipalityId = municipalityId;
    }

    if (organizationId) {
      if (!isObjectId(organizationId)) {
        res.status(400).json({ message: "Invalid organizationId" });
        return;
      }

      const publicOrganization = await Organization.exists({
        _id: organizationId,
        ...publicOrganizationFilter,
      });

      if (!publicOrganization) {
        res.status(200).json([]);
        return;
      }

      filter.organizationId = organizationId;
    } else {
      const publicOrganizationIds = await Organization.find(
        publicOrganizationFilter
      ).distinct("_id");
      filter.organizationId = { $in: publicOrganizationIds };
    }

    const locations = await populateLocation(
      OrganizationLocation.find(filter).sort({
        isHeadOffice: -1,
        name: 1,
      })
    );

    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch organization locations",
      error: error.message,
    });
  }
};

export const getMyOrganizationLocations = async (
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
    const { organizationId, municipalityId, status } = req.query;

    let managedOrganizationIds: unknown[];

    if (isPlatformAdmin(req.auth.platformRole)) {
      managedOrganizationIds = await Organization.find({
        status: { $ne: "archived" },
      }).distinct("_id");
    } else {
      managedOrganizationIds = await OrganizationMember.find({
        userId: req.auth.userId,
        status: "active",
      }).distinct("organizationId");
    }

    if (organizationId) {
      if (!isObjectId(organizationId)) {
        res.status(400).json({ message: "Invalid organizationId" });
        return;
      }

      const canAccess = managedOrganizationIds.some(
        (id) => String(id) === organizationId
      );
      if (!canAccess) {
        res.status(403).json({
          message: "You cannot access locations for this organization",
        });
        return;
      }
      filter.organizationId = organizationId;
    } else {
      filter.organizationId = { $in: managedOrganizationIds };
    }

    if (municipalityId) {
      if (!isObjectId(municipalityId)) {
        res.status(400).json({ message: "Invalid municipalityId" });
        return;
      }
      filter.municipalityId = municipalityId;
    }

    if (
      typeof status === "string" &&
      ["active", "inactive"].includes(status)
    ) {
      filter.status = status;
    }

    const locations = await populateLocation(
      OrganizationLocation.find(filter).sort({
        isHeadOffice: -1,
        name: 1,
      })
    );

    res.status(200).json(locations);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch managed organization locations",
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

    const location = await OrganizationLocation.findOne({
      _id: req.params.id,
      status: "active",
    });

    if (!location) {
      res.status(404).json({
        message: "Organization location not found",
      });
      return;
    }

    const publicOrganization = await Organization.exists({
      _id: location.organizationId,
      ...publicOrganizationFilter,
    });

    if (!publicOrganization) {
      res.status(404).json({
        message: "Organization location not found",
      });
      return;
    }

    const populated = await populateLocation(
      OrganizationLocation.findById(location._id)
    );
    res.status(200).json(populated);
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
    if (!(await authorized(req, req.body.organizationId))) {
      res.status(403).json({
        message: "You cannot add locations to this organization",
      });
      return;
    }

    const relationError = await validateLocationRelations(
      req.body.organizationId,
      req.body.municipalityId
    );
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    const existingLocations = await OrganizationLocation.countDocuments({
      organizationId: req.body.organizationId,
      status: { $ne: "archived" },
    });
    const isHeadOffice =
      existingLocations === 0 || Boolean(req.body.isHeadOffice);

    const location = await OrganizationLocation.create({
      ...req.body,
      isHeadOffice,
      status:
        isHeadOffice || req.body.status !== "inactive"
          ? "active"
          : "inactive",
    });

    if (location.isHeadOffice) {
      await makeOnlyHeadOffice(location.organizationId, location._id);
    }

    res.status(201).json(
      await populateLocation(
        OrganizationLocation.findById(location._id)
      )
    );
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
    const current = await OrganizationLocation.findById(req.params.id);
    if (!current) {
      res.status(404).json({
        message: "Organization location not found",
      });
      return;
    }

    if (!(await authorized(req, current.organizationId))) {
      res.status(403).json({
        message: "You cannot update this location",
      });
      return;
    }

    const data = { ...req.body };
    delete data.organizationId;
    if (data.status === "archived") delete data.status;

    if (current.isHeadOffice && data.status === "inactive") {
      res.status(400).json({
        message: "The head office must remain active",
      });
      return;
    }
    if (data.isHeadOffice === true) {
      data.status = "active";
    }

    const municipalityId =
      data.municipalityId || String(current.municipalityId);
    const relationError = await validateLocationRelations(
      String(current.organizationId),
      String(municipalityId)
    );
    if (relationError) {
      res.status(400).json({ message: relationError });
      return;
    }

    if (current.isHeadOffice && data.isHeadOffice === false) {
      const anotherHeadOffice = await OrganizationLocation.exists({
        organizationId: current.organizationId,
        _id: { $ne: current._id },
        status: { $ne: "archived" },
        isHeadOffice: true,
      });

      if (!anotherHeadOffice) {
        res.status(400).json({
          message: "An organization must keep a head office",
        });
        return;
      }
    }

    const location = await OrganizationLocation.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (location?.isHeadOffice) {
      await makeOnlyHeadOffice(
        location.organizationId,
        location._id
      );
    }

    res.status(200).json(
      location
        ? await populateLocation(
            OrganizationLocation.findById(location._id)
          )
        : location
    );
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
    const location = await OrganizationLocation.findById(req.params.id);
    if (!location) {
      res.status(404).json({
        message: "Organization location not found",
      });
      return;
    }

    if (!(await authorized(req, location.organizationId))) {
      res.status(403).json({
        message: "You cannot archive this location",
      });
      return;
    }

    const wasHeadOffice = location.isHeadOffice;
    location.status = "archived";
    location.isHeadOffice = false;
    await location.save();

    if (wasHeadOffice) {
      const replacement = await OrganizationLocation.findOne({
        organizationId: location.organizationId,
        _id: { $ne: location._id },
        status: "active",
      }).sort({ createdAt: 1 });

      if (replacement) {
        replacement.isHeadOffice = true;
        await replacement.save();
        await makeOnlyHeadOffice(
          replacement.organizationId,
          replacement._id
        );
      }
    }

    res.status(200).json(location);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to archive organization location",
      error: error.message,
    });
  }
};
