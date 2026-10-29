import mongoose from "mongoose";
import dotenv from "dotenv";

import ContentItem from "./models/contentItem.model";
import Need from "./models/need.model";

dotenv.config();

/* =========================================================
   Seed
========================================================= */

const seedContentItems =
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

      /* -----------------------------------------------------
         Find housing need
      ----------------------------------------------------- */

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

      const needIds = [
        housingNeed._id,
      ];

      /* -----------------------------------------------------
         Content items
      ----------------------------------------------------- */

      const items = [
        /* =================================================
           INFORMATION
        ================================================= */

        {
          seedKey:
            "housing-basic-information",

          data: {
            type: "information",

            needIds,

            translations: {
              es: {
                title:
                  "Primeros pasos para buscar vivienda en Euskadi",

                summary:
                  "Información básica para entender por dónde empezar la búsqueda de vivienda.",

                content:
                  "Antes de iniciar la búsqueda conviene definir el municipio o zona, el presupuesto mensual disponible y la documentación que puede solicitar la propiedad o la agencia. También es importante distinguir entre alquiler privado, recursos temporales y programas públicos de vivienda.",
              },

              ar: {
                title:
                  "الخطوات الأولى للبحث عن سكن في إقليم الباسك",

                summary:
                  "معلومات أساسية لفهم كيفية البدء في البحث عن السكن.",

                content:
                  "قبل البدء في البحث من المفيد تحديد البلدية أو المنطقة المناسبة، والميزانية الشهرية المتاحة، والوثائق التي قد يطلبها المالك أو الوكالة. كما يجب التمييز بين الإيجار الخاص، والسكن المؤقت، وبرامج السكن العمومي.",
              },

              en: {
                title:
                  "First steps to look for housing in Euskadi",

                summary:
                  "Basic information to understand where to start your housing search.",

                content:
                  "Before starting your search, it is useful to define the municipality or area, your available monthly budget and the documents that a landlord or agency may request. It is also important to distinguish between private rentals, temporary accommodation and public housing programmes.",
              },

              eu: {
                title:
                  "Euskadin etxebizitza bilatzen hasteko lehen urratsak",

                summary:
                  "Etxebizitza bilaketa nondik hasi ulertzeko oinarrizko informazioa.",

                content:
                  "Bilaketa hasi aurretik komeni da udalerria edo eremua, hileko aurrekontua eta jabeak edo agentziak eska dezaketen dokumentazioa zehaztea. Halaber, alokairu pribatua, aldi baterako ostatua eta etxebizitza publikoko programak bereiztea garrantzitsua da.",
              },
            },

            source: {
              name:
                "Portal Migrante · orientación general",
            },

            order: 10,

            status: "active",
          },
        },

        /* =================================================
           GUIDE
        ================================================= */

        {
          seedKey:
            "housing-rental-guide",

          data: {
            type: "guide",

            needIds,

            translations: {
              es: {
                title:
                  "Cómo preparar una búsqueda de alquiler",

                summary:
                  "Una guía sencilla para organizar la búsqueda antes de contactar con propietarios o agencias.",

                content:
                  "Sigue estos pasos para preparar mejor tu búsqueda de vivienda.",
              },

              ar: {
                title:
                  "كيفية الاستعداد للبحث عن منزل للإيجار",

                summary:
                  "دليل بسيط لتنظيم عملية البحث قبل التواصل مع المالكين أو الوكالات.",

                content:
                  "اتبع هذه الخطوات للاستعداد بشكل أفضل للبحث عن السكن.",
              },

              en: {
                title:
                  "How to prepare for a rental search",

                summary:
                  "A simple guide to organise your search before contacting landlords or agencies.",

                content:
                  "Follow these steps to prepare your housing search.",
              },

              eu: {
                title:
                  "Nola prestatu alokairuko etxebizitza bilaketa",

                summary:
                  "Jabeekin edo agentziekin harremanetan jarri aurretik bilaketa antolatzeko gida sinplea.",

                content:
                  "Jarraitu urrats hauek etxebizitza bilaketa hobeto prestatzeko.",
              },
            },

            steps: [
              {
                order: 10,

                translations: {
                  es: {
                    title:
                      "Define zona y presupuesto",

                    content:
                      "Decide en qué municipios o barrios puedes vivir y cuál es el alquiler mensual máximo que puedes asumir.",
                  },

                  ar: {
                    title:
                      "حدد المنطقة والميزانية",

                    content:
                      "حدد البلديات أو الأحياء التي يمكنك السكن فيها، وحدد الحد الأقصى للإيجار الشهري الذي تستطيع تحمله.",
                  },

                  en: {
                    title:
                      "Define area and budget",

                    content:
                      "Decide which municipalities or neighbourhoods suit you and the maximum monthly rent you can afford.",
                  },

                  eu: {
                    title:
                      "Zehaztu eremua eta aurrekontua",

                    content:
                      "Erabaki zein udalerri edo auzotan bizi zaitezkeen eta gehienez zenbateko hileko alokairua ordaindu dezakezun.",
                  },
                },
              },

              {
                order: 20,

                translations: {
                  es: {
                    title:
                      "Prepara la documentación",

                    content:
                      "Ten disponibles documentos básicos como identificación, contrato de trabajo o justificantes de ingresos cuando proceda.",
                  },

                  ar: {
                    title:
                      "جهز الوثائق",

                    content:
                      "جهز الوثائق الأساسية مثل وثيقة الهوية، وعقد العمل أو إثبات الدخل عندما يكون ذلك مطلوبًا.",
                  },

                  en: {
                    title:
                      "Prepare your documents",

                    content:
                      "Have basic documents available, such as identification, an employment contract or proof of income when required.",
                  },

                  eu: {
                    title:
                      "Prestatu dokumentazioa",

                    content:
                      "Eskura izan oinarrizko dokumentuak, hala nola identifikazioa, lan-kontratua edo diru-sarreren egiaztagiriak beharrezkoa denean.",
                  },
                },
              },

              {
                order: 30,

                translations: {
                  es: {
                    title:
                      "Comprueba las condiciones antes de pagar",

                    content:
                      "Lee el contrato, confirma la identidad de la parte arrendadora y evita realizar pagos sin documentación o garantías suficientes.",
                  },

                  ar: {
                    title:
                      "تحقق من الشروط قبل الدفع",

                    content:
                      "اقرأ العقد، وتأكد من هوية المؤجر، وتجنب دفع أي مبلغ دون وثائق أو ضمانات كافية.",
                  },

                  en: {
                    title:
                      "Check the conditions before paying",

                    content:
                      "Read the contract, confirm the landlord's identity and avoid payments without adequate documentation or guarantees.",
                  },

                  eu: {
                    title:
                      "Egiaztatu baldintzak ordaindu aurretik",

                    content:
                      "Irakurri kontratua, egiaztatu errentatzailearen nortasuna eta saihestu ordainketak dokumentazio edo berme nahikorik gabe.",
                  },
                },
              },
            ],

            source: {
              name:
                "Portal Migrante · orientación general",
            },

            order: 20,

            status: "active",
          },
        },

        /* =================================================
           EXTERNAL RESOURCE
        ================================================= */

        {
          seedKey:
            "housing-etxebide-resource",

          data: {
            type:
              "external_resource",

            needIds,

            translations: {
              es: {
                title:
                  "Etxebide · Servicio Vasco de Vivienda",

                summary:
                  "Recurso oficial del Gobierno Vasco relacionado con vivienda protegida y programas públicos de vivienda.",

                content:
                  "Consulta la información oficial y los trámites disponibles en Etxebide.",
              },

              ar: {
                title:
                  "Etxebide · مصلحة السكن في إقليم الباسك",

                summary:
                  "مورد رسمي تابع لحكومة الباسك مرتبط بالسكن المحمي وبرامج السكن العمومي.",

                content:
                  "يمكنك الاطلاع على المعلومات الرسمية والإجراءات المتاحة عبر Etxebide.",
              },

              en: {
                title:
                  "Etxebide · Basque Housing Service",

                summary:
                  "Official Basque Government resource related to protected housing and public housing programmes.",

                content:
                  "Check official information and available procedures through Etxebide.",
              },

              eu: {
                title:
                  "Etxebide · Etxebizitzaren Euskal Zerbitzua",

                summary:
                  "Babes publikoko etxebizitzarekin eta etxebizitza-programa publikoekin lotutako Eusko Jaurlaritzaren baliabide ofiziala.",

                content:
                  "Kontsultatu Etxebideren informazio ofiziala eta eskuragarri dauden izapideak.",
              },
            },

            resourceData: {
              url:
                "https://www.etxebide.euskadi.eus/",
            },

            source: {
              name:
                "Etxebide · Gobierno Vasco",

              url:
                "https://www.etxebide.euskadi.eus/",
            },

            order: 30,

            status: "active",
          },
        },
      ];

      /* -----------------------------------------------------
         Upsert
      ----------------------------------------------------- */

      for (const item of items) {
        const existing =
          await ContentItem.findOne({
            "translations.es.title":
              item.data
                .translations.es.title,

            type: item.data.type,

            needIds:
              housingNeed._id,
          });

        if (existing) {
          await ContentItem.findByIdAndUpdate(
            existing._id,
            {
              $set:
                item.data,
            },
            {
              runValidators: true,
            }
          );

          console.log(
            `Updated: ${item.seedKey}`
          );
        } else {
          await ContentItem.create(
            item.data
          );

          console.log(
            `Created: ${item.seedKey}`
          );
        }
      }

      console.log(
        "Content items seeded successfully"
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

void seedContentItems();