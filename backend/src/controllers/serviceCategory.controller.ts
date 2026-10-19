import { Request, Response } from "express";
import mongoose from "mongoose";
import ServiceCategory from "../models/serviceCategory.model";

const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

export const getServiceCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status =
      typeof req.query.status === "string" &&
      ["active", "inactive", "archived"].includes(req.query.status)
        ? req.query.status
        : "active";

    const categories = await ServiceCategory.find({ status })
      .populate("parentCategoryId", "code name status")
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch service categories",
      error: error.message,
    });
  }
};

export const createServiceCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await ServiceCategory.create(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create service category",
      error: error.message,
    });
  }
};

export const updateServiceCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid service category id" });
      return;
    }

    if (req.body.parentCategoryId === req.params.id) {
      res.status(400).json({ message: "A category cannot be its own parent" });
      return;
    }

    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({ message: "Service category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to update service category",
      error: error.message,
    });
  }
};

export const archiveServiceCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isObjectId(req.params.id)) {
      res.status(400).json({ message: "Invalid service category id" });
      return;
    }

    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({ message: "Service category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to archive service category",
      error: error.message,
    });
  }
};
