import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMunicipality extends Document {
  name: string;
  normalizedName: string;
  slug: string;
  officialCode?: string;
  territory: "alava" | "bizkaia" | "gipuzkoa";
  comarca?: string;
  municipio?: string;
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string | null;
  population?: number | null;
  mayor?: string;
  party?: string;
  secretary?: string;
  interventor?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const municipalitySchema = new Schema<IMunicipality>(
  {
    name: { type: String, required: true, trim: true },
    normalizedName: { type: String, required: true, trim: true, lowercase: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    officialCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    territory: {
      type: String,
      enum: ["alava", "bizkaia", "gipuzkoa"],
      required: true,
    },
    comarca: { type: String, trim: true },
    municipio: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    fax: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true, default: null },
    population: { type: Number, min: 0, default: null },
    mayor: { type: String, trim: true },
    party: { type: String, trim: true },
    secretary: { type: String, trim: true },
    interventor: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);

municipalitySchema.index({ territory: 1, normalizedName: 1 });
municipalitySchema.index({ status: 1, territory: 1 });

const Municipality: Model<IMunicipality> = mongoose.model<IMunicipality>(
  "Municipality",
  municipalitySchema
);

export default Municipality;
