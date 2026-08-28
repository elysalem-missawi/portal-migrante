import { Request, Response } from "express";
import { ForumMessage, ForumPost, ForumPostType } from "../models/forum.model";
import User from "../models/user.model";

const trimText = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value.trim() : fallback;

const normalizePostType = (value: unknown): ForumPostType =>
  value === "announcement" ? "announcement" : "question";

async function getRegisteredForumUser(req: Request) {
  const userId = req.header("x-user-id") || req.body.userId;
  if (!userId) return null;

  const user = await User.findOne({
    _id: userId,
    status: { $in: ["active", "pending"] },
  });

  return user;
}

function getUserDisplayName(user: any): string {
  return user.displayName || user.fullName;
}

export const getForumPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const type = typeof req.query.type === "string" ? req.query.type : "";
    const authorUserId =
      typeof req.query.authorUserId === "string" ? req.query.authorUserId.trim() : "";
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    const filter: Record<string, any> = { status: "active" };

    if (type === "announcement" || type === "question") {
      filter.type = type;
    }

    if (authorUserId) {
      filter.authorUserId = authorUserId;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { body: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { authorCity: { $regex: q, $options: "i" } },
      ];
    }

    const posts = await ForumPost.find(filter).sort({ createdAt: -1 }).limit(100);
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch forum posts",
      error: error.message,
    });
  }
};

export const createForumPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getRegisteredForumUser(req);
    const title = trimText(req.body.title);
    const body = trimText(req.body.body);

    if (!user) {
      res.status(401).json({ message: "Registered user is required" });
      return;
    }

    if (!user.phoneVerified && !user.isVerified) {
      res.status(403).json({ message: "Phone verification is required" });
      return;
    }

    if (!title || !body) {
      res.status(400).json({
        message: "title and body are required",
      });
      return;
    }

    const post = await ForumPost.create({
      authorUserId: user._id,
      type: normalizePostType(req.body.type),
      title,
      body,
      authorName: getUserDisplayName(user),
      authorCity: user.municipality || trimText(req.body.authorCity) || undefined,
      category: trimText(req.body.category) || undefined,
      status: "active",
    });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create forum post",
      error: error.message,
    });
  }
};

export const addForumComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getRegisteredForumUser(req);
    const body = trimText(req.body.body);

    if (!user) {
      res.status(401).json({ message: "Registered user is required" });
      return;
    }

    if (!user.phoneVerified && !user.isVerified) {
      res.status(403).json({ message: "Phone verification is required" });
      return;
    }

    if (!body) {
      res.status(400).json({
        message: "body is required",
      });
      return;
    }

    const post = await ForumPost.findOneAndUpdate(
      { _id: req.params.id, status: "active" },
      {
        $push: {
          comments: {
            authorUserId: user._id,
            authorName: getUserDisplayName(user),
            authorCity: user.municipality || trimText(req.body.authorCity) || undefined,
            body,
            createdAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!post) {
      res.status(404).json({ message: "Forum post not found" });
      return;
    }

    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to add forum comment",
      error: error.message,
    });
  }
};

export const getForumMessages = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const messages = await ForumMessage.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(80);

    res.status(200).json(messages.reverse());
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch forum messages",
      error: error.message,
    });
  }
};

export const createForumMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getRegisteredForumUser(req);
    const body = trimText(req.body.body);

    if (!user) {
      res.status(401).json({ message: "Registered user is required" });
      return;
    }

    if (!user.phoneVerified && !user.isVerified) {
      res.status(403).json({ message: "Phone verification is required" });
      return;
    }

    if (!body) {
      res.status(400).json({
        message: "body is required",
      });
      return;
    }

    const message = await ForumMessage.create({
      authorUserId: user._id,
      authorName: getUserDisplayName(user),
      authorCity: user.municipality || trimText(req.body.authorCity) || undefined,
      body,
      status: "active",
    });

    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create forum message",
      error: error.message,
    });
  }
};
