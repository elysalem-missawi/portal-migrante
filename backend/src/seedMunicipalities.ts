import mongoose from "mongoose";
import dotenv from "dotenv";
import Municipality from "./models/municipality.model";
import { municipalitiesData } from "./data/municipalities.data";

dotenv.config();

const normalizeName = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const seedMunicipalities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");

    for (const item of municipalitiesData) {
      await Municipality.updateOne(
        { slug: item.slug },
        {
          $set: {
            ...item,
            normalizedName: normalizeName(item.name),
          },
        },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Municipalities seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedMunicipalities();
