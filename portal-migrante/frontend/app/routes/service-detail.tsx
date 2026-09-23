import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../i18n";
import { HttpError } from "../services/api";
import {
  servicesService,
  type Service,
  type ServiceCostType,
  type ServiceDeliveryMode,
  type ServiceLocationSummary,
} from "../services/services.service";

type Locale = "eu" | "es" | "en" | "ar";

type DetailCopy = {
  eyebrow: string;
  back: string;
  loading: string;
  loadError: string;
  notFound: string;
  organization: string;
  category: string;
  delivery: string;
  locations: string;
  noPhysicalLocation: string;
  eligibility: string;
  documents: string;
  noDocuments: string;
  cost: string;
  appointment: string;
  languages: string;
  contact: string;
  website: string;
  verified: string;
  headOffice: string;
  modes: Record<ServiceDeliveryMode, string>;
  costs: Record<ServiceCostType, string>;
};

const copy: Record<Locale, DetailCopy> = {
  es: {
    eyebrow: "Servicio público verificado",
    back: "Volver a servicios",
    loading: "Cargando los detalles del servicio...",
    loadError: "No se pudieron cargar los detalles del servicio.",
    notFound: "Este servicio no existe o todavía no está publicado.",
    organization: "Entidad responsable",
    category: "Categoría",
    delivery: "Modalidad de atención",
    locations: "Sedes donde se ofrece",
    noPhysicalLocation: "Este servicio no requiere una sede física.",
    eligibility: "A quién se dirige",
    documents: "Documentación necesaria",
    noDocuments: "No se ha indicado documentación obligatoria.",
    cost: "Coste",
    appointment: "Cita previa",
    languages: "Idiomas de atención",
    contact: "Contacto",
    website: "Abrir sitio web",
    verified: "Información verificada",
    headOffice: "Sede principal",
    modes: {
      in_person: "Presencial",
      online: "Online",
      phone: "Teléfono",
      mobile: "Atención móvil",
      hybrid: "Híbrida",
    },
    costs: {
      free: "Gratuito",
      paid: "De pago",
      subsidized: "Subvencionado",
      unknown: "Por confirmar",
    },
  },
  ar: {
    eyebrow: "خدمة عامة موثقة",
    back: "العودة إلى الخدمات",
    loading: "جارٍ تحميل تفاصيل الخدمة...",
    loadError: "تعذر تحميل تفاصيل الخدمة.",
    notFound: "هذه الخدمة غير موجودة أو لم تُنشر بعد.",
    organization: "الجهة المسؤولة",
    category: "الفئة",
    delivery: "طريقة تقديم الخدمة",
    locations: "المقار التي تقدم الخدمة",
    noPhysicalLocation: "هذه الخدمة لا تتطلب مقرًا حضوريًا.",
    eligibility: "الفئات المستفيدة",
    documents: "الوثائق المطلوبة",
    noDocuments: "لم تُحدّد وثائق إلزامية.",
    cost: "التكلفة",
    appointment: "موعد مسبق",
    languages: "لغات الاستقبال",
    contact: "التواصل",
    website: "فتح الموقع الإلكتروني",
    verified: "معلومات موثقة",
    headOffice: "المقر الرئيسي",
    modes: {
      in_person: "حضوري",
      online: "عبر الإنترنت",
      phone: "عبر الهاتف",
      mobile: "خدمة متنقلة",
      hybrid: "هجين",
    },
    costs: {
      free: "مجانية",
      paid: "مدفوعة",
      subsidized: "مدعومة",
      unknown: "تحتاج إلى تأكيد",
    },
  },
  en: {
    eyebrow: "Verified public service",
    back: "Back to services",
    loading: "Loading service details...",
    loadError: "Service details could not be loaded.",
    notFound: "This service does not exist or is not published yet.",
    organization: "Responsible organization",
    category: "Category",
    delivery: "Delivery mode",
    locations: "Service locations",
    noPhysicalLocation: "This service does not require a physical location.",
    eligibility: "Who it is for",
    documents: "Required documents",
    noDocuments: "No mandatory documents have been specified.",
    cost: "Cost",
    appointment: "Appointment",
    languages: "Service languages",
    contact: "Contact",
    website: "Open website",
    verified: "Verified information",
    headOffice: "Head office",
    modes: {
      in_person: "In person",
      online: "Online",
      phone: "Phone",
      mobile: "Mobile service",
      hybrid: "Hybrid",
    },
    costs: {
      free: "Free",
      paid: "Paid",
      subsidized: "Subsidized",
      unknown: "To be confirmed",
    },
  },
  eu: {
    eyebrow: "Egiaztatutako zerbitzu publikoa",
    back: "Itzuli zerbitzuetara",
    loading: "Zerbitzuaren xehetasunak kargatzen...",
    loadError: "Ezin izan dira zerbitzuaren xehetasunak kargatu.",
    notFound: "Zerbitzu hau ez dago edo oraindik ez da argitaratu.",
    organization: "Erakunde arduraduna",
    category: "Kategoria",
    delivery: "Arreta modalitatea",
    locations: "Zerbitzua eskaintzen duten egoitzak",
    noPhysicalLocation: "Zerbitzu honek ez du egoitza fisikorik behar.",
    eligibility: "Nori zuzenduta dagoen",
    documents: "Beharrezko dokumentuak",
    noDocuments: "Ez da nahitaezko dokumenturik adierazi.",
    cost: "Kostua",
    appointment: "Aurretiko hitzordua",
    languages: "Arreta hizkuntzak",
    contact: "Kontaktua",
    website: "Ireki webgunea",
    verified: "Egiaztatutako informazioa",
    headOffice: "Egoitza nagusia",
    modes: {
      in_person: "Aurrez aurre",
      online: "Online",
      phone: "Telefonoz",
      mobile: "Arreta mugikorra",
      hybrid: "Hibridoa",
    },
    costs: {
      free: "Doakoa",
      paid: "Ordainpekoa",
      subsidized: "Diruz lagundua",
      unknown: "Baieztatzeko",
    },
  },
};

