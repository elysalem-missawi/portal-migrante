// src/controllers/user.controller.ts

import { Request, Response } from "express";
import crypto from "crypto";
import { Types } from "mongoose";

import User, {
  PreferredLanguage,
} from "../models/user.model";

import AuthSession from "../models/authSession.model";

/* =========================================================
   Constants
   ========================================================= */

const PASSWORD_PREFIX = "scrypt";

const ALLOWED_LANGUAGES: PreferredLanguage[] = [
  "es",
  "eu",
  "ar",
  "en",
];

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =========================================================
   Helpers
   ========================================================= */

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${PASSWORD_PREFIX}:${salt}:${hash}`;
}

function publicUser(user: any) {
  const obj =
    typeof user.toObject === "function"
      ? user.toObject()
      : { ...user };

  delete obj.passwordHash;

  return obj;
}

function normalizeOptionalString(
  value: unknown
): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  return normalized || undefined;
}

function normalizeEmail(
  value: unknown
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function isValidLanguage(
  value: unknown
): value is PreferredLanguage {
  return (
    typeof value === "string" &&
    ALLOWED_LANGUAGES.includes(
      value as PreferredLanguage
    )
  );
}

function isDuplicateKeyError(error: any): boolean {
  return error?.code === 11000;
}

/* =========================================================
   REGISTER USER
   POST /api/users/register
   ========================================================= */

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const displayName =
      normalizeOptionalString(req.body.displayName);

    const fullName =
      normalizeOptionalString(req.body.fullName);

    const email =
      normalizeEmail(req.body.email);

    const password =
      typeof req.body.password === "string"
        ? req.body.password
        : "";

    const phone =
      normalizeOptionalString(req.body.phone);

    const originCountry =
      normalizeOptionalString(
        req.body.originCountry
      );

    const profileImage =
      normalizeOptionalString(
        req.body.profileImage
      );

    const preferredLanguage =
      req.body.preferredLanguage ?? "es";

    const legalConsentAccepted =
      req.body.legalConsentAccepted === true;

    /* -----------------------------------------------------
       Required fields
       ----------------------------------------------------- */

    if (!displayName) {
      res.status(400).json({
        message: "Display name is required",
      });
      return;
    }

    if (
      displayName.length < 2 ||
      displayName.length > 80
    ) {
      res.status(400).json({
        message:
          "Display name must contain between 2 and 80 characters",
      });
      return;
    }

    if (!email) {
      res.status(400).json({
        message: "Email is required",
      });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({
        message: "Invalid email format",
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters",
      });
      return;
    }

    if (!legalConsentAccepted) {
      res.status(400).json({
        message: "Legal consent is required",
      });
      return;
    }

    if (
      !isValidLanguage(preferredLanguage)
    ) {
      res.status(400).json({
        message:
          "Preferred language must be es, eu, ar or en",
      });
      return;
    }

    /* -----------------------------------------------------
       Municipality
       ----------------------------------------------------- */

    let municipalityId: Types.ObjectId | null =
      null;

    if (req.body.municipalityId) {
      if (
        typeof req.body.municipalityId !==
          "string" ||
        !Types.ObjectId.isValid(
          req.body.municipalityId
        )
      ) {
        res.status(400).json({
          message: "Invalid municipalityId",
        });
        return;
      }

      municipalityId = new Types.ObjectId(
        req.body.municipalityId
      );
    }

    /* -----------------------------------------------------
       Duplicate email
       ----------------------------------------------------- */

    const existingUser =
      await User.findOne({ email }).select("_id");

    if (existingUser) {
      res.status(409).json({
        message: "Email is already registered",
      });
      return;
    }

    /* -----------------------------------------------------
       Create user
       ----------------------------------------------------- */

    const user = await User.create({
      displayName,
      fullName,

      email,
      phone,

      passwordHash:
        hashPassword(password),

      preferredLanguage,

      originCountry,
      municipalityId,
      profileImage,

      /*
       * Security:
       * These values NEVER come from req.body.
       */
      platformRole: "user",
      status: "active",

      legalConsentAccepted: true,
      legalConsentAt: new Date(),
    });

    res.status(201).json({
      message:
        "User registered successfully",

      user: publicUser(user),
    });
  } catch (error: any) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({
        message: "Email is already registered",
      });
      return;
    }

    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

/* =========================================================
   GET USERS
   GET /api/users
   ========================================================= */

export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const q =
      typeof req.query.q === "string"
        ? req.query.q.trim()
        : "";

    const filter = q
      ? {
          $or: [
            {
              fullName: {
                $regex: q,
                $options: "i",
              },
            },
            {
              displayName: {
                $regex: q,
                $options: "i",
              },
            },
            {
              email: {
                $regex: q,
                $options: "i",
              },
            },
            {
              phone: {
                $regex: q,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const users = await User.find(filter)
      .populate(
        "municipalityId",
        "name slug territory"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/* =========================================================
   GET USER BY ID
   GET /api/users/:id
   ========================================================= */

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (
      !Types.ObjectId.isValid(req.params.id)
    ) {
      res.status(400).json({
        message: "Invalid user id",
      });
      return;
    }

    const user = await User.findById(
      req.params.id
    ).populate(
      "municipalityId",
      "name slug territory"
    );

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json(
      publicUser(user)
    );
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE USER
   PUT /api/users/:id
   ========================================================= */

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (
      !Types.ObjectId.isValid(req.params.id)
    ) {
      res.status(400).json({
        message: "Invalid user id",
      });
      return;
    }

    const data: Record<string, any> = {};

    /* -----------------------------------------------------
       Fields that user can update
       ----------------------------------------------------- */

    if (
      req.body.displayName !== undefined
    ) {
      const displayName =
        normalizeOptionalString(
          req.body.displayName
        );

      if (
        !displayName ||
        displayName.length < 2 ||
        displayName.length > 80
      ) {
        res.status(400).json({
          message:
            "Display name must contain between 2 and 80 characters",
        });
        return;
      }

      data.displayName = displayName;
    }

    if (
      req.body.fullName !== undefined
    ) {
      data.fullName =
        normalizeOptionalString(
          req.body.fullName
        );
    }

    if (req.body.phone !== undefined) {
      data.phone =
        normalizeOptionalString(
          req.body.phone
        );
    }

    if (
      req.body.originCountry !== undefined
    ) {
      data.originCountry =
        normalizeOptionalString(
          req.body.originCountry
        );
    }

    if (
      req.body.profileImage !== undefined
    ) {
      data.profileImage =
        normalizeOptionalString(
          req.body.profileImage
        );
    }

    /* -----------------------------------------------------
       Email
       ----------------------------------------------------- */

    if (req.body.email !== undefined) {
      const email =
        normalizeEmail(req.body.email);

      if (
        !email ||
        !EMAIL_REGEX.test(email)
      ) {
        res.status(400).json({
          message: "Invalid email format",
        });
        return;
      }

      const existingUser =
        await User.findOne({
          email,
          _id: {
            $ne: req.params.id,
          },
        }).select("_id");

      if (existingUser) {
        res.status(409).json({
          message:
            "Email is already registered",
        });
        return;
      }

      data.email = email;
    }

    /* -----------------------------------------------------
       Preferred language
       ----------------------------------------------------- */

    if (
      req.body.preferredLanguage !==
      undefined
    ) {
      if (
        !isValidLanguage(
          req.body.preferredLanguage
        )
      ) {
        res.status(400).json({
          message:
            "Preferred language must be es, eu, ar or en",
        });
        return;
      }

      data.preferredLanguage =
        req.body.preferredLanguage;
    }

    /* -----------------------------------------------------
       Municipality
       ----------------------------------------------------- */

    if (
      req.body.municipalityId !==
      undefined
    ) {
      if (
        req.body.municipalityId === null ||
        req.body.municipalityId === ""
      ) {
        data.municipalityId = null;
      } else {
        if (
          typeof req.body
            .municipalityId !== "string" ||
          !Types.ObjectId.isValid(
            req.body.municipalityId
          )
        ) {
          res.status(400).json({
            message:
              "Invalid municipalityId",
          });
          return;
        }

        data.municipalityId =
          new Types.ObjectId(
            req.body.municipalityId
          );
      }
    }

    /* -----------------------------------------------------
       Admin-only fields
       ----------------------------------------------------- */

    if (
      req.auth?.platformRole === "admin"
    ) {
      if (
        req.body.platformRole !==
        undefined
      ) {
        const allowedRoles = [
          "user",
          "moderator",
          "admin",
        ];

        if (
          !allowedRoles.includes(
            req.body.platformRole
          )
        ) {
          res.status(400).json({
            message:
              "Invalid platform role",
          });
          return;
        }

        data.platformRole =
          req.body.platformRole;
      }

      if (
        req.body.status !== undefined
      ) {
        const allowedStatuses = [
          "active",
          "inactive",
          "pending",
          "blocked",
        ];

        if (
          !allowedStatuses.includes(
            req.body.status
          )
        ) {
          res.status(400).json({
            message:
              "Invalid user status",
          });
          return;
        }

        data.status =
          req.body.status;
      }
    }

    /* -----------------------------------------------------
       Update
       ----------------------------------------------------- */

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "municipalityId",
        "name slug territory"
      );

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message:
        "User updated successfully",

      user: publicUser(user),
    });
  } catch (error: any) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({
        message: "Email is already registered",
      });
      return;
    }

    res.status(400).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE / DEACTIVATE USER
   DELETE /api/users/:id
   ========================================================= */

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (
      !Types.ObjectId.isValid(req.params.id)
    ) {
      res.status(400).json({
        message: "Invalid user id",
      });
      return;
    }

    /*
     * V1 uses soft delete.
     * The database record is preserved.
     */
    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            status: "inactive",
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    /*
     * Revoke every active session
     * after account deactivation.
     */
    await AuthSession.updateMany(
      {
        userId: user._id,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      message:
        "User deactivated successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        "Failed to deactivate user",

      error: error.message,
    });
  }
};