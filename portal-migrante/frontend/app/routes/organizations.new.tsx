import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import {
  organizationsService,
} from "../services/organizations.service";
import type {
  Organization,
  OrganizationType,
} from "../services/organizations.service";
import {
  organizationLocationsService,
} from "../services/organization-locations.service";
import type {
  OpeningHour,
} from "../services/organization-locations.service";
import {
  municipalitiesService,
} from "../services/municipalities.service";
import type {
  Municipality,
} from "../services/municipalities.service";

type Locale = "eu" | "es" | "en" | "ar";

type OrganizationForm = {
  type: OrganizationType;
  name: string;
  legalName: string;
  registrationNumber: string;
  description: string;
  website: string;
  languages: string;
  logo: string;
};

type LocationForm = {
  municipalityId: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  phone: string;
  email: string;
  weekdaysOpenAt: string;
  weekdaysCloseAt: string;
};

const copy: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    organizationStep: string;
    locationStep: string;
    organizationSection: string;
    locationSection: string;
    legalName: string;
    registrationNumber: string;
    optional: string;
    continue: string;
    municipality: string;
    municipalityPlaceholder: string;
    locationName: string;
    locationNameHelp: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    weekdayHours: string;
    opensAt: string;
    closesAt: string;
    reviewTitle: string;
    reviewText: string;
    organizationCreated: string;
    organizationCreatedText: string;
    headOfficeText: string;
    createHeadOffice: string;
    finishLater: string;
    completedTitle: string;
    completedText: string;
    goToOrganizations: string;
    municipalitiesError: string;
    hoursError: string;
    alava: string;
    bizkaia: string;
    gipuzkoa: string;
  }
