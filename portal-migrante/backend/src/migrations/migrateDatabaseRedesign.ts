import dotenv from "dotenv";
import mongoose, { Types } from "mongoose";

import Municipality from "../models/municipality.model";
import Organization from "../models/organization.model";
import OrganizationMember from "../models/organizationMember.model";
import Service from "../models/service.model";
import User from "../models/user.model";

dotenv.config();

const apply = process.argv.includes("--apply");

/* =========================================================
   Legacy types
   ========================================================= */

/**
 * These fields belonged to the previous User schema.
 *
 * They are intentionally defined only inside this migration
 * because they must NOT return to the current User model.
 */
interface LegacyUser {
  _id: Types.ObjectId;

  platformRole?:
    | "user"
    | "moderator"
    | "admin"
    | "super_admin";

  role?:
    | "community_user"
    | "organization_manager"
    | "admin"
    | "super_admin";

  municipalityId?: Types.ObjectId | null;
  municipality?: string;

  organizationId?: Types.ObjectId | null;

  createdAt?: Date;
}

/* =========================================================
   Helpers
   ========================================================= */

const normalize = (
  value: string
): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

/* =========================================================
   Migration
   ========================================================= */

async function runMigration() {
  const mongoUri =
    process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is required"
    );
  }

  await mongoose.connect(mongoUri);

  const report = {
    mode:
      apply
        ? "apply"
        : "dry-run",

    municipalities: {
      inspected: 0,
      updates: 0,
    },

    organizations: {
      inspected: 0,
      updates: 0,
    },

    users: {
      inspected: 0,
      updates: 0,
      municipalityLinks: 0,
      legacySuperAdmins: 0,
    },

    memberships: {
      candidates: 0,
      upserts: 0,
    },

    services: {
      inspected: 0,
      requireManualMapping: 0,
    },
  };

  /* =======================================================
     Municipalities
     ======================================================= */

  const municipalities =
    await Municipality.find({}).lean();

  report.municipalities.inspected =
    municipalities.length;

  const municipalityByName =
    new Map<string, string>();

  for (
    const municipality
    of municipalities
  ) {
    municipalityByName.set(
      normalize(municipality.name),
      String(municipality._id)
    );

    municipalityByName.set(
      normalize(municipality.slug),
      String(municipality._id)
    );

    if (municipality.municipio) {
      municipalityByName.set(
        normalize(
          municipality.municipio
        ),
        String(municipality._id)
      );
    }

    if (
      !municipality.normalizedName
    ) {
      report.municipalities.updates += 1;

      if (apply) {
        await Municipality.updateOne(
          {
            _id:
              municipality._id,
          },
          {
            $set: {
              normalizedName:
                normalize(
                  municipality.name
                ),
            },
          }
        );
      }
    }
  }

  /* =======================================================
     Organizations
     ======================================================= */

  const organizations =
    await Organization.find({}).lean();

  report.organizations.inspected =
    organizations.length;

  for (
    const organization
    of organizations
  ) {
    const updates:
      Record<string, unknown> = {};

    if (
      !organization.verificationStatus
    ) {
      updates.verificationStatus =
        organization.verified
          ? "verified"
          : "pending";
    }

    if (!organization.status) {
      updates.status =
        "pending";
    }

    if (
      Object.keys(updates).length > 0
    ) {
      report.organizations.updates += 1;

      if (apply) {
        await Organization.updateOne(
          {
            _id:
              organization._id,
          },
          {
            $set:
              updates,
          }
        );
      }
    }
  }

  /* =======================================================
     Users — legacy data
     ======================================================= */

  /**
   * Important:
   *
   * We deliberately read from the raw MongoDB collection.
   * This allows the migration to access legacy fields that
   * no longer exist in the current IUser TypeScript model.
   */
  const users =
    (await User.collection
      .find({})
      .toArray()) as unknown as LegacyUser[];

  report.users.inspected =
    users.length;

  for (const user of users) {
    const updates:
      Record<string, unknown> = {};

    /* -----------------------------------------------------
       Platform role migration
       ----------------------------------------------------- */

    /**
     * Legacy:
     *
     * super_admin -> admin
     * admin       -> admin
     * moderator   -> moderator
     * others      -> user
     */

    if (
      user.platformRole ===
      "super_admin"
    ) {
      updates.platformRole =
        "admin";

      report.users
        .legacySuperAdmins += 1;
    } else if (
      !user.platformRole
    ) {
      if (
        user.role ===
          "super_admin" ||
        user.role === "admin"
      ) {
        updates.platformRole =
          "admin";

        if (
          user.role ===
          "super_admin"
        ) {
          report.users
            .legacySuperAdmins += 1;
        }
      } else {
        updates.platformRole =
          "user";
      }
    }

    /* -----------------------------------------------------
       Municipality migration
       ----------------------------------------------------- */

    if (
      !user.municipalityId &&
      user.municipality
    ) {
      const municipalityId =
        municipalityByName.get(
          normalize(
            user.municipality
          )
        );

      if (municipalityId) {
        updates.municipalityId =
          municipalityId;

        report.users
          .municipalityLinks += 1;
      }
    }

    /* -----------------------------------------------------
       Apply User updates
       ----------------------------------------------------- */

    if (
      Object.keys(updates).length > 0
    ) {
      report.users.updates += 1;

      if (apply) {
        await User.updateOne(
          {
            _id:
              user._id,
          },
          {
            $set:
              updates,
          }
        );
      }
    }

    /* -----------------------------------------------------
       Legacy organization membership
       ----------------------------------------------------- */

    if (
      user.organizationId
    ) {
      report.memberships
        .candidates += 1;

      if (apply) {
        await OrganizationMember.updateOne(
          {
            userId:
              user._id,

            organizationId:
              user.organizationId,
          },
          {
            $setOnInsert: {
              role:
                user.role ===
                "organization_manager"
                  ? "partner_manager"
                  : "member",

              status:
                "active",

              joinedAt:
                user.createdAt ||
                new Date(),

              invitedByUserId:
                null,

              permissions:
                [],
            },
          },
          {
            upsert:
              true,
          }
        );

        report.memberships
          .upserts += 1;
      }
    }
  }

  /* =======================================================
     Services
     ======================================================= */

  const services =
    await Service.find({}).lean();

  report.services.inspected =
    services.length;

  report.services
    .requireManualMapping =
    services.filter(
      (service) =>
        !service.organizationId ||
        !service.categoryId
    ).length;

  /* =======================================================
     Report
     ======================================================= */

  console.log(
    JSON.stringify(
      report,
      null,
      2
    )
  );

  if (!apply) {
    console.log(
      "Dry run only. Re-run with --apply after reviewing this report."
    );
  } else if (
    report.services
      .requireManualMapping > 0
  ) {
    console.log(
      "Some legacy services were not modified because organization/category mapping requires a manual decision."
    );
  }

  await mongoose.disconnect();
}

/* =========================================================
   Run
   ========================================================= */

runMigration().catch(
  async (error) => {
    console.error(
      "Migration failed:",
      error
    );

    await mongoose
      .disconnect()
      .catch(
        () => undefined
      );

    process.exit(1);
  }
);