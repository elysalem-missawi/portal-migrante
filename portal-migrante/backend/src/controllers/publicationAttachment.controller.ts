import { Request, Response } from "express";
import mongoose from "mongoose";
import Publication from "../models/publication.model";
import PublicationAttachment from "../models/publicationAttachment.model";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

export const getPublicationAttachments = async (req: Request, res: Response): Promise<void> => {
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

export const createPublicationAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.body.publicationId) || !validId(req.body.uploadedByUserId)) {
      res.status(400).json({ message: "Valid publicationId and uploadedByUserId are required" });
      return;
    }
    if (!(await Publication.exists({ _id: req.body.publicationId, status: { $ne: "archived" } }))) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }
    const item = await PublicationAttachment.create(req.body);
    const safeItem = await PublicationAttachment.findById(item._id).select("-storageKey");
    res.status(201).json(safeItem);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create attachment", error: error.message });
  }
};

export const archivePublicationAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.params.id)) {
      res.status(400).json({ message: "Invalid attachment id" });
      return;
    }
    const item = await PublicationAttachment.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true, runValidators: true }
    ).select("-storageKey");
    if (!item) {
      res.status(404).json({ message: "Attachment not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to archive attachment", error: error.message });
  }
};
