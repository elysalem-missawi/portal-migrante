import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";
import {
  serviceCategoriesService,
  servicesService,
} from "../services/services.service";
import type {
  Service,
  ServiceCategory as ApiServiceCategory,
  ServiceCostType,
} from "../services/services.service";

type Locale = "eu" | "es" | "en" | "ar";
type DataSource = "loading" | "api" | "fallback";

type ServiceCategoryCard = {
  id: string;
  title: string;
  icon: string;
  path?: string;
  description: string;
  available: boolean;
  serviceCount: number;
};

const categoryAliases: Record<string, string[]> = {
  salud: ["salud", "health", "healthcare"],
  vivienda: ["vivienda", "housing", "accommodation"],
  empleo: ["empleo", "work", "employment", "job"],
  educacion: ["educacion", "education", "training"],
  legal: ["legal", "juridico", "jurídico", "immigration"],
  ayuntamientos: ["ayuntamientos", "municipality", "municipalities"],
  asociaciones: ["asociaciones", "association", "associations", "community"],
};

const pageCopy: Record<
  Locale,
  {
    liveTitle: string;
    liveIntro: string;
    loading: string;
    fallback: string;
    organization: string;
    appointment: string;
    website: string;
    verified: string;
    noPublished: string;
    costs: Record<ServiceCostType, string>;
  }
> = {
  es: {
    liveTitle: "Servicios publicados",
    liveIntro:
      "Servicios activos ofrecidos por organizaciones y sedes registradas en el portal.",
    loading: "Cargando servicios actualizados...",
    fallback:
      "No se pudo conectar con el catálogo. Las guías generales siguen disponibles.",
    organization: "Entidad",
    appointment: "Cita previa",
    website: "Abrir sitio web",
    verified: "Verificado",
    noPublished: "Todavía no hay servicios activos publicados.",
    costs: {
      free: "Gratuito",
      paid: "De pago",
      subsidized: "Subvencionado",
      unknown: "Coste por confirmar",
    },
  },
  ar: {
    liveTitle: "الخدمات المنشورة",
    liveIntro:
      "الخدمات النشطة التي تقدمها المنظمات والمقرات المسجلة في البوابة.",
    loading: "جارٍ تحميل الخدمات المحدّثة...",
    fallback:
      "تعذر الاتصال بدليل الخدمات. ما زالت الأدلة العامة متاحة.",
    organization: "الجهة",
    appointment: "بموعد مسبق",
    website: "فتح الموقع",
    verified: "موثّق",
    noPublished: "لا توجد خدمات نشطة منشورة حتى الآن.",
    costs: {
      free: "مجانية",
      paid: "مدفوعة",
      subsidized: "مدعومة",
      unknown: "التكلفة تحتاج إلى تأكيد",
    },
  },
  en: {
    liveTitle: "Published services",
    liveIntro:
      "Active services offered by organizations and locations registered in the portal.",
    loading: "Loading updated services...",
    fallback:
      "The service catalogue is unavailable. General guides remain available.",
    organization: "Organization",
    appointment: "Appointment required",
    website: "Open website",
    verified: "Verified",
    noPublished: "There are no active published services yet.",
    costs: {
      free: "Free",
      paid: "Paid",
      subsidized: "Subsidized",
      unknown: "Cost to be confirmed",
    },
  },
  eu: {
    liveTitle: "Argitaratutako zerbitzuak",
    liveIntro:
      "Atarian erregistratutako erakundeek eta egoitzek eskaintzen dituzten zerbitzu aktiboak.",
    loading: "Zerbitzu eguneratuak kargatzen...",
    fallback:
      "Ezin izan da zerbitzu-katalogora konektatu. Gida orokorrak erabilgarri daude.",
    organization: "Erakundea",
    appointment: "Hitzordua behar da",
    website: "Webgunea ireki",
    verified: "Egiaztatua",
    noPublished: "Oraindik ez dago zerbitzu aktiborik argitaratuta.",
    costs: {
      free: "Doakoa",
      paid: "Ordainpekoa",
      subsidized: "Diruz lagundua",
      unknown: "Kostua baieztatzeko",
    },
  },
};

function normalized(value: string) {
  return value.trim().toLowerCase();
}

function canonicalCategory(code: string) {
  const candidate = normalized(code);
  const match = Object.entries(categoryAliases).find(([, aliases]) =>
    aliases.includes(candidate)
  );
  return match?.[0] || candidate;
}

function populatedCategory(service: Service) {
  const category = service.categoryId;
  return category && typeof category !== "string" ? category : undefined;
}

function serviceMatchesCategory(
  service: Service,
  categoryCode: string,
  categories: ApiServiceCategory[]
) {
  const expected = canonicalCategory(categoryCode);
  const category = populatedCategory(service);

  if (category) {
    return canonicalCategory(category.code) === expected;
  }

  if (typeof service.categoryId === "string") {
    const match = categories.find(
      (item) => item._id === service.categoryId
    );
    if (match) return canonicalCategory(match.code) === expected;
  }

  return service.category
    ? canonicalCategory(service.category) === expected
    : false;
}

