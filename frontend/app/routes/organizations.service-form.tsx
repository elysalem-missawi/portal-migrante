import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../i18n";
import {
  organizationsService,
  type Organization,
} from "../services/organizations.service";
import {
  organizationLocationsService,
  type OrganizationLocation,
} from "../services/organization-locations.service";
import {
  serviceCategoriesService,
  servicesService,
  type CreateServiceInput,
  type Service,
  type ServiceCategory,
  type ServiceCostType,
  type ServiceDeliveryMode,
} from "../services/services.service";

type Locale = "eu" | "es" | "en" | "ar";

type ServiceForm = {
  categoryId: string;
  title: string;
  description: string;
  locationIds: string[];
  deliveryModes: ServiceDeliveryMode[];
  eligibility: string;
  requiredDocuments: string;
  costType: ServiceCostType;
  appointmentRequired: boolean;
  website: string;
  phone: string;
  email: string;
  languages: string;
};

type PageCopy = {
  newTitle: string;
  editTitle: string;
  subtitle: string;
  organization: string;
  category: string;
  chooseCategory: string;
  serviceTitle: string;
  description: string;
  locations: string;
  locationsHelp: string;
  noLocations: string;
  locationRequired: string;
  deliveryModes: string;
  deliveryRequired: string;
  eligibility: string;
  requiredDocuments: string;
  documentsHelp: string;
  costType: string;
  appointmentRequired: string;
  contact: string;
  languages: string;
  languagesHelp: string;
  optional: string;
  save: string;
  update: string;
  reviewTitle: string;
  reviewText: string;
  loadError: string;
  saveError: string;
  mismatch: string;
  back: string;
  headOffice: string;
  active: string;
  inactive: string;
  delivery: Record<ServiceDeliveryMode, string>;
  costs: Record<ServiceCostType, string>;
};

