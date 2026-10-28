import {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import Need from "../models/need.model";

const isObjectId = (
  value: unknown
): value is string =>
  typeof value === "string" &&
  mongoose.Types.ObjectId.isValid(
    value
  );

const normalizeCode = (
  value: unknown
) => {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .toLowerCase();
};

export const getNeeds =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const status =
        typeof req.query.status ===
          "string" &&
        [
          "active",
          "inactive",
        ].includes(
          req.query.status
        )
          ? req.query.status
          : "active";

      const needs =
        await Need.find({
          status,
        }).sort({
          order: 1,
          "labels.es": 1,
        });

      res
        .status(200)
        .json(needs);
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch needs",

          error:
            error.message,
        });
    }
  };

export const getNeedById =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !isObjectId(
          req.params.id
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid need id",
          });

        return;
      }

      const need =
        await Need.findById(
          req.params.id
        );

      if (!need) {
        res
          .status(404)
          .json({
            message:
              "Need not found",
          });

        return;
      }

      res
        .status(200)
        .json(need);
    } catch (
      error: any
    ) {
      res
        .status(500)
        .json({
          message:
            "Failed to fetch need",

          error:
            error.message,
        });
    }
  };

export const createNeed =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const code =
        normalizeCode(
          req.body.code
        );

      if (!code) {
        res
          .status(400)
          .json({
            message:
              "Need code is required",
          });

        return;
      }

      if (
        !req.body.labels?.es
      ) {
        res
          .status(400)
          .json({
            message:
              "Spanish label is required",
          });

        return;
      }

      const existing =
        await Need.findOne({
          code,
        });

      if (existing) {
        res
          .status(409)
          .json({
            message:
              "Need code already exists",
          });

        return;
      }

      const need =
        await Need.create({
          ...req.body,
          code,
        });

      res
        .status(201)
        .json(need);
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to create need",

          error:
            error.message,
        });
    }
  };

export const updateNeed =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !isObjectId(
          req.params.id
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid need id",
          });

        return;
      }

      const patch = {
        ...req.body,
      };

      if (
        req.body.code !==
        undefined
      ) {
        const code =
          normalizeCode(
            req.body.code
          );

        if (!code) {
          res
            .status(400)
            .json({
              message:
                "Need code cannot be empty",
            });

          return;
        }

        const duplicate =
          await Need.findOne({
            code,

            _id: {
              $ne:
                req.params.id,
            },
          });

        if (duplicate) {
          res
            .status(409)
            .json({
              message:
                "Need code already exists",
            });

          return;
        }

        patch.code =
          code;
      }

      const need =
        await Need.findByIdAndUpdate(
          req.params.id,
          patch,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!need) {
        res
          .status(404)
          .json({
            message:
              "Need not found",
          });

        return;
      }

      res
        .status(200)
        .json(need);
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to update need",

          error:
            error.message,
        });
    }
  };

export const deactivateNeed =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (
        !isObjectId(
          req.params.id
        )
      ) {
        res
          .status(400)
          .json({
            message:
              "Invalid need id",
          });

        return;
      }

      const need =
        await Need.findByIdAndUpdate(
          req.params.id,
          {
            status:
              "inactive",
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!need) {
        res
          .status(404)
          .json({
            message:
              "Need not found",
          });

        return;
      }

      res
        .status(200)
        .json(need);
    } catch (
      error: any
    ) {
      res
        .status(400)
        .json({
          message:
            "Failed to deactivate need",

          error:
            error.message,
        });
    }
  };