> = {
  es: {
    title: "Registrar una organización",
    subtitle:
      "Primero registramos la entidad y después su sede principal. Podrás añadir más sedes cuando la organización esté creada.",
    organizationStep: "1. Organización",
    locationStep: "2. Sede principal",
    organizationSection: "Datos de la organización",
    locationSection: "Datos de la sede principal",
    legalName: "Nombre legal",
    registrationNumber: "Número de registro",
    optional: "Opcional",
    continue: "Guardar y continuar",
    municipality: "Municipio",
    municipalityPlaceholder: "Selecciona un municipio",
    locationName: "Nombre de la sede",
    locationNameHelp:
      "Por ejemplo: Sede central, Oficina de Vitoria o Centro de atención.",
    addressLine1: "Dirección",
    addressLine2: "Información adicional de la dirección",
    postalCode: "Código postal",
    weekdayHours: "Horario de lunes a viernes",
    opensAt: "Apertura",
    closesAt: "Cierre",
    reviewTitle: "Revisión y verificación",
    reviewText:
      "La nueva organización se guardará como pendiente. Solo la administración de la plataforma puede activarla y marcarla como verificada.",
    organizationCreated: "Organización guardada",
    organizationCreatedText:
      "La entidad ya existe y tú has quedado registrado como su administrador. Completa ahora la sede principal.",
    headOfficeText:
      "Esta será la primera sede y el sistema la marcará automáticamente como sede principal.",
    createHeadOffice: "Guardar sede principal",
    finishLater: "Terminar más tarde",
    completedTitle: "Registro completado",
    completedText:
      "La organización y su sede principal se guardaron correctamente. Permanecerán pendientes hasta la revisión de la plataforma.",
    goToOrganizations: "Ver mis organizaciones",
    municipalitiesError:
      "No se pudo cargar la lista de municipios. Inténtalo de nuevo antes de guardar la sede.",
    hoursError:
      "Indica tanto la hora de apertura como la de cierre, o deja ambas vacías.",
    alava: "Álava",
    bizkaia: "Bizkaia",
    gipuzkoa: "Gipuzkoa",
  },
  ar: {
    title: "تسجيل منظمة",
    subtitle:
      "نسجل أولًا بيانات الجهة، ثم مقرها الرئيسي. ويمكن إضافة مقرات أخرى بعد إنشاء المنظمة.",
    organizationStep: "1. المنظمة",
    locationStep: "2. المقر الرئيسي",
    organizationSection: "بيانات المنظمة",
    locationSection: "بيانات المقر الرئيسي",
    legalName: "الاسم القانوني",
    registrationNumber: "رقم التسجيل",
    optional: "اختياري",
    continue: "حفظ ومواصلة",
    municipality: "البلدية",
    municipalityPlaceholder: "اختر البلدية",
    locationName: "اسم المقر",
    locationNameHelp:
      "مثال: المقر المركزي، مكتب فيتوريا أو مركز الاستقبال.",
    addressLine1: "العنوان",
    addressLine2: "معلومات إضافية عن العنوان",
    postalCode: "الرمز البريدي",
    weekdayHours: "ساعات العمل من الاثنين إلى الجمعة",
    opensAt: "وقت الفتح",
    closesAt: "وقت الإغلاق",
    reviewTitle: "المراجعة والتوثيق",
    reviewText:
      "ستُحفظ المنظمة الجديدة بحالة قيد المراجعة. إدارة المنصة وحدها يمكنها تفعيلها ووضع علامة موثّقة عليها.",
    organizationCreated: "تم حفظ المنظمة",
    organizationCreatedText:
      "أصبحت الجهة مسجلة وأصبحت أنت مديرها. أكمل الآن بيانات المقر الرئيسي.",
    headOfficeText:
      "سيكون هذا أول مقر، وسيضعه النظام تلقائيًا كمقر رئيسي.",
    createHeadOffice: "حفظ المقر الرئيسي",
    finishLater: "الإكمال لاحقًا",
    completedTitle: "اكتمل التسجيل",
    completedText:
      "تم حفظ المنظمة ومقرها الرئيسي بنجاح. وستبقيان قيد المراجعة إلى أن تتحقق منهما إدارة المنصة.",
    goToOrganizations: "عرض منظماتي",
    municipalitiesError:
      "تعذر تحميل قائمة البلديات. حاول مرة أخرى قبل حفظ المقر.",
    hoursError:
      "أدخل وقت الفتح والإغلاق معًا، أو اترك الحقلين فارغين.",
    alava: "ألافا",
    bizkaia: "بيثكايا",
    gipuzkoa: "غيبوثكوا",
  },
  en: {
    title: "Register an organization",
    subtitle:
      "First register the organization, then its head office. More locations can be added after creation.",
    organizationStep: "1. Organization",
    locationStep: "2. Head office",
    organizationSection: "Organization details",
    locationSection: "Head office details",
    legalName: "Legal name",
    registrationNumber: "Registration number",
    optional: "Optional",
    continue: "Save and continue",
    municipality: "Municipality",
    municipalityPlaceholder: "Select a municipality",
    locationName: "Location name",
    locationNameHelp:
      "For example: Head office, Vitoria office, or Support centre.",
    addressLine1: "Address",
    addressLine2: "Additional address information",
    postalCode: "Postal code",
    weekdayHours: "Monday to Friday hours",
    opensAt: "Opens",
    closesAt: "Closes",
    reviewTitle: "Review and verification",
    reviewText:
      "The new organization will be saved as pending. Only platform administrators can activate and verify it.",
    organizationCreated: "Organization saved",
    organizationCreatedText:
      "The organization now exists and you are registered as its administrator. Complete the head office next.",
    headOfficeText:
      "This is the first location, so the system will automatically mark it as the head office.",
    createHeadOffice: "Save head office",
    finishLater: "Finish later",
    completedTitle: "Registration completed",
    completedText:
      "The organization and its head office were saved. They remain pending until the platform review.",
    goToOrganizations: "View my organizations",
    municipalitiesError:
      "The municipality list could not be loaded. Try again before saving the location.",
    hoursError:
      "Enter both opening and closing times, or leave both fields empty.",
    alava: "Álava",
    bizkaia: "Bizkaia",
    gipuzkoa: "Gipuzkoa",
  },
  eu: {
    title: "Erakunde bat erregistratu",
    subtitle:
      "Lehenik erakundea erregistratuko dugu, eta gero egoitza nagusia. Ondoren egoitza gehiago gehitu ahal izango dira.",
    organizationStep: "1. Erakundea",
    locationStep: "2. Egoitza nagusia",
    organizationSection: "Erakundearen datuak",
    locationSection: "Egoitza nagusiaren datuak",
    legalName: "Legezko izena",
    registrationNumber: "Erregistro-zenbakia",
    optional: "Aukerakoa",
    continue: "Gorde eta jarraitu",
    municipality: "Udalerria",
    municipalityPlaceholder: "Hautatu udalerri bat",
    locationName: "Egoitzaren izena",
    locationNameHelp:
      "Adibidez: Egoitza nagusia, Gasteizko bulegoa edo Arreta-zentroa.",
    addressLine1: "Helbidea",
    addressLine2: "Helbideari buruzko informazio gehigarria",
    postalCode: "Posta-kodea",
    weekdayHours: "Astelehenetik ostiralera",
    opensAt: "Irekiera",
    closesAt: "Itxiera",
    reviewTitle: "Berrikuspena eta egiaztapena",
    reviewText:
      "Erakunde berria zain egoeran gordeko da. Plataformako administrazioak bakarrik aktibatu eta egiaztatu ahal izango du.",
    organizationCreated: "Erakundea gordeta",
    organizationCreatedText:
      "Erakundea sortu da eta administratzaile gisa erregistratu zara. Osatu orain egoitza nagusia.",
    headOfficeText:
      "Lehen egoitza denez, sistemak automatikoki egoitza nagusi gisa markatuko du.",
    createHeadOffice: "Gorde egoitza nagusia",
    finishLater: "Geroago amaitu",
    completedTitle: "Erregistroa osatuta",
    completedText:
      "Erakundea eta egoitza nagusia gorde dira. Plataformaren berrikuspenaren zain geratuko dira.",
    goToOrganizations: "Ikusi nire erakundeak",
    municipalitiesError:
      "Ezin izan da udalerrien zerrenda kargatu. Saiatu berriro egoitza gorde aurretik.",
    hoursError:
      "Adierazi irekiera- eta itxiera-orduak, edo utzi biak hutsik.",
    alava: "Araba",
    bizkaia: "Bizkaia",
    gipuzkoa: "Gipuzkoa",
  },
};

