import mongoose from "mongoose";
import dotenv from "dotenv";
import PublicationCategory from "./models/publicationCategory.model";

dotenv.config();

const allTypes = ["announcement", "need", "offer", "event", "resource"] as const;
const categories = [
  { code: "housing", name: "Vivienda", sortOrder: 10, allowedTypes: allTypes },
  { code: "employment", name: "Empleo", sortOrder: 20, allowedTypes: allTypes },
  { code: "education", name: "Educación y formación", sortOrder: 30, allowedTypes: allTypes },
  { code: "health", name: "Salud", sortOrder: 40, allowedTypes: allTypes },
  { code: "legal_immigration", name: "Asesoría jurídica y extranjería", sortOrder: 50, allowedTypes: allTypes },
  { code: "donations", name: "Donaciones y ayuda material", sortOrder: 60, allowedTypes: ["need", "offer"] },
  { code: "volunteering", name: "Voluntariado", sortOrder: 70, allowedTypes: ["need", "offer", "event"] },
  { code: "lost_found", name: "Objetos y personas perdidas", sortOrder: 80, allowedTypes: ["announcement", "need"] },
  { code: "community_event", name: "Actividades comunitarias", sortOrder: 90, allowedTypes: ["announcement", "event"] },
  { code: "other", name: "Otros", sortOrder: 100, allowedTypes: allTypes },
];

const seedPublicationCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
    for (const category of categories) {
      await PublicationCategory.updateOne(
        { code: category.code },
        { $set: { ...category, status: "active" } },
        { upsert: true, runValidators: true }
      );
    }
    console.log("Publication categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedPublicationCategories();
