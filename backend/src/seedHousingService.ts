import mongoose from "mongoose";
import dotenv from "dotenv";

import Organization from "./models/organization.model";
import ServiceCategory from "./models/serviceCategory.model";
import Service from "./models/service.model";
import Need from "./models/need.model";

dotenv.config();

/* =========================================================
   Seed
========================================================= */

const seedHousingService =
  async () => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error(
          "MONGO_URI is not defined"
        );
      }

      await mongoose.connect(
        process.env.MONGO_URI
      );

      console.log(
        "MongoDB connected"
      );

      /* =====================================================
         Need
      ===================================================== */

      const housingNeed =
        await Need.findOne({
          code: "housing",
          status: "active",
        });

      if (!housingNeed) {
        throw new Error(
          'Active Need with code "housing" not found'
        );
      }

      console.log(
        "Housing Need found"
      );

      /* =====================================================
         Organization
      ===================================================== */

      const organization =
        await Organization.findOneAndUpdate(
          {
            slug:
              "zubia-social-euskadi",
          },

          {
            $set: {
              type:
                "association",

              name:
                "Zubia Social Euskadi",

              legalName:
                "ASOC ZUBIA SOCIAL EUSKADI",

              slug:
                "zubia-social-euskadi",

              description:
                "Asociación social que desarrolla Portal Migrante y trabaja en orientación, inclusión y acompañamiento comunitario.",

              website:
                "https://zubiasocial.es",

              languages: [
                "es",
                "eu",
                "ar",
                "en",
              ],

              verificationStatus:
                "verified",

              verifiedAt:
                new Date(),

              status:
                "active",

              verified:
                true,
            },
          },

          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );

      console.log(
        "Organization ready:",
        organization.name
      );

      /* =====================================================
         Service Category
      ===================================================== */

      const category =
        await ServiceCategory.findOneAndUpdate(
          {
            code:
              "housing_support",
          },

          {
            $set: {
              code:
                "housing_support",

              name:
                "Vivienda y alojamiento",

              description:
                "Servicios de orientación, acceso a vivienda, alojamiento y recursos relacionados.",

              parentCategoryId:
                null,

              sortOrder:
                10,

              status:
                "active",
            },
          },

          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );

      console.log(
        "Service category ready:",
        category.name
      );

      /* =====================================================
         Service
      ===================================================== */

      const service =
        await Service.findOneAndUpdate(
          {
            organizationId:
              organization._id,

            title:
              "Orientación sobre vivienda y recursos habitacionales",
          },

          {
            $set: {
              organizationId:
                organization._id,

              locationIds: [],

              categoryId:
                category._id,

              needIds: [
                housingNeed._id,
              ],

              /* =============================================
                 New multilingual content
              ============================================= */

              translations: {
                es: {
                  title:
                    "Orientación sobre vivienda y recursos habitacionales",

                  description:
                    "Servicio de orientación general para localizar información, recursos y entidades relacionadas con vivienda, alquiler, alojamiento temporal y programas públicos.",

                  eligibility:
                    "Personas que necesitan información u orientación sobre vivienda y recursos habitacionales.",
                },

                ar: {
                  title:
                    "التوجيه حول السكن والموارد السكنية",

                  description:
                    "خدمة توجيه عامة تساعد على الوصول إلى المعلومات والموارد والجهات المتعلقة بالسكن والإيجار والسكن المؤقت وبرامج السكن العمومي.",

                  eligibility:
                    "الأشخاص الذين يحتاجون إلى معلومات أو توجيه حول السكن والموارد السكنية.",
                },

                en: {
                  title:
                    "Housing and accommodation guidance",

                  description:
                    "General guidance service to help locate information, resources and organisations related to housing, renting, temporary accommodation and public housing programmes.",

                  eligibility:
                    "People who need information or guidance about housing and accommodation resources.",
                },

                eu: {
                  title:
                    "Etxebizitzari eta etxebizitza-baliabideei buruzko orientazioa",

                  description:
                    "Etxebizitzarekin, alokairuarekin, aldi baterako ostatuarekin eta etxebizitza publikoko programekin lotutako informazioa, baliabideak eta erakundeak aurkitzeko orientazio-zerbitzu orokorra.",

                  eligibility:
                    "Etxebizitzari eta etxebizitza-baliabideei buruzko informazioa edo orientazioa behar duten pertsonak.",
                },
              },

              /* =============================================
                 Transitional Spanish fallback fields
              ============================================= */

              title:
                "Orientación sobre vivienda y recursos habitacionales",

              description:
                "Servicio de orientación general para localizar información, recursos y entidades relacionadas con vivienda, alquiler, alojamiento temporal y programas públicos.",

              eligibility:
                "Personas que necesitan información u orientación sobre vivienda y recursos habitacionales.",

              /* =============================================
                 Service details
              ============================================= */

              deliveryModes: [
                "online",
              ],

              requiredDocuments:
                [],

              costType:
                "free",

              appointmentRequired:
                false,

              website:
                "https://zubiasocial.es",

              languages: [
                "es",
                "eu",
                "ar",
                "en",
              ],

              verificationStatus:
                "verified",

              status:
                "active",

              verified:
                true,
            },
          },

          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );

      console.log(
        "Service ready:",
        service.title
      );

      console.log(
        "Housing service seeded successfully"
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Seed error:",
        error
      );

      process.exit(1);
    }
  };

void seedHousingService();