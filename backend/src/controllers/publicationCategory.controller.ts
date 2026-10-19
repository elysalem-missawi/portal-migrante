import { Request, Response } from "express";
import mongoose from "mongoose";
import PublicationCategory from "../models/publicationCategory.model";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

export const getPublicationCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await PublicationCategory.find({ status: "active" })
      .populate("parentCategoryId", "code name")
      .sort({ sortOrder: 1, name: 1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch publication categories", error: error.message });
  }
};

export const createPublicationCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await PublicationCategory.create(req.body);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create publication category", error: error.message });
  }
};

export const updatePublicationCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.params.id) || req.body.parentCategoryId === req.params.id) {
      res.status(400).json({ message: "Invalid category or parent category" });
      return;
    }
    const item = await PublicationCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ message: "Publication category not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update publication category", error: error.message });
  }
};

export const archivePublicationCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.params.id)) {
      res.status(400).json({ message: "Invalid category id" });
      return;
    }
    const item = await PublicationCategory.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ message: "Publication category not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to archive publication category", error: error.message });
  }
};
