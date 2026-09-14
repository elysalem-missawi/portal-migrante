import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../i18n";
import ServicePagesNav from "../components/ServicePagesNav";
import { DEMO_FALLBACK_ENABLED } from "../services/api";
import {
  organizationsService,
  type Organization,
} from "../services/organizations.service";
import {
  organizationLocationsService,
  referenceId,
  type OrganizationLocation,
} from "../services/organization-locations.service";

type Locale = "eu" | "es" | "en" | "ar";
type DataSource = "loading" | "api" | "fallback" | "error";

type DirectoryOrganization = {
  id: string;
  name: string;
  territory: string;
  href?: string;
  description?: string;
  contact?: string;
  address?: string;
};

const fallbackOrganizations: DirectoryOrganization[] = [
  {
    id: "zehar",
    name: "Zehar-Errefuxiatuekin",
    territory: "Euskadi",
    href: "https://zehar.eus/",
  },
  {
    id: "cear",
    name: "CEAR Euskadi",
    territory: "Bizkaia / Euskadi",
    href: "https://www.cear-euskadi.org/",
  },
  {
    id: "harresiak",
    name: "Harresiak Apurtuz",
    territory: "Euskadi",
    href: "https://www.harresiakapurtuz.org/",
  },
  {
    id: "sos-gipuzkoa",
    name: "SOS Racismo Gipuzkoa",
    territory: "Gipuzkoa",
    href: "https://sosracismogipuzkoa.org/",
  },
  {
    id: "sos-bizkaia",
    name: "SOS Racismo Bizkaia",
    territory: "Bizkaia",
    href: "https://sosracismobizkaia.org/",
  },
];

const sourceCopy: Record<
  Locale,
  { loading: string; fallback: string; error: string; empty: string }
> = {
  es: {
    loading: "Cargando el directorio actualizado...",
    fallback:
      "No se pudo conectar con el directorio. Mostramos temporalmente la lista de referencia.",
    error:
      "No se pudo conectar con el directorio. No se muestran datos de ejemplo en este entorno.",
    empty: "Todavía no hay asociaciones activas publicadas en el directorio.",
  },
  ar: {
    loading: "جارٍ تحميل الدليل المحدّث...",
    fallback:
      "تعذر الاتصال بالدليل. نعرض مؤقتًا قائمة الجهات المرجعية.",
    error:
      "تعذر الاتصال بالدليل. لا تُعرض بيانات تجريبية في هذه البيئة.",
    empty: "لا توجد جمعيات نشطة منشورة في الدليل حتى الآن.",
  },
  en: {
    loading: "Loading the updated directory...",
    fallback:
      "The directory is unavailable. The reference list is shown temporarily.",
    error:
      "The directory is unavailable. Demo data is not shown in this environment.",
    empty: "There are no active associations published in the directory yet.",
  },
  eu: {
    loading: "Direktorio eguneratua kargatzen...",
    fallback:
      "Ezin izan da direktoriora konektatu. Erreferentzia-zerrenda erakusten da aldi baterako.",
    error:
      "Ezin izan da direktoriora konektatu. Ingurune honetan ez da demo-daturik erakusten.",
    empty: "Oraindik ez dago elkarte aktiborik direktorioan argitaratuta.",
  },
};

const content: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    helpTitle: string;
    beforeTitle: string;
    directoryTitle: string;
    directoryIntro: string;
    visit: string;
    orgFocus: string[];
    helpItems: string[];
    beforeItems: string[];
  }
