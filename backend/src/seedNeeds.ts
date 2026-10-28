import mongoose from "mongoose";
import dotenv from "dotenv";

import Need from "./models/need.model";

dotenv.config();

const needs = [
  {
    code: "housing",
    labels: {
      es: "Vivienda",
      eu: "Etxebizitza",
      ar: "السكن",
      en: "Housing",
    },
    descriptions: {
      es: "Información y recursos relacionados con vivienda, alojamiento, alquiler y ayudas.",
      eu: "Etxebizitzarekin, ostatuarekin, alokairuarekin eta laguntzekin lotutako informazioa eta baliabideak.",
      ar: "معلومات وموارد متعلقة بالسكن والإقامة والإيجار والمساعدات.",
      en: "Information and resources related to housing, accommodation, renting and support.",
    },
    order: 10,
  },

  {
    code: "employment",
    labels: {
      es: "Empleo",
      eu: "Enplegua",
      ar: "العمل",
      en: "Employment",
    },
    descriptions: {
      es: "Orientación laboral, búsqueda de empleo y recursos relacionados con el mercado de trabajo.",
      eu: "Lan-orientazioa, enplegu-bilaketa eta lan-merkatuarekin lotutako baliabideak.",
      ar: "التوجيه المهني والبحث عن العمل والموارد المرتبطة بسوق الشغل.",
      en: "Employment guidance, job search and labour market resources.",
    },
    order: 20,
  },

  {
    code: "education_training",
    labels: {
      es: "Educación y formación",
      eu: "Hezkuntza eta prestakuntza",
      ar: "التعليم والتكوين",
      en: "Education and training",
    },
    descriptions: {
      es: "Educación, formación profesional, cursos y capacitación continua.",
      eu: "Hezkuntza, lanbide-heziketa, ikastaroak eta etengabeko prestakuntza.",
      ar: "التعليم والتكوين المهني والدورات والتدريب المستمر.",
      en: "Education, vocational training, courses and continuous learning.",
    },
    order: 30,
  },

  {
    code: "health",
    labels: {
      es: "Salud",
      eu: "Osasuna",
      ar: "الصحة",
      en: "Health",
    },
    descriptions: {
      es: "Orientación para acceder al sistema sanitario y a los recursos de salud.",
      eu: "Osasun-sistemara eta osasun-baliabideetara sartzeko orientazioa.",
      ar: "إرشاد للوصول إلى النظام الصحي وموارد الرعاية الصحية.",
      en: "Guidance on accessing healthcare services and health resources.",
    },
    order: 40,
  },

  {
    code: "legal_immigration",
    labels: {
      es: "Extranjería y situación legal",
      eu: "Atzerritartasuna eta egoera juridikoa",
      ar: "الهجرة والوضعية القانونية",
      en: "Immigration and legal status",
    },
    descriptions: {
      es: "Información sobre extranjería, residencia, documentación, derechos y situación administrativa.",
      eu: "Atzerritartasunari, egoitzari, dokumentazioari, eskubideei eta administrazio-egoerari buruzko informazioa.",
      ar: "معلومات حول الهجرة والإقامة والوثائق والحقوق والوضعية الإدارية.",
      en: "Information about immigration, residence, documentation, rights and legal status.",
    },
    order: 50,
  },

  {
    code: "administrative_procedures",
    labels: {
      es: "Trámites administrativos",
      eu: "Administrazio-izapideak",
      ar: "الإجراءات الإدارية",
      en: "Administrative procedures",
    },
    descriptions: {
      es: "Orientación sobre trámites, solicitudes, citas y procedimientos administrativos.",
      eu: "Izapide, eskaera, hitzordu eta administrazio-prozedurei buruzko orientazioa.",
      ar: "إرشاد حول المعاملات والطلبات والمواعيد والإجراءات الإدارية.",
      en: "Guidance on applications, appointments and administrative procedures.",
    },
    order: 60,
  },

  {
    code: "social_services",
    labels: {
      es: "Servicios sociales",
      eu: "Gizarte-zerbitzuak",
      ar: "الخدمات الاجتماعية",
      en: "Social services",
    },
    descriptions: {
      es: "Información sobre servicios sociales, ayudas y recursos de apoyo disponibles.",
      eu: "Gizarte-zerbitzuei, laguntzei eta eskuragarri dauden baliabideei buruzko informazioa.",
      ar: "معلومات حول الخدمات الاجتماعية والمساعدات وموارد الدعم المتاحة.",
      en: "Information about social services, benefits and available support resources.",
    },
    order: 70,
  },

  {
    code: "language",
    labels: {
      es: "Idiomas",
      eu: "Hizkuntzak",
      ar: "اللغات",
      en: "Languages",
    },
    descriptions: {
      es: "Aprendizaje de idiomas y recursos para mejorar la comunicación y la integración.",
      eu: "Hizkuntzak ikasteko eta komunikazioa eta integrazioa hobetzeko baliabideak.",
      ar: "تعلم اللغات والموارد التي تساعد على تحسين التواصل والاندماج.",
      en: "Language learning and resources to improve communication and integration.",
    },
    order: 80,
  },

  {
    code: "family",
    labels: {
      es: "Familia",
      eu: "Familia",
      ar: "الأسرة",
      en: "Family",
    },
    descriptions: {
      es: "Recursos relacionados con familia, infancia, conciliación y apoyo familiar.",
      eu: "Familiarekin, haurtzaroarekin, kontziliazioarekin eta familia-laguntzarekin lotutako baliabideak.",
      ar: "موارد متعلقة بالأسرة والأطفال والتوفيق الأسري والدعم العائلي.",
      en: "Resources related to family, children, work-life balance and family support.",
    },
    order: 90,
  },

  {
    code: "community_participation",
    labels: {
      es: "Comunidad y participación",
      eu: "Komunitatea eta parte-hartzea",
      ar: "المجتمع والمشاركة",
      en: "Community and participation",
    },
    descriptions: {
      es: "Recursos para participar en la comunidad, asociaciones, actividades y redes de apoyo.",
      eu: "Komunitatean, elkarteetan, jardueretan eta laguntza-sareetan parte hartzeko baliabideak.",
      ar: "موارد للمشاركة في المجتمع والجمعيات والأنشطة وشبكات الدعم.",
      en: "Resources for community participation, associations, activities and support networks.",
    },
    order: 100,
  },
];

const seedNeeds = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI as string
    );

    console.log("MongoDB connected");

    for (const need of needs) {
      await Need.updateOne(
        {
          code: need.code,
        },
        {
          $set: {
            ...need,
            status: "active",
          },
        },
        {
          upsert: true,
          runValidators: true,
        }
      );
    }

    console.log(
      "Needs seeded successfully"
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

seedNeeds();