const copy: Record<Locale, PageCopy> = {
  es: {
    newTitle: "Crear servicio",
    editTitle: "Editar servicio",
    subtitle:
      "Describe el servicio y selecciona una o varias sedes de la organización.",
    organization: "Organización",
    category: "Categoría",
    chooseCategory: "Selecciona una categoría",
    serviceTitle: "Nombre del servicio",
    description: "Descripción clara del servicio",
    locations: "Sedes donde se presta",
    locationsHelp:
      "Puedes seleccionar varias. Una atención exclusivamente online o telefónica puede no tener sede.",
    noLocations:
      "La organización no tiene sedes activas. Añade una sede o elige una modalidad online o telefónica.",
    locationRequired:
      "Selecciona al menos una sede para un servicio presencial o híbrido.",
    deliveryModes: "Modalidades de atención",
    deliveryRequired: "Selecciona al menos una modalidad de atención.",
    eligibility: "A quién va dirigido y requisitos",
    requiredDocuments: "Documentos necesarios",
    documentsHelp: "Escribe un documento por línea.",
    costType: "Coste",
    appointmentRequired: "Requiere cita previa",
    contact: "Contacto específico del servicio",
    languages: "Idiomas de atención",
    languagesHelp: "Códigos separados por comas, por ejemplo: es, eu, ar.",
    optional: "Opcional",
    save: "Guardar servicio",
    update: "Guardar cambios",
    reviewTitle: "Publicación y revisión",
    reviewText:
      "El servicio se guardará como borrador pendiente. Solo la administración de la plataforma puede verificarlo y publicarlo.",
    loadError: "No se pudo cargar el formulario del servicio.",
    saveError: "No se pudo guardar el servicio.",
    mismatch: "El servicio no pertenece a esta organización.",
    back: "Volver a la organización",
    headOffice: "Sede principal",
    active: "Activa",
    inactive: "Inactiva",
    delivery: {
      in_person: "Presencial",
      online: "Online",
      phone: "Teléfono",
      mobile: "Itinerante",
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
    newTitle: "إنشاء خدمة",
    editTitle: "تعديل الخدمة",
    subtitle:
      "صِف الخدمة وحدد مقرًا واحدًا أو عدة مقرات تابعة للمنظمة.",
    organization: "المنظمة",
    category: "الفئة",
    chooseCategory: "اختر فئة",
    serviceTitle: "اسم الخدمة",
    description: "وصف واضح للخدمة",
    locations: "المقرات التي تقدم فيها الخدمة",
    locationsHelp:
      "يمكن اختيار عدة مقرات. ولا يلزم مقر للخدمة الإلكترونية أو الهاتفية فقط.",
    noLocations:
      "لا تملك المنظمة مقرًا نشطًا. أضف مقرًا أو اختر طريقة إلكترونية أو هاتفية.",
    locationRequired:
      "اختر مقرًا واحدًا على الأقل للخدمة الحضورية أو الهجينة.",
    deliveryModes: "طرق تقديم الخدمة",
    deliveryRequired: "اختر طريقة واحدة على الأقل لتقديم الخدمة.",
    eligibility: "الفئة المستفيدة والشروط",
    requiredDocuments: "الوثائق المطلوبة",
    documentsHelp: "اكتب وثيقة واحدة في كل سطر.",
    costType: "التكلفة",
    appointmentRequired: "تحتاج إلى موعد مسبق",
    contact: "وسائل التواصل الخاصة بالخدمة",
    languages: "لغات تقديم الخدمة",
    languagesHelp: "رموز اللغات مفصولة بفواصل، مثال: es, eu, ar.",
    optional: "اختياري",
    save: "حفظ الخدمة",
    update: "حفظ التعديلات",
    reviewTitle: "النشر والمراجعة",
    reviewText:
      "ستُحفظ الخدمة كمسودة قيد المراجعة. إدارة المنصة وحدها يمكنها توثيقها ونشرها.",
    loadError: "تعذر تحميل نموذج الخدمة.",
    saveError: "تعذر حفظ الخدمة.",
    mismatch: "هذه الخدمة لا تتبع المنظمة المحددة.",
    back: "العودة إلى المنظمة",
    headOffice: "المقر الرئيسي",
    active: "نشط",
    inactive: "غير نشط",
    delivery: {
      in_person: "حضورية",
      online: "إلكترونية",
      phone: "عبر الهاتف",
      mobile: "متنقلة",
      hybrid: "هجينة",
    },
    costs: {
      free: "مجانية",
      paid: "مدفوعة",
      subsidized: "مدعومة",
      unknown: "تحتاج إلى تأكيد",
    },
  },
  en: {
    newTitle: "Create service",
    editTitle: "Edit service",
    subtitle:
      "Describe the service and select one or more of the organization's locations.",
    organization: "Organization",
    category: "Category",
    chooseCategory: "Select a category",
    serviceTitle: "Service name",
    description: "Clear service description",
    locations: "Service locations",
    locationsHelp:
      "You can select several. An online-only or phone-only service may have no location.",
    noLocations:
      "The organization has no active locations. Add one or select online or phone delivery.",
    locationRequired:
      "Select at least one location for an in-person or hybrid service.",
    deliveryModes: "Delivery modes",
    deliveryRequired: "Select at least one delivery mode.",
    eligibility: "Audience and eligibility",
    requiredDocuments: "Required documents",
    documentsHelp: "Enter one document per line.",
    costType: "Cost",
    appointmentRequired: "Appointment required",
    contact: "Service-specific contact",
    languages: "Service languages",
    languagesHelp: "Comma-separated codes, for example: es, eu, ar.",
    optional: "Optional",
    save: "Save service",
    update: "Save changes",
    reviewTitle: "Publishing and review",
    reviewText:
      "The service will be saved as a pending draft. Only platform administrators can verify and publish it.",
    loadError: "The service form could not be loaded.",
    saveError: "The service could not be saved.",
    mismatch: "This service does not belong to the selected organization.",
    back: "Back to organization",
    headOffice: "Head office",
    active: "Active",
    inactive: "Inactive",
    delivery: {
      in_person: "In person",
      online: "Online",
      phone: "Phone",
      mobile: "Mobile",
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
    newTitle: "Sortu zerbitzua",
    editTitle: "Editatu zerbitzua",
    subtitle:
      "Deskribatu zerbitzua eta hautatu erakundearen egoitza bat edo gehiago.",
    organization: "Erakundea",
    category: "Kategoria",
    chooseCategory: "Hautatu kategoria",
    serviceTitle: "Zerbitzuaren izena",
    description: "Zerbitzuaren deskribapen argia",
    locations: "Zerbitzuaren egoitzak",
    locationsHelp:
      "Hainbat hauta ditzakezu. Online edo telefonoz bakarrik ematen den zerbitzuak ez du egoitzarik behar.",
    noLocations:
      "Erakundeak ez du egoitza aktiborik. Gehitu egoitza bat edo hautatu online edo telefono bidezko arreta.",
    locationRequired:
      "Hautatu gutxienez egoitza bat aurrez aurreko edo zerbitzu hibridorako.",
    deliveryModes: "Arreta-modalitateak",
    deliveryRequired: "Hautatu gutxienez arreta-modalitate bat.",
    eligibility: "Hartzaileak eta baldintzak",
    requiredDocuments: "Beharrezko dokumentuak",
    documentsHelp: "Idatzi dokumentu bat lerro bakoitzean.",
    costType: "Kostua",
    appointmentRequired: "Hitzordua behar da",
    contact: "Zerbitzuaren kontaktua",
    languages: "Arreta-hizkuntzak",
    languagesHelp: "Koma bidez bereizitako kodeak, adibidez: es, eu, ar.",
    optional: "Aukerakoa",
    save: "Gorde zerbitzua",
    update: "Gorde aldaketak",
    reviewTitle: "Argitalpena eta berrikuspena",
    reviewText:
      "Zerbitzua zain dagoen zirriborro gisa gordeko da. Plataformaren administrazioak bakarrik egiaztatu eta argitaratu dezake.",
    loadError: "Ezin izan da zerbitzu-inprimakia kargatu.",
    saveError: "Ezin izan da zerbitzua gorde.",
    mismatch: "Zerbitzua ez dagokio hautatutako erakundeari.",
    back: "Itzuli erakundera",
    headOffice: "Egoitza nagusia",
    active: "Aktiboa",
    inactive: "Inaktiboa",
    delivery: {
      in_person: "Aurrez aurre",
      online: "Online",
      phone: "Telefonoz",
      mobile: "Ibiltaria",
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

const deliveryModes: ServiceDeliveryMode[] = [
  "in_person",
  "online",
  "phone",
  "mobile",
  "hybrid",
];

const costTypes: ServiceCostType[] = [
  "free",
  "paid",
  "subsidized",
  "unknown",
];

const initialForm: ServiceForm = {
  categoryId: "",
  title: "",
  description: "",
  locationIds: [],
  deliveryModes: ["in_person"],
  eligibility: "",
  requiredDocuments: "",
  costType: "unknown",
  appointmentRequired: false,
  website: "",
  phone: "",
  email: "",
  languages: "es, eu",
};

function relationId(
  value: string | { _id: string } | null | undefined
) {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}

function optional(value: string) {
  const clean = value.trim();
  return clean || undefined;
}

function commaValues(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function lineValues(value: string) {
  return Array.from(
    new Set(
      value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function formFromService(service: Service): ServiceForm {
  return {
    categoryId: relationId(service.categoryId),
    title: service.title,
    description: service.description,
    locationIds: service.locationIds.map((location) =>
      relationId(location)
    ),
    deliveryModes: service.deliveryModes,
    eligibility: service.eligibility || "",
    requiredDocuments: service.requiredDocuments.join("\n"),
    costType: service.costType,
    appointmentRequired: service.appointmentRequired,
    website: service.website || "",
    phone: service.phone || "",
    email: service.email || "",
    languages: service.languages.join(", "),
  };
}

export default function OrganizationServiceFormPage() {
  const { id = "", serviceId = "" } = useParams();
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const activeLocale = (locale as Locale) in copy ? (locale as Locale) : "es";
  const page = copy[activeLocale];
  const editing = Boolean(serviceId);

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [locations, setLocations] = useState<OrganizationLocation[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const orderedLocations = useMemo(
    () =>
      [...locations].sort((left, right) =>
        left.isHeadOffice === right.isHeadOffice
          ? left.name.localeCompare(right.name)
          : left.isHeadOffice
            ? -1
            : 1
      ),
    [locations]
  );

  useEffect(() => {
    let active = true;
    if (!id) {
      setError(page.loadError);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError("");

    Promise.all([
      organizationsService.getMineById(id),
      organizationLocationsService.listMine({ organizationId: id }),
      serviceCategoriesService.list(),
      serviceId
        ? servicesService.getMineById(serviceId)
        : Promise.resolve(null),
    ])
      .then(
        ([organizationItem, locationItems, categoryItems, serviceItem]) => {
          if (!active) return;
          if (
            serviceItem &&
            relationId(serviceItem.organizationId) !== organizationItem._id
          ) {
            throw new Error(page.mismatch);
          }

          setOrganization(organizationItem);
          setLocations(locationItems);
          setCategories(categoryItems);
          setForm(serviceItem ? formFromService(serviceItem) : initialForm);
        }
      )
      .catch((caught: unknown) => {
        if (!active) return;
        const message = caught instanceof Error ? caught.message : "";
        setError(message || page.loadError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, page.loadError, page.mismatch, serviceId]);

  const setField = <K extends keyof ServiceForm>(
    field: K,
    value: ServiceForm[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleLocation = (locationId: string) => {
    setForm((current) => ({
      ...current,
      locationIds: current.locationIds.includes(locationId)
        ? current.locationIds.filter((item) => item !== locationId)
        : [...current.locationIds, locationId],
    }));
  };

  const toggleDeliveryMode = (mode: ServiceDeliveryMode) => {
    setForm((current) => ({
      ...current,
      deliveryModes: current.deliveryModes.includes(mode)
        ? current.deliveryModes.filter((item) => item !== mode)
        : [...current.deliveryModes, mode],
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving || !id) return;

    if (form.deliveryModes.length === 0) {
      setError(page.deliveryRequired);
      return;
    }

    const needsLocation =
      form.deliveryModes.includes("in_person") ||
      form.deliveryModes.includes("hybrid");
    if (needsLocation && form.locationIds.length === 0) {
      setError(page.locationRequired);
      return;
    }

    const payload: CreateServiceInput = {
      organizationId: id,
      categoryId: form.categoryId,
      title: form.title.trim(),
      description: form.description.trim(),
      locationIds: form.locationIds,
      deliveryModes: form.deliveryModes,
      eligibility: optional(form.eligibility),
      requiredDocuments: lineValues(form.requiredDocuments),
      costType: form.costType,
      appointmentRequired: form.appointmentRequired,
      website: optional(form.website),
      phone: optional(form.phone),
      email: optional(form.email),
      languages: commaValues(form.languages),
    };

    setSaving(true);
    setError("");

    try {
      if (serviceId) {
        const { organizationId: _organizationId, ...updatePayload } = payload;
        await servicesService.update(serviceId, updatePayload);
      } else {
        await servicesService.create(payload);
      }
      navigate("/organizations/" + id + "/manage?service=saved", {
        replace: true,
      });
    } catch (caught: unknown) {
      const message = caught instanceof Error ? caught.message : "";
      setError(message || page.saveError);
    } finally {
      setSaving(false);
    }
  };

  const categoryLabel = (category: ServiceCategory) => {
    const keyByCode: Record<string, string> = {
      salud: "f_health",
      health: "f_health",
      vivienda: "f_housing",
      housing: "f_housing",
      empleo: "f_work",
      employment: "f_work",
      educacion: "f_education",
      education: "f_education",
      legal: "f_legal",
      ayuntamientos: "f_municipalities",
      municipality: "f_municipalities",
      asociaciones: "f_charities",
      association: "f_charities",
    };
    const key = keyByCode[category.code.toLowerCase()];
    return key ? t(key) : category.name;
  };

  if (loading) {
    return <div className="container py-5 text-muted">{t("loading")}</div>;
  }

  if (!organization) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || page.loadError}</div>
        <Link to="/organizations" className="btn btn-outline-dark">
          {page.back}
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-light min-vh-100 py-4 py-lg-5">
      <div className="container" style={{ maxWidth: 960 }}>
        <Link
          to={"/organizations/" + organization._id + "/manage"}
          className="text-decoration-none"
        >
          ← {page.back}
        </Link>

        <div className="mt-3 mb-4">
          <h1 className="h3 fw-bold mb-2">
            {editing ? page.editTitle : page.newTitle}
          </h1>
          <p className="text-secondary mb-1">{page.subtitle}</p>
          <p className="mb-0">
            <strong>{page.organization}:</strong> {organization.name}
          </p>
        </div>

        <form onSubmit={submit} className="card border-0 shadow-sm">
          <div className="card-body p-4 p-lg-5">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {page.category} *
                </label>
                <select
                  className="form-select"
                  value={form.categoryId}
                  onChange={(event) =>
                    setField("categoryId", event.target.value)
                  }
                  required
                >
                  <option value="">{page.chooseCategory}</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {categoryLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {page.serviceTitle} *
                </label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(event) => setField("title", event.target.value)}
                  maxLength={180}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  {page.description} *
                </label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    setField("description", event.target.value)
                  }
                  maxLength={6000}
                  required
                />
              </div>

              <div className="col-12">
                <fieldset className="rounded border p-3 p-md-4">
                  <legend className="float-none w-auto px-2 fs-6 fw-semibold">
                    {page.deliveryModes} *
                  </legend>
                  <div className="row g-2">
                    {deliveryModes.map((mode) => (
                      <div className="col-6 col-md-4" key={mode}>
                        <div className="form-check">
                          <input
                            id={"delivery-" + mode}
                            type="checkbox"
                            className="form-check-input"
                            checked={form.deliveryModes.includes(mode)}
                            onChange={() => toggleDeliveryMode(mode)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={"delivery-" + mode}
                          >
                            {page.delivery[mode]}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="col-12">
                <fieldset className="rounded border p-3 p-md-4">
                  <legend className="float-none w-auto px-2 fs-6 fw-semibold">
                    {page.locations}
                  </legend>
                  <p className="text-secondary small">{page.locationsHelp}</p>
                  {orderedLocations.length === 0 ? (
                    <div className="alert alert-warning mb-0">
                      {page.noLocations}
                    </div>
                  ) : (
                    <div className="row g-2">
                      {orderedLocations.map((location) => {
                        const selected = form.locationIds.includes(
                          location._id
                        );
                        const disabled =
                          location.status !== "active" && !selected;
                        return (
                          <div className="col-12 col-md-6" key={location._id}>
                            <label
                              className={
                                "d-flex gap-3 rounded border p-3 " +
                                (selected
                                  ? "border-primary bg-primary-subtle"
                                  : "bg-white") +
                                (disabled ? " opacity-50" : "")
                              }
                            >
                              <input
                                type="checkbox"
                                className="form-check-input flex-shrink-0"
                                checked={selected}
                                onChange={() => toggleLocation(location._id)}
                                disabled={disabled}
                              />
                              <span>
                                <span className="d-block fw-semibold">
                                  {location.name}
                                </span>
                                <span className="d-block text-secondary small">
                                  {location.addressLine1}
                                </span>
                                <span className="d-flex flex-wrap gap-1 mt-2">
                                  {location.isHeadOffice && (
                                    <span className="badge text-bg-primary">
                                      {page.headOffice}
                                    </span>
                                  )}
                                  <span
                                    className={
                                      "badge " +
                                      (location.status === "active"
                                        ? "text-bg-success"
                                        : "text-bg-secondary")
                                    }
                                  >
                                    {location.status === "active"
                                      ? page.active
                                      : page.inactive}
                                  </span>
                                </span>
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  {page.eligibility} ({page.optional})
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.eligibility}
                  onChange={(event) =>
                    setField("eligibility", event.target.value)
                  }
                  maxLength={3000}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  {page.requiredDocuments} ({page.optional})
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.requiredDocuments}
                  onChange={(event) =>
                    setField("requiredDocuments", event.target.value)
                  }
                />
                <div className="form-text">{page.documentsHelp}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {page.costType}
                </label>
                <select
                  className="form-select"
                  value={form.costType}
                  onChange={(event) =>
                    setField(
                      "costType",
                      event.target.value as ServiceCostType
                    )
                  }
                >
                  {costTypes.map((cost) => (
                    <option key={cost} value={cost}>
                      {page.costs[cost]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 d-flex align-items-end">
                <div className="form-check mb-2">
                  <input
                    id="appointment-required"
                    type="checkbox"
                    className="form-check-input"
                    checked={form.appointmentRequired}
                    onChange={(event) =>
                      setField("appointmentRequired", event.target.checked)
                    }
                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="appointment-required"
                  >
                    {page.appointmentRequired}
                  </label>
                </div>
              </div>

              <div className="col-12">
                <h2 className="h6 fw-bold mb-0">{page.contact}</h2>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">
                  {t("website")} ({page.optional})
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={form.website}
                  onChange={(event) => setField("website", event.target.value)}
                  placeholder="https://"
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">
                  {t("phone")} ({page.optional})
                </label>
                <input
                  type="tel"
                  className="form-control"
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">
                  {t("email")} ({page.optional})
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(event) => setField("email", event.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  {page.languages} ({page.optional})
                </label>
                <input
                  className="form-control"
                  value={form.languages}
                  onChange={(event) => setField("languages", event.target.value)}
                  placeholder="es, eu, ar, en"
                />
                <div className="form-text">{page.languagesHelp}</div>
              </div>
            </div>

            <div className="alert alert-info mt-4 mb-0">
              <strong>{page.reviewTitle}:</strong> {page.reviewText}
            </div>
            {error && (
              <div className="alert alert-danger mt-4 mb-0">{error}</div>
            )}
          </div>

          <div className="card-footer bg-white p-3 d-flex flex-column flex-sm-row gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate("/organizations/" + organization._id + "/manage")
              }
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="btn btn-dark"
              disabled={
                saving ||
                !form.categoryId ||
                !form.title.trim() ||
                !form.description.trim()
              }
            >
              {saving ? t("saving") : editing ? page.update : page.save}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