> = {
  es: {
    eyebrow: "Servicios comunitarios",
    title: "Asociaciones y entidades de apoyo en Euskadi",
    intro:
      "Una primera guía para encontrar organizaciones que acompañan a personas migrantes, refugiadas o en situación de vulnerabilidad en el País Vasco.",
    helpTitle: "Qué tipo de ayuda puedes buscar",
    beforeTitle: "Antes de contactar",
    directoryTitle: "Entidades de referencia",
    directoryIntro:
      "Directorio actualizado de asociaciones activas y sus sedes de atención.",
    visit: "Visitar sitio web",
    orgFocus: [
      "Acogida, atención jurídica, inclusión social y defensa de derechos.",
      "Asilo, refugio, acompañamiento jurídico y apoyo a personas migrantes.",
      "Coordinadora de entidades de apoyo a personas inmigrantes.",
      "Denuncia, sensibilización y apoyo frente al racismo y la xenofobia.",
      "Oficina de información y denuncia, educación antirracista y participación.",
    ],
    helpItems: [
      "Orientación jurídica y extranjería.",
      "Acogida, acompañamiento social y derivación.",
      "Apoyo frente a discriminación, racismo o exclusión.",
      "Voluntariado, participación comunitaria y redes locales.",
    ],
    beforeItems: [
      "Resume tu situación y el tipo de ayuda que necesitas.",
      "Prepara documentos básicos si buscas orientación legal.",
      "Pregunta si atienden con cita previa y en qué idiomas.",
      "Si es urgente, pide derivación a servicios sociales o emergencias.",
    ],
  },
  ar: {
    eyebrow: "خدمات مجتمعية",
    title: "الجمعيات وجهات الدعم في إقليم الباسك",
    intro:
      "دليل أولي للعثور على منظمات ترافق الأشخاص المهاجرين أو اللاجئين أو في وضع هش في إقليم الباسك.",
    helpTitle: "ما نوع المساعدة التي يمكنك البحث عنها",
    beforeTitle: "قبل التواصل",
    directoryTitle: "جهات مرجعية",
    directoryIntro: "دليل محدّث للجمعيات النشطة ومقرات استقبالها.",
    visit: "زيارة الموقع",
    orgFocus: [
      "استقبال، استشارة قانونية، إدماج اجتماعي ودفاع عن الحقوق.",
      "لجوء وحماية ومرافقة قانونية ودعم للمهاجرين.",
      "تنسيقية جهات دعم للأشخاص المهاجرين.",
      "تبليغ وتوعية ودعم ضد العنصرية وكراهية الأجانب.",
      "مكتب معلومات وتبليغ، تعليم ضد العنصرية ومشاركة.",
    ],
    helpItems: [
      "إرشاد قانوني وشؤون الأجانب.",
      "استقبال ومرافقة اجتماعية وإحالة.",
      "دعم ضد التمييز أو العنصرية أو الإقصاء.",
      "تطوع ومشاركة مجتمعية وشبكات محلية.",
    ],
    beforeItems: [
      "لخّص وضعك ونوع المساعدة التي تحتاجها.",
      "حضّر الوثائق الأساسية إذا كنت تبحث عن إرشاد قانوني.",
      "اسأل إن كانت الخدمة بموعد مسبق وبأي لغات.",
      "إذا كان الأمر عاجلًا اطلب إحالة إلى الخدمات الاجتماعية أو الطوارئ.",
    ],
  },
  en: {
    eyebrow: "Community services",
    title: "Associations and support organizations in Euskadi",
    intro:
      "A first guide to organizations that support migrants, refugees, and people in vulnerable situations in the Basque Country.",
    helpTitle: "What kind of help you can look for",
    beforeTitle: "Before contacting",
    directoryTitle: "Reference organizations",
    directoryIntro:
      "An updated directory of active associations and their service locations.",
    visit: "Visit website",
    orgFocus: [
      "Reception, legal attention, social inclusion, and rights defense.",
      "Asylum, refuge, legal accompaniment, and migrant support.",
      "Network of organizations supporting immigrants.",
      "Reporting, awareness, and support against racism and xenophobia.",
      "Information and complaint office, anti-racist education, and participation.",
    ],
    helpItems: [
      "Legal and immigration guidance.",
      "Reception, social accompaniment, and referral.",
      "Support against discrimination, racism, or exclusion.",
      "Volunteering, community participation, and local networks.",
    ],
    beforeItems: [
      "Summarize your situation and the help you need.",
      "Prepare basic documents if you need legal guidance.",
      "Ask whether they work by appointment and in which languages.",
      "If urgent, ask for referral to social services or emergencies.",
    ],
  },
  eu: {
    eyebrow: "Komunitate zerbitzuak",
    title: "Euskadiko elkarteak eta laguntza erakundeak",
    intro:
      "Euskal Herrian migratzaileei, errefuxiatuei edo egoera zaurgarrian daudenei laguntzen dieten erakundeak aurkitzeko lehen gida.",
    helpTitle: "Zer laguntza bila dezakezu",
    beforeTitle: "Harremanetan jarri aurretik",
    directoryTitle: "Erreferentziazko erakundeak",
    directoryIntro:
      "Elkarte aktiboen eta haien arreta-egoitzen direktorio eguneratua.",
    visit: "Webgunea bisitatu",
    orgFocus: [
      "Harrera, arreta juridikoa, gizarte inklusioa eta eskubideen defentsa.",
      "Asiloa, babesa, laguntza juridikoa eta migratzaileentzako babesa.",
      "Etorkinei laguntzen dieten erakundeen koordinadora.",
      "Arrazakeriaren eta xenofobiaren aurkako salaketa, sentsibilizazioa eta laguntza.",
      "Informazio eta salaketa bulegoa, hezkuntza antirrazista eta parte hartzea.",
    ],
    helpItems: [
      "Aholkularitza juridikoa eta atzerritartasuna.",
      "Harrera, gizarte laguntza eta bideratzea.",
      "Diskriminazioaren, arrazakeriaren edo bazterketaren aurkako laguntza.",
      "Boluntariotza, komunitate parte hartzea eta tokiko sareak.",
    ],
    beforeItems: [
      "Laburtu zure egoera eta behar duzun laguntza mota.",
      "Prestatu oinarrizko dokumentuak aholkularitza juridikoa behar baduzu.",
      "Galdetu hitzorduarekin lan egiten duten eta zein hizkuntzatan.",
      "Premiazkoa bada, eskatu gizarte zerbitzuetara edo larrialdietara bideratzea.",
    ],
  },
};

