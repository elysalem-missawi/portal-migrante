import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/user.model";

dotenv.config();

const PASSWORD_PREFIX = "scrypt";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${PASSWORD_PREFIX}:${salt}:${hash}`;
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed a test user in production.");
  }

  const mongoUri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portal";

  const email = process.env.TEST_USER_EMAIL || "test.user@zubia.local";
  const password = process.env.TEST_USER_PASSWORD || "ZubiaTest2026!";
  const role =
    process.env.TEST_USER_ROLE === "admin" ||
    process.env.TEST_USER_ROLE === "moderator"
      ? process.env.TEST_USER_ROLE
      : "user";

  await mongoose.connect(mongoUri);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        displayName: "Usuario Prueba",
        fullName: "Usuario de Prueba Zubia",
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        preferredLanguage: "es",
        originCountry: "Morocco",
        platformRole: role,
        status: "active",
        legalConsentAccepted: true,
        legalConsentAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log("✅ Test user ready");
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: ${user.platformRole}`);
  console.log(`User ID: ${String(user._id)}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Failed to seed test user:", error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
