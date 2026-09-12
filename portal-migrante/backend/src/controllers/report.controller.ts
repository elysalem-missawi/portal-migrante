import { Request, Response } from "express";
import mongoose from "mongoose";
import Publication from "../models/publication.model";
import Report from "../models/report.model";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.body.publicationId) || !validId(req.body.reporterUserId)) {
      res.status(400).json({ message: "Valid publicationId and reporterUserId are required" });
      return;
    }
    if (!(await Publication.exists({ _id: req.body.publicationId }))) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }
    const existing = await Report.exists({
      publicationId: req.body.publicationId,
      reporterUserId: req.body.reporterUserId,
      status: { $in: ["open", "under_review"] },
    });
    if (existing) {
      res.status(409).json({ message: "An active report already exists for this user" });
      return;
    }
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create report", error: error.message });
  }
};

export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.status === "string") filter.status = req.query.status;
    if (req.query.publicationId) {
      if (!validId(req.query.publicationId)) {
        res.status(400).json({ message: "Invalid publicationId" });
        return;
      }
      filter.publicationId = req.query.publicationId;
    }
    const reports = await Report.find(filter)
      .populate("publicationId", "title status verificationStatus")
      .populate("reporterUserId", "fullName displayName")
      .populate("assignedToUserId", "fullName displayName")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch reports", error: error.message });
  }
};

export const updateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.params.id)) {
      res.status(400).json({ message: "Invalid report id" });
      return;
    }
    const data = { ...req.body };
    if (["resolved", "dismissed"].includes(data.status)) data.resolvedAt = new Date();
    const report = await Report.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.status(200).json(report);
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update report", error: error.message });
  }
};
