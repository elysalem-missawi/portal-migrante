import { Request, Response } from "express";
import mongoose from "mongoose";
import Publication from "../models/publication.model";
import PublicationAttachment from "../models/publicationAttachment.model";
import {
  canManageOrganization,
  isPlatformStaff,
} from "../services/authorization.service";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

async function canManage(req: Request, publication: any): Promise<boolean> {
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

export const getPublicationAttachments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!validId(req.params.publicationId)) {
      res.status(400).json({ message: "Invalid publication id" });
      return;
    }
    const items = await PublicationAttachment.find({
      publicationId: req.params.publicationId,
      status: "active",
    }).select("-storageKey");
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch attachments", error: error.message });
  }
};

export const createPublicationAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!validId(req.body.publicationId) || !req.auth?.userId) {
      res.status(400).json({ message: "A valid publicationId and authenticated user are required" });
      return;
    }
    const publication = await Publication.findOne({
      _id: req.body.publicationId,
      status: { $ne: "archived" },
    });
    if (!publication) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }
    if (!(await canManage(req, publication))) {
      res.status(403).json({ message: "You cannot add attachments to this publication" });
      return;
    }

    const item = await PublicationAttachment.create({
      ...req.body,
      uploadedByUserId: req.auth.userId,
      status: "pending",
    });
    const safeItem = await PublicationAttachment.findById(item._id).select("-storageKey");
    res.status(201).json(safeItem);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create attachment", error: error.message });
  }
};

export const archivePublicationAttachment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!validId(req.params.id)) {
      res.status(400).json({ message: "Invalid attachment id" });
      return;
    }
    const attachment = await PublicationAttachment.findById(req.params.id);
    if (!attachment) {
      res.status(404).json({ message: "Attachment not found" });
      return;
    }
    const publication = await Publication.findById(attachment.publicationId);
    if (!publication || !(await canManage(req, publication))) {
      res.status(403).json({ message: "You cannot archive this attachment" });
      return;
    }

    attachment.status = "archived";
    await attachment.save();
    const safeItem = await PublicationAttachment.findById(attachment._id).select("-storageKey");
    res.status(200).json(safeItem);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to archive attachment", error: error.message });
  }
};