function organizationName(service: Service) {
  const organization = service.organizationId;
  return organization && typeof organization !== "string"
    ? organization.name
    : "";
}

function locationName(service: Service) {
  const populated = service.locationIds.find(
    (location) => typeof location !== "string"
  );
  if (!populated || typeof populated === "string") return "";

  const municipality = populated.municipalityId;
  const municipalityName =
    municipality && typeof municipality !== "string"
      ? municipality.name
      : "";

  return [populated.name, municipalityName].filter(Boolean).join(" · ");
}

export default function Servicios() {
  const { t, locale } = useI18n();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("c");
  const activeLocale = (locale as Locale) in pageCopy ? (locale as Locale) : "es";
  const copy = pageCopy[activeLocale];
  const [apiCategories, setApiCategories] = useState<ApiServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [source, setSource] = useState<DataSource>("loading");

  useEffect(() => {
    let active = true;

    Promise.all([
      serviceCategoriesService.list(),
      servicesService.list(),
    ])
      .then(([categoryItems, serviceItems]) => {
        if (!active) return;
        setApiCategories(categoryItems);
        setServices(serviceItems);
        setSource("api");
      })
      .catch(() => {
        if (!active) return;
        setApiCategories([]);
        setServices([]);
        setSource("fallback");
      });

    return () => {
      active = false;
    };
  }, []);

  const serviceDescriptions: Record<string, Record<string, string>> = {
    es: {
      salud: "Centros de salud, hospitales, tarjeta sanitaria y urgencias.",
      vivienda:
        "Alquiler público, ayudas, portales privados y consejos para evitar riesgos.",
      empleo:
        "Lanbide, orientación laboral, formación y pasos para buscar trabajo.",
      educacion:
        "EPA, idiomas, formación, homologación y universidades.",
      legal:
        "Residencia, extranjería, derechos básicos y asesoramiento jurídico.",
      ayuntamientos:
        "Padrón, servicios sociales municipales y orientación cercana.",
      asociaciones:
        "Entidades sociales que ofrecen apoyo, acompañamiento y derivación.",
    },
    ar: {
      salud: "المراكز الصحية، المستشفيات، البطاقة الصحية والطوارئ.",
      vivienda:
        "الإيجار العمومي، المساعدات، مواقع البحث ونصائح لتجنب المخاطر.",
      empleo:
        "Lanbide، التوجيه المهني، التكوين وخطوات البحث عن العمل.",
      educacion:
        "تعليم الكبار، اللغات، التكوين، معادلة الشهادات والجامعات.",
      legal:
        "الإقامة، شؤون الأجانب، الحقوق الأساسية والاستشارة القانونية.",
      ayuntamientos:
        "التسجيل البلدي، الخدمات الاجتماعية البلدية والتوجيه القريب.",
      asociaciones:
        "جمعيات تقدم الدعم والمرافقة والإحالة إلى الموارد المناسبة.",
    },
    en: {
      salud: "Health centres, hospitals, health card, and emergencies.",
      vivienda:
        "Public rent, support, private portals, and advice to avoid risks.",
      empleo:
        "Lanbide, job guidance, training, and steps to look for work.",
      educacion:
        "Adult education, languages, training, recognition, and universities.",
      legal:
        "Residence, immigration, basic rights, and legal guidance.",
      ayuntamientos:
        "Municipal registration, local social services, and nearby guidance.",
      asociaciones:
        "Social organizations offering support, accompaniment, and referrals.",
    },
    eu: {
      salud:
        "Osasun zentroak, ospitaleak, osasun txartela eta larrialdiak.",
      vivienda:
        "Alokairu publikoa, laguntzak, atari pribatuak eta arriskuak saihesteko aholkuak.",
      empleo:
        "Lanbide, lan orientazioa, prestakuntza eta lana bilatzeko urratsak.",
      educacion:
        "Helduen hezkuntza, hizkuntzak, prestakuntza, homologazioa eta unibertsitateak.",
      legal:
        "Egoitza, atzerritartasuna, oinarrizko eskubideak eta aholkularitza juridikoa.",
      ayuntamientos:
        "Errolda, udal gizarte zerbitzuak eta gertuko orientazioa.",
      asociaciones:
        "Laguntza, lagun egitea eta bideratzea eskaintzen duten elkarteak.",
    },
  };

  const descriptions =
    serviceDescriptions[locale] || serviceDescriptions.es;

  const baseCategories: Omit<ServiceCategoryCard, "serviceCount">[] = [
    {
      id: "salud",
      title: t("f_health"),
      icon: "💗",
      path: "/servicios/salud",
      description: descriptions.salud,
      available: true,
    },
    {
      id: "vivienda",
      title: t("f_housing"),
      icon: "🏠",
      path: "/servicios/vivienda",
      description: descriptions.vivienda,
      available: true,
    },
    {
      id: "empleo",
      title: t("f_work"),
      icon: "💼",
      path: "/servicios/empleo",
      description: descriptions.empleo,
      available: true,
    },
    {
      id: "educacion",
      title: t("f_education"),
      icon: "🎓",
      path: "/servicios/educacion",
      description: descriptions.educacion,
      available: true,
    },
    {
      id: "legal",
      title: t("f_legal"),
      icon: "⚖️",
      path: "/servicios/legal",
      description: descriptions.legal,
      available: true,
    },
    {
      id: "ayuntamientos",
      title: t("f_municipalities"),
      icon: "🏛️",
      path: "/ayuntamientos",
      description: descriptions.ayuntamientos,
      available: true,
    },
    {
      id: "asociaciones",
      title: t("f_charities"),
      icon: "🤝",
      path: "/servicios/asociaciones",
      description: descriptions.asociaciones,
      available: true,
    },
  ];

  const categories = useMemo<ServiceCategoryCard[]>(() => {
    const merged = baseCategories.map((base) => {
      const apiCategory = apiCategories.find(
        (item) => canonicalCategory(item.code) === base.id
      );
      const count = services.filter((service) =>
        serviceMatchesCategory(service, base.id, apiCategories)
      ).length;

      return {
        ...base,
        title: apiCategory?.name || base.title,
        description: apiCategory?.description || base.description,
        serviceCount: count,
      };
    });

    const knownCodes = new Set(merged.map((item) => item.id));
    const additional = apiCategories
      .filter(
        (item) => !knownCodes.has(canonicalCategory(item.code))
      )
      .map((item) => {
        const code = canonicalCategory(item.code);
        return {
          id: code,
          title: item.name,
          icon: "📌",
          path: "/servicios?c=" + encodeURIComponent(code),
          description: item.description || "",
          available: true,
          serviceCount: services.filter((service) =>
            serviceMatchesCategory(service, code, apiCategories)
          ).length,
        };
      });

    return [...merged, ...additional];
  }, [apiCategories, baseCategories, services]);

  const visibleCategories = selectedCategory
    ? categories.filter(
        (category) =>
          canonicalCategory(category.id) ===
          canonicalCategory(selectedCategory)
      )
    : categories;

  const visibleServices = selectedCategory
    ? services.filter((service) =>
        serviceMatchesCategory(
          service,
          selectedCategory,
          apiCategories
        )
      )
    : services;

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-emerald-700">
              {t("cta_services")}
            </p>
            <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {t("services_title_1")} {t("services_title_2")}
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600">
              {t("services_intro")}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        {source === "loading" && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
            {copy.loading}
          </div>
        )}
        {source === "fallback" && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            {copy.fallback}
          </div>
        )}

        {selectedCategory && visibleCategories.length === 0 && (
          <div className="alert alert-warning" role="alert">
            {t("services_unknown_category")}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleCategories.map((category) => {
            const card = (
              <article className="h-full min-h-[220px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-200 group-hover:border-emerald-300 group-hover:shadow-md">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-3xl">
                  <span aria-hidden="true">{category.icon}</span>
                </div>

                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  {category.title}
                </h2>

                <p className="text-base text-slate-600 mb-7 leading-relaxed">
                  {category.description}
                </p>

                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <span className="text-base font-black text-emerald-700">
                    {t("explore_services")}
                  </span>
                  <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                    {source === "api" && category.serviceCount > 0
                      ? category.serviceCount + " " + t("available").toLowerCase()
                      : t("available").toLowerCase()}
                  </span>
                </div>
              </article>
            );

            return (
              <div key={category.id}>
                {category.available && category.path ? (
                  <Link
                    to={category.path}
                    className="group block h-full no-underline"
                  >
                    {card}
                  </Link>
                ) : (
                  <div className="h-full opacity-75">{card}</div>
                )}
              </div>
            );
          })}
        </div>

        {source === "api" && (
          <section className="mt-12 border-t border-slate-200 pt-10">
            <h2 className="text-3xl font-black text-slate-950">
              {copy.liveTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              {copy.liveIntro}
            </p>

            {visibleServices.length > 0 ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleServices.map((service) => {
                  const category = populatedCategory(service);
                  const organization = organizationName(service);
                  const location = locationName(service);

                  return (
                    <article
                      key={service._id}
                      className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {category?.name && (
                          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                            {category.name}
                          </span>
                        )}
                        {service.verificationStatus === "verified" && (
                          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">
                            {copy.verified}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-slate-950">
                        {service.title}
                      </h3>
                      <p className="mt-3 line-clamp-4 text-slate-600">
                        {service.description}
                      </p>

                      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                        {organization && (
                          <p className="mb-0">
                            <strong>{copy.organization}:</strong>{" "}
                            {organization}
                          </p>
                        )}
                        {location && <p className="mb-0">{location}</p>}
                        <p className="mb-0">
                          {copy.costs[service.costType]}
                          {service.appointmentRequired
                            ? " · " + copy.appointment
                            : ""}
                        </p>
                      </div>

                      {service.website && (
                        <a
                          href={service.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 font-black text-emerald-700 no-underline"
                        >
                          {copy.website}
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-slate-600">
                {copy.noPublished}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
