import { Request, Response } from "express";
import mongoose from "mongoose";
import Publication from "../models/publication.model";
import Report from "../models/report.model";
import User from "../models/user.model";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const reportStatuses = [
  "open",
  "under_review",
  "resolved",
  "dismissed",
] as const;
type ReportStatus = (typeof reportStatuses)[number];

const isReportStatus = (value: unknown): value is ReportStatus =>
  typeof value === "string" &&
  (reportStatuses as readonly string[]).includes(value);

export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!validId(req.body.publicationId) || !req.auth?.userId) {
      res.status(400).json({ message: "A valid publicationId and authenticated user are required" });
      return;
    }
    const now = new Date();
    if (
      !(await Publication.exists({
        _id: req.body.publicationId,
        status: "published",
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: now } },
        ],
      }))
    ) {
      res.status(404).json({ message: "Publication not found" });
      return;
    }
    const existing = await Report.exists({
      publicationId: req.body.publicationId,
      reporterUserId: req.auth.userId,
      status: { $in: ["open", "under_review"] },
    });
    if (existing) {
      res.status(409).json({ message: "An active report already exists for this user" });
      return;
    }
    const report = await Report.create({
      publicationId: req.body.publicationId,
      reporterUserId: req.auth.userId,
      reason: req.body.reason,
      details: req.body.details,
      status: "open",
      assignedToUserId: null,
      resolutionNote: undefined,
      resolvedAt: undefined,
    });
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

    const body = req.body as Record<string, unknown>;
    const updates: {
      status?: ReportStatus;
      assignedToUserId?: string | null;
      resolutionNote?: string;
      resolvedAt?: Date;
    } = {};

    if ("status" in body) {
      if (!isReportStatus(body.status)) {
        res.status(400).json({ message: "Invalid report status" });
        return;
      }
      updates.status = body.status;
    }

    if ("assignedToUserId" in body) {
      if (
        body.assignedToUserId !== null &&
        !validId(body.assignedToUserId)
      ) {
        res.status(400).json({ message: "Invalid assignedToUserId" });
        return;
      }
      updates.assignedToUserId = body.assignedToUserId;
    }

    if ("resolutionNote" in body) {
      if (
        typeof body.resolutionNote !== "string" ||
        body.resolutionNote.length > 2000
      ) {
        res.status(400).json({
          message: "resolutionNote must be a string of at most 2000 characters",
        });
        return;
      }
      updates.resolutionNote = body.resolutionNote.trim();
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        message: "No supported report fields were provided",
      });
      return;
    }

    if (
      typeof updates.assignedToUserId === "string" &&
      !(await User.exists({
        _id: updates.assignedToUserId,
        status: "active",
        platformRole: {
          $in: ["moderator", "admin"],
        },
      }))
    ) {
      res.status(400).json({
        message: "The assignee must be active platform staff",
      });
      return;
    }

    const update: {
      $set: typeof updates;
      $unset?: { resolvedAt: 1 };
    } = { $set: updates };
    if (
      updates.status === "resolved" ||
      updates.status === "dismissed"
    ) {
      updates.resolvedAt = new Date();
    } else if (updates.status) {
      update.$unset = { resolvedAt: 1 };
    }

    const report = await Report.findByIdAndUpdate(req.params.id, update, {
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
