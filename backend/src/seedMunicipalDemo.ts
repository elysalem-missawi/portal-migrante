import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { municipalitiesData } from "./data/municipalities.data";
import Municipality from "./models/municipality.model";
import Organization from "./models/organization.model";
import OrganizationLocation from "./models/organizationLocation.model";
import OrganizationMember from "./models/organizationMember.model";
import Publication from "./models/publication.model";
import PublicationCategory from "./models/publicationCategory.model";
import Service from "./models/service.model";
import ServiceCategory from "./models/serviceCategory.model";
import User from "./models/user.model";

dotenv.config();

const demoAdminEmail = "admin.demo@zubiasocial.eus";
const demoManagerEmail = "entidad.demo@zubiasocial.eus";

const normalizeName = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return ["scrypt", salt, hash].join(":");
}

const serviceCategories = [
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

type DemoPublicationType =
  | "announcement"
  | "need"
  | "offer"
  | "event"
  | "resource";

const allPublicationTypes: DemoPublicationType[] = [
  "announcement",
  "need",
  "offer",
  "event",
  "resource",
];
const publicationCategories: Array<{
  code: string;
  name: string;
  sortOrder: number;
  allowedTypes: DemoPublicationType[];
}> = [
  { code: "housing", name: "Vivienda", sortOrder: 10, allowedTypes: allPublicationTypes },
  { code: "employment", name: "Empleo", sortOrder: 20, allowedTypes: allPublicationTypes },
  { code: "education", name: "Educación y formación", sortOrder: 30, allowedTypes: allPublicationTypes },
  { code: "health", name: "Salud", sortOrder: 40, allowedTypes: allPublicationTypes },
  { code: "legal_immigration", name: "Asesoría jurídica y extranjería", sortOrder: 50, allowedTypes: allPublicationTypes },
  { code: "donations", name: "Donaciones y ayuda material", sortOrder: 60, allowedTypes: ["need", "offer"] },
  { code: "volunteering", name: "Voluntariado", sortOrder: 70, allowedTypes: ["need", "offer", "event"] },
  { code: "lost_found", name: "Objetos y personas perdidas", sortOrder: 80, allowedTypes: ["announcement", "need"] },
  { code: "community_event", name: "Actividades comunitarias", sortOrder: 90, allowedTypes: ["announcement", "event"] },
  { code: "other", name: "Otros", sortOrder: 100, allowedTypes: allPublicationTypes },
];

async function seedMunicipalDemo(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;
  const demoPassword = process.env.DEMO_PASSWORD;

  if (!mongoUri) throw new Error("MONGO_URI is required");
  if (!demoPassword || demoPassword.length < 12) {
    throw new Error("DEMO_PASSWORD must contain at least 12 characters");
  }

  await mongoose.connect(mongoUri);

  await Municipality.bulkWrite(
    municipalitiesData.map((municipality) => ({
      updateOne: {
        filter: { slug: municipality.slug },
        update: {
          $set: {
            ...municipality,
            territory: municipality.territory as
              | "alava"
              | "bizkaia"
              | "gipuzkoa",
            status:
              municipality.status === "inactive"
                ? ("inactive" as const)
                : ("active" as const),
            normalizedName: normalizeName(municipality.name),
          },
        },
        upsert: true,
      },
    }))
  );

  await ServiceCategory.bulkWrite(
    serviceCategories.map((category) => ({
      updateOne: {
        filter: { code: category.code },
        update: { $set: { ...category, status: "active" } },
        upsert: true,
      },
    }))
  );

  await PublicationCategory.bulkWrite(
    publicationCategories.map((category) => ({
      updateOne: {
        filter: { code: category.code },
        update: { $set: { ...category, status: "active" } },
        upsert: true,
      },
    }))
  );

  const [vitoria, urkabustaiz] = await Promise.all([
    Municipality.findOne({ slug: "vitoria-gasteiz" }),
    Municipality.findOne({ slug: "urkabustaiz" }),
  ]);
  if (!vitoria || !urkabustaiz) {
    throw new Error("Required demo municipalities were not seeded");
  }

  const commonUserFields = {
    accountType: "individual" as const,
    phoneVerified: false,
    preferredLanguage: "es",
    originCountry: "España",
    nativeLanguage: "Español",
    municipalityId: vitoria._id,
    legalConsentAccepted: true,
    legalConsentAt: new Date("2026-09-01T00:00:00.000Z"),
    status: "active" as const,
    isVerified: true,
    passwordHash: hashPassword(demoPassword),
  };

  const admin = await User.findOneAndUpdate(
    { email: demoAdminEmail },
    {
      $set: {
        ...commonUserFields,
        platformRole: "admin",
        role: "admin",
        fullName: "Administración Demo Zubia",
        displayName: "Administración Demo",
        email: demoAdminEmail,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const manager = await User.findOneAndUpdate(
    { email: demoManagerEmail },
    {
      $set: {
        ...commonUserFields,
        platformRole: "user",
        role: "organization_manager",
        fullName: "Representante Demo Zubia",
        displayName: "Representante Demo",
        email: demoManagerEmail,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const organization = await Organization.findOneAndUpdate(
    { slug: "zubia-social-euskadi-demo" },
    {
      $set: {
        type: "association",
        name: "Zubia Social Euskadi — Demo",
        legalName: "Asociación Zubia Social Euskadi",
        slug: "zubia-social-euskadi-demo",
        description:
          "Entorno de demostración del portal de información, servicios y participación para personas migrantes en Euskadi.",
        languages: ["es", "eu", "ar", "en", "fr"],
        email: "zubiasocialeuskadi@gmail.com",
        verificationStatus: "verified",
        verifiedAt: new Date(),
        verifiedByUserId: admin._id,
        status: "active",
        createdByUserId: manager._id,
        verified: true,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await OrganizationMember.findOneAndUpdate(
    { userId: manager._id, organizationId: organization._id },
    {
      $set: {
        role: "organization_admin",
        permissions: [],
        status: "active",
        joinedAt: new Date("2026-09-01T00:00:00.000Z"),
        invitedByUserId: admin._id,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const headquarters = await OrganizationLocation.findOneAndUpdate(
    {
      organizationId: organization._id,
      slug: "sede-piloto-vitoria-gasteiz",
    },
    {
      $set: {
        organizationId: organization._id,
        municipalityId: vitoria._id,
        name: "Sede piloto — Vitoria-Gasteiz",
        slug: "sede-piloto-vitoria-gasteiz",
        addressLine1: "Ubicación de demostración — Vitoria-Gasteiz",
        postalCode: "01001",
        email: "zubiasocialeuskadi@gmail.com",
        isHeadOffice: true,
        status: "active",
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const izarraPoint = await OrganizationLocation.findOneAndUpdate(
    {
      organizationId: organization._id,
      slug: "punto-piloto-izarra",
    },
    {
      $set: {
        organizationId: organization._id,
        municipalityId: urkabustaiz._id,
        name: "Punto informativo piloto — Izarra",
        slug: "punto-piloto-izarra",
        addressLine1: "Ubicación de demostración — Izarra",
        postalCode: "01440",
        email: "zubiasocialeuskadi@gmail.com",
        isHeadOffice: false,
        status: "active",
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await OrganizationLocation.updateMany(
    {
      organizationId: organization._id,
      _id: { $ne: headquarters._id },
      isHeadOffice: true,
      status: "active",
    },
    { $set: { isHeadOffice: false } }
  );

  const [socialCategory, adminCategory, employmentCategory] = await Promise.all([
    ServiceCategory.findOne({ code: "social_services" }),
    ServiceCategory.findOne({ code: "administrative_procedures" }),
    ServiceCategory.findOne({ code: "employment" }),
  ]);
  if (!socialCategory || !adminCategory || !employmentCategory) {
    throw new Error("Required demo service categories were not seeded");
  }

  const demoServices = [
    {
      categoryId: socialCategory._id,
      title: "Orientación inicial para personas migrantes",
      description:
        "Primera orientación sobre recursos sociales, empadronamiento, salud, educación y derivación a la entidad competente.",
      deliveryModes: ["in_person", "hybrid"],
      locationIds: [headquarters._id],
      eligibility: "Personas migrantes que viven en Euskadi.",
      requiredDocuments: ["Documento de identidad, si está disponible"],
      costType: "free",
      appointmentRequired: false,
    },
    {
      categoryId: adminCategory._id,
      title: "Acompañamiento en trámites administrativos",
      description:
        "Apoyo para comprender procedimientos digitales y preparar la documentación antes de acudir a la administración responsable.",
      deliveryModes: ["in_person", "online"],
      locationIds: [headquarters._id, izarraPoint._id],
      eligibility: "Personas que necesiten apoyo digital o lingüístico.",
      requiredDocuments: [],
      costType: "free",
      appointmentRequired: true,
    },
    {
      categoryId: employmentCategory._id,
      title: "Información sobre empleo y formación",
      description:
        "Acceso organizado a recursos de empleo, formación y orientación laboral disponibles en Euskadi.",
      deliveryModes: ["online"],
      locationIds: [],
      eligibility: "Acceso público.",
      requiredDocuments: [],
      costType: "free",
      appointmentRequired: false,
    },
  ];

  for (const service of demoServices) {
    await Service.findOneAndUpdate(
      { organizationId: organization._id, title: service.title },
      {
        $set: {
          ...service,
          organizationId: organization._id,
          email: "zubiasocialeuskadi@gmail.com",
          languages: ["es", "eu", "ar", "en", "fr"],
          verificationStatus: "verified",
          status: "active",
          verified: true,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  const [communityCategory, employmentPublicationCategory] = await Promise.all([
    PublicationCategory.findOne({ code: "community_event" }),
    PublicationCategory.findOne({ code: "employment" }),
  ]);
  if (!communityCategory || !employmentPublicationCategory) {
    throw new Error("Required demo publication categories were not seeded");
  }

  const demoPublications = [
    {
      categoryId: communityCategory._id,
      type: "event",
      title: "Sesión piloto de acogida e información",
      description:
        "Actividad de demostración para presentar cómo una entidad puede publicar información local, fecha de vigencia y canal de contacto.",
      urgency: "normal",
      expiresAt: new Date("2027-01-15T23:59:59.000Z"),
    },
    {
      categoryId: employmentPublicationCategory._id,
      type: "resource",
      title: "Recursos de empleo y formación — contenido de demostración",
      description:
        "Ejemplo de recurso público organizado por municipio y categoría. El contenido definitivo será validado con las entidades responsables.",
      urgency: "normal",
      expiresAt: null,
    },
  ];

  for (const publication of demoPublications) {
    await Publication.findOneAndUpdate(
      { organizationId: organization._id, title: publication.title },
      {
        $set: {
          ...publication,
          authorUserId: manager._id,
          organizationId: organization._id,
          municipalityId: vitoria._id,
          sourceLanguage: "es",
          contactMethod: "email",
          contactValue: "zubiasocialeuskadi@gmail.com",
          verificationStatus: "verified",
          status: "published",
          publishedAt: new Date("2026-09-01T00:00:00.000Z"),
          reviewedByUserId: admin._id,
          reviewedAt: new Date("2026-09-01T00:00:00.000Z"),
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  console.log(
    "Municipal demo data ready:",
    JSON.stringify({
      adminEmail: demoAdminEmail,
      organizationManagerEmail: demoManagerEmail,
      organization: organization.slug,
      services: demoServices.length,
      publications: demoPublications.length,
    })
  );
}

seedMunicipalDemo()
  .catch((error) => {
    console.error("Municipal demo seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
