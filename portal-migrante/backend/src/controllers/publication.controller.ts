import { Request, Response } from "express";
import mongoose from "mongoose";
import Municipality from "../models/municipality.model";
import Organization from "../models/organization.model";
import Publication from "../models/publication.model";
import PublicationAttachment from "../models/publicationAttachment.model";
import PublicationCategory from "../models/publicationCategory.model";
import User from "../models/user.model";
import {
  canManageOrganization,
  isPlatformStaff,
} from "../services/authorization.service";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const populatePublication = (query: any) =>
  query
    .populate("authorUserId", "fullName displayName profileImage status")
    .populate("organizationId", "name slug logo status verificationStatus")
    .populate("municipalityId", "name slug territory")
    .populate("categoryId", "code name allowedTypes status")
    .populate("reviewedByUserId", "fullName displayName");

async function canManagePublication(req: Request, publication: any): Promise<boolean> {
  if (!req.auth) return false;
  if (isPlatformStaff(req.auth.platformRole)) return true;
  if (String(publication.authorUserId || "") === req.auth.userId) return true;
  if (publication.organizationId) {
    return canManageOrganization(
      req.auth.userId,
      req.auth.platformRole,
      String(publication.organizationId)
    );
  }
  return false;
}

async function validatePublication(data: any): Promise<string | null> {
  if (!validId(data.authorUserId) && !validId(data.organizationId)) {
    return "An authorUserId or organizationId is required";
  }
  if (!validId(data.municipalityId) || !validId(data.categoryId)) {
    return "A valid municipalityId and categoryId are required";
  }
  if (data.expiresAt && new Date(data.expiresAt).getTime() <= Date.now()) {
    return "expiresAt must be in the future";
  }

  const [user, organization, municipality, category] = await Promise.all([
    validId(data.authorUserId) ? User.findById(data.authorUserId).select("_id status") : null,
    validId(data.organizationId)
      ? Organization.findById(data.organizationId).select("_id status")
      : null,
    Municipality.findById(data.municipalityId).select("_id status"),
    PublicationCategory.findById(data.categoryId).select("_id status allowedTypes"),
  ]);

  if (validId(data.authorUserId) && (!user || user.status === "blocked")) {
    return "Author user not found or blocked";
  }
  if (validId(data.organizationId) && (!organization || organization.status === "archived")) {
    return "Organization not found or archived";
  }
  if (!municipality || municipality.status !== "active") {
    return "Municipality not found or inactive";
  }
  if (!category || category.status !== "active") {
    return "Publication category not found or inactive";
  }
  if (!category.allowedTypes.includes(data.type)) {
    return "Publication type is not allowed by the selected category";
  }
  return null;
}

export const createPublication = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = {
      ...req.body,
      authorUserId: req.auth?.userId,
      status: "pending_review",
      verificationStatus: "pending",
      publishedAt: undefined,
      reviewedByUserId: undefined,
      reviewedAt: undefined,
    };

    if (
      data.organizationId &&
      !(await canManageOrganization(
        req.auth!.userId,
        req.auth!.platformRole,
        String(data.organizationId)
      ))
    ) {
      res.status(403).json({ message: "You cannot publish for this organization" });
      return;
    }

    const errorMessage = await validatePublication(data);
    if (errorMessage) {
      res.status(400).json({ message: errorMessage });
      return;
    }

    const created = await Publication.create(data);
    res.status(201).json(await populatePublication(Publication.findById(created._id)));
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create publication", error: error.message });
  }
};

export const getPublications = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    await Publication.updateMany(
      { status: "published", expiresAt: { $ne: null, $lte: now } },
      { $set: { status: "expired" } }
    );

    const conditions: Record<string, unknown>[] = [
      { status: "published" },
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
    ];

    for (const key of ["municipalityId", "categoryId", "organizationId", "authorUserId"] as const) {
      const value = req.query[key];
      if (value) {
        if (!validId(value)) {
          res.status(400).json({ message: `Invalid ${key}` });
          return;
        }
        conditions.push({ [key]: value });
      }
    }

    if (typeof req.query.type === "string") conditions.push({ type: req.query.type });
    if (typeof req.query.urgency === "string") conditions.push({ urgency: req.query.urgency });
    if (typeof req.query.q === "string" && req.query.q.trim()) {
      conditions.push({ $text: { $search: req.query.q.trim() } });
    }

    const publications = await populatePublication(
      Publication.find({ $and: conditions }).sort({ urgency: -1, publishedAt: -1 })
    );
    res.status(200).json(publications);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch publications", error: error.message });
  }
};

export const getPublicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.params.id)) {
      res.status(400).json({ message: "Invalid publication id" });
      return;
    }
    const now = new Date();
    await Publication.updateOne(
      {
        _id: req.params.id,
        status: "published",
        expiresAt: { $ne: null, $lte: now },
      },
      { $set: { status: "expired" } }
    );

    const publication = await populatePublication(
      Publication.findOne({
        _id: req.params.id,
        status: "published",
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: now } },
        ],
      })
    );
    if (!publication) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }

    const attachments = await PublicationAttachment.find({
      publicationId: publication._id,
      status: "active",
    }).select("-storageKey");

    res.status(200).json({ publication, attachments });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch publication", error: error.message });
  }
};

export const updatePublication = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.params.id)) {
      res.status(400).json({ message: "Invalid publication id" });
      return;
    }
    const current = await Publication.findById(req.params.id).lean();
    if (!current) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }
    if (!(await canManagePublication(req, current))) {
      res.status(403).json({ message: "You cannot update this publication" });
      return;
    }

    const allowed = [
      "municipalityId",
      "categoryId",
      "type",
      "title",
      "description",
      "sourceLanguage",
      "urgency",
      "contactMethod",
      "contactValue",
      "expiresAt",
    ];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key))
    );
    if (!isPlatformStaff(req.auth?.platformRole)) {
      updates.status = "pending_review";
      updates.verificationStatus = "pending";
    }

    const candidate = { ...current, ...updates };
    const errorMessage = await validatePublication(candidate);
    if (errorMessage) {
      res.status(400).json({ message: errorMessage });
      return;
    }
    const updated = await populatePublication(
      Publication.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      })
    );
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update publication", error: error.message });
  }
};

export const archivePublication = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.params.id)) {
      res.status(400).json({ message: "Invalid publication id" });
      return;
    }
    const current = await Publication.findById(req.params.id);
    if (!current) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }
    if (!(await canManagePublication(req, current))) {
      res.status(403).json({ message: "You cannot archive this publication" });
      return;
    }
    const publication = await Publication.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true, runValidators: true }
    );
    if (!publication) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }
    res.status(200).json(publication);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to archive publication", error: error.message });
  }
};