function locationForOrganization(
  organization: Organization,
  locations: OrganizationLocation[]
) {
  return locations
    .filter(
      (location) => referenceId(location.organizationId) === organization._id
    )
    .sort((a, b) => Number(b.isHeadOffice) - Number(a.isHeadOffice))[0];
}

function municipalityName(location?: OrganizationLocation) {
  const municipality = location?.municipalityId;
  if (municipality && typeof municipality !== "string") {
    return municipality.name;
  }
  return "";
}

export default function AsociacionesPage() {
  const { locale, t } = useI18n();
  const activeLocale = (locale as Locale) in content ? (locale as Locale) : "es";
  const page = content[activeLocale];
  const messages = sourceCopy[activeLocale];
  const [organizations, setOrganizations] =
    useState<DirectoryOrganization[]>([]);
  const [source, setSource] = useState<DataSource>("loading");

  const loadDirectory = useCallback(async () => {
    setSource("loading");
    try {
      const [organizationItems, locationItems] = await Promise.all([
        organizationsService.list(),
        organizationLocationsService.list({ status: "active" }),
      ]);

      const directory = organizationItems
          .filter(
            (organization) =>
              organization.type === "association" &&
              organization.status === "active"
          )
          .map((organization) => {
            const location = locationForOrganization(
              organization,
              locationItems
            );
            const address = location
              ? [
                  location.addressLine1,
                  location.addressLine2,
                  location.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")
              : organization.address;

            return {
              id: organization._id,
              name: organization.name,
              territory:
                municipalityName(location) ||
                location?.name ||
                "Euskadi",
              href: organization.website,
              description: organization.description,
              contact:
                location?.email ||
                location?.phone ||
                organization.email ||
                organization.phone,
              address,
            };
          });

      setOrganizations(directory);
      setSource("api");
    } catch {
      if (DEMO_FALLBACK_ENABLED) {
        setOrganizations(fallbackOrganizations);
        setSource("fallback");
      } else {
        setOrganizations([]);
        setSource("error");
      }
    }
  }, []);

  useEffect(() => {
    void loadDirectory();
  }, [loadDirectory]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-xl shadow-sm">
                  🤝
                </span>
                {page.eyebrow}
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                {page.title}
              </h1>
              <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600">
                {page.intro}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
              <img
                src="/images/registration-migrant-travel-hero.png"
                alt=""
                className="h-56 w-full object-cover"
                style={{ objectPosition: "center 35%" }}
              />
            </div>
          </div>
          <ServicePagesNav activeId="asociaciones" />
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4 mb-5">
          {[
            { title: page.helpTitle, items: page.helpItems },
            { title: page.beforeTitle, items: page.beforeItems },
          ].map((block) => (
            <div key={block.title} className="col-12 col-lg-6">
              <div className="bg-white border rounded p-4 h-100">
                <h2 className="h4 fw-bold mb-3">{block.title}</h2>
                <ul className="text-secondary mb-0 ps-3">
                  {block.items.map((item) => (
                    <li key={item} className="mb-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <h2 className="h4 fw-bold text-vitoria-black mb-1">
          {page.directoryTitle}
        </h2>
        <p className="text-secondary mb-3">{page.directoryIntro}</p>

        {source === "loading" && (
          <div className="alert alert-light border">{messages.loading}</div>
        )}
        {source === "fallback" && (
          <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-3">
            <span>{messages.fallback}</span>
            <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => void loadDirectory()}>
              {t("retry")}
            </button>
          </div>
        )}
        {source === "error" && (
          <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3" role="alert">
            <span>{messages.error}</span>
            <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => void loadDirectory()}>
              {t("retry")}
            </button>
          </div>
        )}

        {organizations.length > 0 ? (
          <div className="row g-3">
            {organizations.map((organization, index) => {
              const body = (
                <>
                  <span className="small fw-semibold text-success mb-2">
                    {organization.territory}
                  </span>
                  <h3 className="h5 fw-bold text-vitoria-black mb-2">
                    {organization.name}
                  </h3>
                  <p className="text-secondary small mb-3">
                    {organization.description ||
                      page.orgFocus[index % page.orgFocus.length]}
                  </p>
                  {organization.address && (
                    <span className="text-secondary small mb-2">
                      {organization.address}
                    </span>
                  )}
                  <span className="mt-auto text-primary fw-semibold small">
                    {organization.href
                      ? page.visit
                      : organization.contact || t("contact")}
                  </span>
                </>
              );

              return (
                <div
                  key={organization.id}
                  className="col-12 col-md-6 col-xl-4"
                >
                  {organization.href ? (
                    <a
                      href={organization.href}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white border rounded p-4 h-100 d-flex flex-column text-decoration-none"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="bg-white border rounded p-4 h-100 d-flex flex-column">
                      {body}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : source === "api" ? (
          <div className="bg-white border rounded p-4 text-secondary">
            {messages.empty}
          </div>
        ) : null}
      </section>
    </main>
  );
}