const organizationInitialState: OrganizationForm = {
  type: "association",
  name: "",
  legalName: "",
  registrationNumber: "",
  description: "",
  website: "",
  languages: "es, eu",
  logo: "",
};

const locationInitialState: LocationForm = {
  municipalityId: "",
  name: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  phone: "",
  email: "",
  weekdaysOpenAt: "",
  weekdaysCloseAt: "",
};

function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return slug || "organization-" + Date.now();
}

function optional(value: string) {
  const clean = value.trim();
  return clean || undefined;
}

function languageCodes(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function openingHours(form: LocationForm): OpeningHour[] {
  if (!form.weekdaysOpenAt || !form.weekdaysCloseAt) return [];

  return [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ].map((day) => ({
    day: day as OpeningHour["day"],
    opensAt: form.weekdaysOpenAt,
    closesAt: form.weekdaysCloseAt,
    closed: false,
  }));
}

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const activeLocale = (locale as Locale) in copy ? (locale as Locale) : "es";
  const page = copy[activeLocale];

  const [organizationForm, setOrganizationForm] =
    useState<OrganizationForm>(organizationInitialState);
  const [locationForm, setLocationForm] =
    useState<LocationForm>(locationInitialState);
  const [createdOrganization, setCreatedOrganization] =
    useState<Organization | null>(null);
  const [municipalities, setMunicipalities] =
    useState<Municipality[]>([]);
  const [municipalitiesLoading, setMunicipalitiesLoading] =
    useState(true);
  const [municipalitiesError, setMunicipalitiesError] =
    useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let active = true;

    municipalitiesService
      .list()
      .then((items) => {
        if (active) setMunicipalities(items);
      })
      .catch(() => {
        if (active) setMunicipalitiesError(page.municipalitiesError);
      })
      .finally(() => {
        if (active) setMunicipalitiesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page.municipalitiesError]);

  const setOrganizationField = <K extends keyof OrganizationForm>(
    field: K,
    value: OrganizationForm[K]
  ) => {
    setOrganizationForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const setLocationField = <K extends keyof LocationForm>(
    field: K,
    value: LocationForm[K]
  ) => {
    setLocationForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitOrganization = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const organization = await organizationsService.create({
        type: organizationForm.type,
        name: organizationForm.name.trim(),
        legalName: optional(organizationForm.legalName),
        registrationNumber: optional(
          organizationForm.registrationNumber
        ),
        slug: slugify(organizationForm.name),
        description: optional(organizationForm.description),
        website: optional(organizationForm.website),
        languages: languageCodes(organizationForm.languages),
        logo: optional(organizationForm.logo),
      });

      setCreatedOrganization(organization);
      setLocationForm((current) => ({
        ...current,
        name: current.name || organization.name,
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : t("organization_create_error")
      );
    } finally {
      setSaving(false);
    }
  };

  const submitLocation = async (event: FormEvent) => {
    event.preventDefault();
    if (!createdOrganization || saving) return;

    const hasOpening = Boolean(locationForm.weekdaysOpenAt);
    const hasClosing = Boolean(locationForm.weekdaysCloseAt);
    if (hasOpening !== hasClosing) {
      setError(page.hoursError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await organizationLocationsService.create({
        organizationId: createdOrganization._id,
        municipalityId: locationForm.municipalityId,
        name: locationForm.name.trim(),
        slug: slugify(locationForm.name),
        addressLine1: locationForm.addressLine1.trim(),
        addressLine2: optional(locationForm.addressLine2),
        postalCode: optional(locationForm.postalCode),
        phone: optional(locationForm.phone),
        email: optional(locationForm.email),
        openingHours: openingHours(locationForm),
        isHeadOffice: true,
        status: "active",
      });

      setCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : t("organization_create_error")
      );
    } finally {
      setSaving(false);
    }
  };

  const territoryLabel = (
    territory: Municipality["territory"]
  ) => page[territory];

  const municipalitiesByTerritory = (
    ["alava", "bizkaia", "gipuzkoa"] as const
  ).map((territory) => ({
    territory,
    items: municipalities.filter(
      (municipality) => municipality.territory === territory
    ),
  }));

  if (completed && createdOrganization) {
    return (
      <main className="min-h-screen bg-slate-50 py-5">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-lg-5 text-center">
              <div
                className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success"
                style={{ width: 72, height: 72, fontSize: 34 }}
                aria-hidden="true"
              >
                ✓
              </div>
              <h1 className="h2 fw-bold mb-3">
                {page.completedTitle}
              </h1>
              <p className="text-secondary mb-2">
                {createdOrganization.name}
              </p>
              <p className="text-secondary mb-4">
                {page.completedText}
              </p>
              <Link
                to="/organizations"
                className="btn btn-success btn-lg px-4"
              >
                {page.goToOrganizations}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const onLocationStep = Boolean(createdOrganization);

  return (
    <main className="min-h-screen bg-slate-50 py-4 py-lg-5">
      <div className="container" style={{ maxWidth: 980 }}>
        <div className="mb-4">
          <h1 className="h2 fw-bold mb-2">{page.title}</h1>
          <p className="text-secondary mb-0">{page.subtitle}</p>
        </div>

        <div className="row g-2 mb-4" aria-label="Progress">
          <div className="col-6">
            <div
              className={
                "rounded border p-3 fw-semibold " +
                (onLocationStep
                  ? "border-success bg-success-subtle text-success-emphasis"
                  : "border-dark bg-dark text-white")
              }
            >
              {onLocationStep ? "✓ " : ""}
              {page.organizationStep}
            </div>
          </div>
          <div className="col-6">
            <div
              className={
                "rounded border p-3 fw-semibold " +
                (onLocationStep
                  ? "border-dark bg-dark text-white"
                  : "border-secondary-subtle bg-white text-secondary")
              }
            >
              {page.locationStep}
            </div>
          </div>
        </div>

        {!onLocationStep ? (
          <form
            onSubmit={submitOrganization}
            className="card border-0 shadow-sm"
          >
            <div className="card-body p-4 p-lg-5">
              <h2 className="h4 fw-bold mb-4">
                {page.organizationSection}
              </h2>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("type")} *
                  </label>
                  <select
                    className="form-select"
                    value={organizationForm.type}
                    onChange={(event) =>
                      setOrganizationField(
                        "type",
                        event.target.value as OrganizationType
                      )
                    }
                    required
                  >
                    <option value="municipality">
                      {t("organization_type_municipality")}
                    </option>
                    <option value="health_center">
                      {t("organization_type_health_center")}
                    </option>
                    <option value="association">
                      {t("organization_type_association")}
                    </option>
                    <option value="social_services_office">
                      {t(
                        "organization_type_social_services_office"
                      )}
                    </option>
                    <option value="employment_office">
                      {t("organization_type_employment_office")}
                    </option>
                    <option value="legal_office">
                      {t("organization_type_legal_office")}
                    </option>
                    <option value="education_center">
                      {t("organization_type_education_center")}
                    </option>
                    <option value="community_center">
                      {t("organization_type_community_center")}
                    </option>
                    <option value="other">
                      {t("organization_type_other")}
                    </option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("name")} *
                  </label>
                  <input
                    className="form-control"
                    value={organizationForm.name}
                    onChange={(event) =>
                      setOrganizationField(
                        "name",
                        event.target.value
                      )
                    }
                    maxLength={160}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {page.legalName}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    className="form-control"
                    value={organizationForm.legalName}
                    onChange={(event) =>
                      setOrganizationField(
                        "legalName",
                        event.target.value
                      )
                    }
                    maxLength={200}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {page.registrationNumber}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    className="form-control"
                    value={organizationForm.registrationNumber}
                    onChange={(event) =>
                      setOrganizationField(
                        "registrationNumber",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    {t("description")}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={organizationForm.description}
                    onChange={(event) =>
                      setOrganizationField(
                        "description",
                        event.target.value
                      )
                    }
                    maxLength={4000}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("website")}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={organizationForm.website}
                    onChange={(event) =>
                      setOrganizationField(
                        "website",
                        event.target.value
                      )
                    }
                    placeholder="https://"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("logo_url")}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={organizationForm.logo}
                    onChange={(event) =>
                      setOrganizationField(
                        "logo",
                        event.target.value
                      )
                    }
                    placeholder="https://"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    {t("languages")}
                  </label>
                  <input
                    className="form-control"
                    value={organizationForm.languages}
                    onChange={(event) =>
                      setOrganizationField(
                        "languages",
                        event.target.value
                      )
                    }
                    placeholder={t("languages_placeholder")}
                  />
                </div>
              </div>

              <div className="alert alert-info mt-4 mb-0">
                <strong>{page.reviewTitle}:</strong>{" "}
                {page.reviewText}
              </div>

              {error && (
                <div className="alert alert-danger mt-4 mb-0">
                  {error}
                </div>
              )}
            </div>

            <div className="card-footer bg-white p-3 d-flex flex-column flex-sm-row gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/organizations")}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="btn btn-dark"
                disabled={
                  saving || !organizationForm.name.trim()
                }
              >
                {saving ? t("saving") : page.continue}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={submitLocation}
            className="card border-0 shadow-sm"
          >
            <div className="card-body p-4 p-lg-5">
              <div className="alert alert-success">
                <strong>{page.organizationCreated}:</strong>{" "}
                {page.organizationCreatedText}
              </div>

              <h2 className="h4 fw-bold mt-4 mb-4">
                {page.locationSection}
              </h2>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {page.municipality} *
                  </label>
                  <select
                    className="form-select"
                    value={locationForm.municipalityId}
                    onChange={(event) =>
                      setLocationField(
                        "municipalityId",
                        event.target.value
                      )
                    }
                    disabled={municipalitiesLoading}
                    required
                  >
                    <option value="">
                      {municipalitiesLoading
                        ? t("loading")
                        : page.municipalityPlaceholder}
                    </option>
                    {municipalitiesByTerritory.map(
                      ({ territory, items }) =>
                        items.length > 0 ? (
                          <optgroup
                            key={territory}
                            label={territoryLabel(territory)}
                          >
                            {items.map((municipality) => (
                              <option
                                key={municipality._id}
                                value={municipality._id}
                              >
                                {municipality.name}
                              </option>
                            ))}
                          </optgroup>
                        ) : null
                    )}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {page.locationName} *
                  </label>
                  <input
                    className="form-control"
                    value={locationForm.name}
                    onChange={(event) =>
                      setLocationField(
                        "name",
                        event.target.value
                      )
                    }
                    maxLength={120}
                    required
                  />
                  <div className="form-text">
                    {page.locationNameHelp}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    {page.addressLine1} *
                  </label>
                  <input
                    className="form-control"
                    value={locationForm.addressLine1}
                    onChange={(event) =>
                      setLocationField(
                        "addressLine1",
                        event.target.value
                      )
                    }
                    maxLength={240}
                    required
                  />
                </div>

                <div className="col-12 col-md-8">
                  <label className="form-label fw-semibold">
                    {page.addressLine2}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    className="form-control"
                    value={locationForm.addressLine2}
                    onChange={(event) =>
                      setLocationField(
                        "addressLine2",
                        event.target.value
                      )
                    }
                    maxLength={240}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">
                    {page.postalCode}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    className="form-control"
                    value={locationForm.postalCode}
                    onChange={(event) =>
                      setLocationField(
                        "postalCode",
                        event.target.value
                      )
                    }
                    maxLength={12}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("phone")}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={locationForm.phone}
                    onChange={(event) =>
                      setLocationField(
                        "phone",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("email")}{" "}
                    <span className="fw-normal text-secondary">
                      ({page.optional})
                    </span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={locationForm.email}
                    onChange={(event) =>
                      setLocationField(
                        "email",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12">
                  <fieldset className="rounded border p-3">
                    <legend className="float-none w-auto px-2 fs-6 fw-semibold">
                      {page.weekdayHours}{" "}
                      <span className="fw-normal text-secondary">
                        ({page.optional})
                      </span>
                    </legend>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="form-label">
                          {page.opensAt}
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          value={locationForm.weekdaysOpenAt}
                          onChange={(event) =>
                            setLocationField(
                              "weekdaysOpenAt",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="form-label">
                          {page.closesAt}
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          value={locationForm.weekdaysCloseAt}
                          onChange={(event) =>
                            setLocationField(
                              "weekdaysCloseAt",
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="alert alert-info mt-4 mb-0">
                {page.headOfficeText}
              </div>

              {municipalitiesError && (
                <div className="alert alert-danger mt-4 mb-0">
                  {municipalitiesError}
                </div>
              )}
              {error && (
                <div className="alert alert-danger mt-4 mb-0">
                  {error}
                </div>
              )}
            </div>

            <div className="card-footer bg-white p-3 d-flex flex-column flex-sm-row gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/organizations")}
              >
                {page.finishLater}
              </button>
              <button
                type="submit"
                className="btn btn-dark"
                disabled={
                  saving ||
                  municipalitiesLoading ||
                  Boolean(municipalitiesError) ||
                  !locationForm.municipalityId ||
                  !locationForm.name.trim() ||
                  !locationForm.addressLine1.trim()
                }
              >
                {saving
                  ? t("saving")
                  : page.createHeadOffice}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
