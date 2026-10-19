import mongoose from "mongoose";
import dotenv from "dotenv";
import ServiceCategory from "./models/serviceCategory.model";

dotenv.config();

const categories = [
  { code: "housing", name: "Vivienda", sortOrder: 10 },
  { code: "employment", name: "Empleo", sortOrder: 20 },
  { code: "education_training", name: "Educación y formación", sortOrder: 30 },
  { code: "health", name: "Salud", sortOrder: 40 },
  { code: "social_services", name: "Servicios sociales", sortOrder: 50 },
  { code: "legal_immigration", name: "Asesoría jurídica y extranjería", sortOrder: 60 },
  { code: "administrative_procedures", name: "Trámites administrativos", sortOrder: 70 },
  { code: "language", name: "Idiomas", sortOrder: 80 },
  { code: "community_participation", name: "Comunidad y participación", sortOrder: 90 },
  { code: "emergency", name: "Atención de emergencia", sortOrder: 100 },
];

const seedServiceCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");

    for (const category of categories) {
      await ServiceCategory.updateOne(
        { code: category.code },
        { $set: { ...category, status: "active" } },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Service categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedServiceCategories();
