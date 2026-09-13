import { Request, Response } from "express";
import mongoose from "mongoose";
import ModerationAction, {
  ModerationTargetType,
} from "../models/moderationAction.model";
import Publication from "../models/publication.model";

const validId = (value: unknown): value is string =>
  typeof value === "string" && mongoose.Types.ObjectId.isValid(value);

const validTargetType = (
  value: unknown
): value is ModerationTargetType =>
  value === "publication" ||
  value === "organization" ||
  value === "service";

const transitions: Record<
  string,
  { status?: string; verificationStatus?: string }
> = {
  approve: { status: "published" },
  reject: {
    status: "rejected",
    verificationStatus: "rejected",
  },
  verify: { verificationStatus: "verified" },
  unverify: { verificationStatus: "unverified" },
  hide: { status: "hidden" },
  restore: { status: "published" },
  archive: { status: "archived" },
  expire: { status: "expired" },
};

export const createModerationAction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!validId(req.body.publicationId) || !req.auth?.userId) {
      res.status(400).json({
        message:
          "A valid publicationId and authenticated moderator are required",
      });
      return;
    }
    const change = transitions[req.body.action];
    if (!change) {
      res.status(400).json({
        message: "Invalid moderation action",
      });
      return;
    }
    const publication = await Publication.findById(
      req.body.publicationId
    );
    if (!publication) {
      res.status(404).json({
        message: "Publication not found",
      });
      return;
    }

    const previousStatus = publication.status;
    const previousVerificationStatus =
      publication.verificationStatus;
    Object.assign(publication, change, {
      reviewedByUserId: req.auth.userId,
      reviewedAt: new Date(),
    });
    if (
      req.body.action === "approve" &&
      !publication.publishedAt
    ) {
      publication.publishedAt = new Date();
    }
    await publication.save();

    const action = await ModerationAction.create({
      publicationId: publication._id,
      targetType: "publication",
      targetId: publication._id,
      moderatorUserId: req.auth.userId,
      reportId: req.body.reportId,
      action: req.body.action,
      reason: req.body.reason,
      previousStatus,
      newStatus: publication.status,
      previousVerificationStatus,
      newVerificationStatus: publication.verificationStatus,
    });
    res.status(201).json({ publication, action });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to apply moderation action",
      error: error.message,
    });
  }
};

export const getModerationActions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!validId(req.params.publicationId)) {
      res.status(400).json({
        message: "Invalid publication id",
      });
      return;
    }
    const actions = await ModerationAction.find({
      $or: [
        {
          targetType: "publication",
          targetId: req.params.publicationId,
        },
        { publicationId: req.params.publicationId },
      ],
    })
      .populate("moderatorUserId", "fullName displayName")
      .populate("reportId", "reason status")
      .sort({ createdAt: -1 });
    res.status(200).json(actions);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch moderation actions",
      error: error.message,
    });
  }
};

export const getTargetModerationActions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { targetType, targetId } = req.params;
    if (!validTargetType(targetType) || !validId(targetId)) {
      res.status(400).json({
        message: "Invalid moderation target",
      });
      return;
    }

    const conditions: Record<string, unknown>[] = [
      { targetType, targetId },
    ];
    if (targetType === "publication") {
      conditions.push({ publicationId: targetId });
    }

    const actions = await ModerationAction.find({
      $or: conditions,
    })
      .populate(
        "moderatorUserId",
        "fullName displayName email"
      )
      .populate("reportId", "reason status")
      .sort({ createdAt: -1 });

    res.status(200).json(actions);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch moderation history",
      error: error.message,
    });
  }
};