function populatedLocation(
  value: string | ServiceLocationSummary
): value is ServiceLocationSummary {
  return typeof value !== "string" && value.status === "active";
}

function relationName(value: Service["organizationId"] | Service["categoryId"]) {
  return value && typeof value !== "string" ? value.name : "";
}

function municipalityName(location: ServiceLocationSummary) {
  const municipality = location.municipalityId;
  return municipality && typeof municipality !== "string"
    ? municipality.name
    : "";
}

export default function ServiceDetailPage() {
  const { id = "" } = useParams();
  const { locale, t } = useI18n();
  const activeLocale = (locale as Locale) in copy ? (locale as Locale) : "es";
  const page = copy[activeLocale];
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadService = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await servicesService.getById(id);
      setService(result);
    } catch (caught: unknown) {
      setService(null);
      setError(
        caught instanceof HttpError && caught.status === 404
          ? page.notFound
          : page.loadError
      );
    } finally {
      setLoading(false);
    }
  }, [id, page.loadError, page.notFound]);

  useEffect(() => {
    void loadService();
  }, [loadService]);

  const locations = useMemo(
    () => service?.locationIds.filter(populatedLocation) || [],
    [service]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600" role="status">
            {page.loading}
          </div>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950" role="alert">
            <p className="mb-4 font-semibold">{error || page.notFound}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-slate-950 px-4 py-2 font-bold text-white"
                onClick={() => void loadService()}
              >
                {t("retry")}
              </button>
              <Link to="/servicios" className="rounded-lg border border-amber-400 px-4 py-2 font-bold text-amber-950 no-underline">
                {page.back}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const organization = relationName(service.organizationId);
  const category = relationName(service.categoryId);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/servicios" className="font-bold text-emerald-700 no-underline">
            ← {page.back}
          </Link>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {category && (
              <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
                {category}
              </span>
            )}
            <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800">
              {page.verified}
            </span>
          </div>
          <p className="mt-5 text-sm font-black uppercase tracking-wide text-emerald-700">
            {page.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 whitespace-pre-line text-xl leading-relaxed text-slate-600">
            {service.description}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-6">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{page.delivery}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.deliveryModes.map((mode) => (
                <span key={mode} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                  {page.modes[mode]}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{page.locations}</h2>
            {locations.length > 0 ? (
              <div className="mt-4 grid gap-4">
                {locations.map((location) => {
                  const address = [
                    location.addressLine1,
                    location.postalCode,
                    municipalityName(location),
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <div key={location._id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="mb-0 text-lg font-black text-slate-950">{location.name}</h3>
                        {location.isHeadOffice && (
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
                            {page.headOffice}
                          </span>
                        )}
                      </div>
                      {address && <p className="mt-2 mb-0 text-slate-600">{address}</p>}
                      {location.phone && <p className="mt-2 mb-0 text-slate-600">{location.phone}</p>}
                      {location.email && <p className="mt-1 mb-0 text-slate-600">{location.email}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 mb-0 text-slate-600">{page.noPhysicalLocation}</p>
            )}
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">{page.eligibility}</h2>
            <p className="mt-3 whitespace-pre-line text-slate-600">
              {service.eligibility || t("no_data")}
            </p>
            <h2 className="mt-6 text-xl font-black text-slate-950">{page.documents}</h2>
            {service.requiredDocuments.length > 0 ? (
              <ul className="mt-3 space-y-2 ps-5 text-slate-600">
                {service.requiredDocuments.map((document) => (
                  <li key={document}>{document}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 mb-0 text-slate-600">{page.noDocuments}</p>
            )}
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="mb-0 space-y-4">
              {organization && (
                <div>
                  <dt className="text-sm font-bold text-slate-500">{page.organization}</dt>
                  <dd className="mt-1 font-black text-slate-950">{organization}</dd>
                </div>
              )}
              {category && (
                <div>
                  <dt className="text-sm font-bold text-slate-500">{page.category}</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{category}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-bold text-slate-500">{page.cost}</dt>
                <dd className="mt-1 font-semibold text-slate-950">{page.costs[service.costType]}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-slate-500">{page.appointment}</dt>
                <dd className="mt-1 font-semibold text-slate-950">
                  {service.appointmentRequired ? t("yes") : t("no")}
                </dd>
              </div>
              {service.languages.length > 0 && (
                <div>
                  <dt className="text-sm font-bold text-slate-500">{page.languages}</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{service.languages.join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>

          {(service.phone || service.email || service.website) && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="text-xl font-black text-emerald-950">{page.contact}</h2>
              <div className="mt-4 grid gap-3">
                {service.phone && (
                  <a href={"tel:" + service.phone} className="font-bold text-emerald-800 no-underline">
                    {service.phone}
                  </a>
                )}
                {service.email && (
                  <a href={"mailto:" + service.email} className="break-all font-bold text-emerald-800 no-underline">
                    {service.email}
                  </a>
                )}
                {service.website && (
                  <a href={service.website} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-700 px-4 py-3 text-center font-black text-white no-underline">
                    {page.website}
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
