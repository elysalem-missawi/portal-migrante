import dotenv from "dotenv";
import mongoose from "mongoose";
import Municipality from "./models/municipality.model";
import Organization from "./models/organization.model";
import OrganizationMember from "./models/organizationMember.model";
import Service from "./models/service.model";
import User from "./models/user.model";

dotenv.config();

const apply = process.argv.includes("--apply");

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

async function runMigration() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is required");

  await mongoose.connect(mongoUri);

  const report = {
    mode: apply ? "apply" : "dry-run",
    municipalities: { inspected: 0, updates: 0 },
    organizations: { inspected: 0, updates: 0 },
    users: { inspected: 0, updates: 0, municipalityLinks: 0 },
    memberships: { candidates: 0, upserts: 0 },
    services: { inspected: 0, requireManualMapping: 0 },
  };

  const municipalities = await Municipality.find({}).lean();
  report.municipalities.inspected = municipalities.length;

  const municipalityByName = new Map<string, string>();
  for (const municipality of municipalities) {
    municipalityByName.set(normalize(municipality.name), String(municipality._id));
    municipalityByName.set(normalize(municipality.slug), String(municipality._id));
    if (municipality.municipio) {
      municipalityByName.set(normalize(municipality.municipio), String(municipality._id));
    }

    if (!municipality.normalizedName) {
      report.municipalities.updates += 1;
      if (apply) {
        await Municipality.updateOne(
          { _id: municipality._id },
          { $set: { normalizedName: normalize(municipality.name) } }
        );
      }
    }
  }

  const organizations = await Organization.find({}).lean();
  report.organizations.inspected = organizations.length;
  for (const organization of organizations) {
    const updates: Record<string, unknown> = {};
    if (!organization.verificationStatus) {
      updates.verificationStatus = organization.verified ? "verified" : "pending";
    }
    if (!organization.status) updates.status = "pending";

    if (Object.keys(updates).length > 0) {
      report.organizations.updates += 1;
      if (apply) {
        await Organization.updateOne({ _id: organization._id }, { $set: updates });
      }
    }
  }

  const users = await User.find({}).lean();
  report.users.inspected = users.length;
  for (const user of users) {
    const updates: Record<string, unknown> = {};

    if (!user.platformRole) {
      updates.platformRole =
        user.role === "super_admin"
          ? "super_admin"
          : user.role === "admin"
            ? "admin"
            : "user";
    }

    if (!user.municipalityId && user.municipality) {
      const municipalityId = municipalityByName.get(normalize(user.municipality));
      if (municipalityId) {
        updates.municipalityId = municipalityId;
        report.users.municipalityLinks += 1;
      }
    }

    if (Object.keys(updates).length > 0) {
      report.users.updates += 1;
      if (apply) {
        await User.updateOne({ _id: user._id }, { $set: updates });
      }
    }

    if (user.organizationId) {
      report.memberships.candidates += 1;
      if (apply) {
        await OrganizationMember.updateOne(
          { userId: user._id, organizationId: user.organizationId },
          {
            $setOnInsert: {
              role:
                user.role === "organization_manager"
                  ? "partner_manager"
                  : "member",
              status: "active",
              joinedAt: user.createdAt || new Date(),
              invitedByUserId: null,
              permissions: [],
            },
          },
          { upsert: true }
        );
        report.memberships.upserts += 1;
      }
    }
  }

  const services = await Service.find({}).lean();
  report.services.inspected = services.length;
  report.services.requireManualMapping = services.filter(
    (service) => !service.organizationId || !service.categoryId
  ).length;

  console.log(JSON.stringify(report, null, 2));
  if (!apply) {
    console.log("Dry run only. Re-run with --apply after reviewing this report.");
  } else if (report.services.requireManualMapping > 0) {
    console.log(
      "Some legacy services were not modified because organization/category mapping requires a manual decision."
    );
  }

  await mongoose.disconnect();
}

runMigration().catch(async (error) => {
  console.error("Migration failed:", error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
