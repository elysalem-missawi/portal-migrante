import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";
import {
  organizationsService,
  type Organization,
} from "../services/organizations.service";
import {
  organizationLocationsService,
  referenceId,
  type CreateOrganizationLocationInput,
  type OpeningHour,
  type OrganizationLocation,
  type OrganizationLocationStatus,
} from "../services/organization-locations.service";
import {
  municipalitiesService,
  type Municipality,
} from "../services/municipalities.service";
import {
  servicesService,
  type Service,
} from "../services/services.service";

type Locale = "eu" | "es" | "en" | "ar";
type Day = OpeningHour["day"];

type DaySchedule = {
  enabled: boolean;
  opensAt: string;
  closesAt: string;
};

type LocationForm = {
  municipalityId: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  phone: string;
  email: string;
  status: Extract<OrganizationLocationStatus, "active" | "inactive">;
  isHeadOffice: boolean;
  schedule: Record<Day, DaySchedule>;
};

type PageCopy = {
  title: string;
  subtitle: string;
  organizationSummary: string;
  reviewNotice: string;
  locations: string;
  addLocation: string;
  editLocation: string;
  noLocations: string;
  noLocationsHelp: string;
  headOffice: string;
  municipality: string;
  chooseMunicipality: string;
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  optional: string;
  locationStatus: string;
  active: string;
  inactive: string;
  openingHours: string;
  opensAt: string;
  closesAt: string;
  openThisDay: string;
  closed: string;
  makeHeadOffice: string;
  makeHeadOfficeHelp: string;
  currentHeadOfficeHelp: string;
  saveLocation: string;
  updateLocation: string;
  cancelEdit: string;
  saved: string;
  updated: string;
  loadError: string;
  municipalitiesError: string;
  saveError: string;
  hoursError: string;
  hoursOrderError: string;
  pending: string;
  verified: string;
  rejected: string;
  unverified: string;
  back: string;
  days: Record<Day, string>;
};

const serviceCopy: Record<
  Locale,
  {
    title: string;
    add: string;
    edit: string;
    empty: string;
    saved: string;
    draft: string;
    active: string;
    inactive: string;
    pending: string;
    verified: string;
  }
> = {
  es: {
    title: "Servicios",
    add: "Añadir servicio",
    edit: "Editar",
    empty: "Esta organización todavía no tiene servicios.",
    saved: "El servicio se guardó como borrador pendiente de revisión.",
    draft: "Borrador",
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    verified: "Verificado",
  },
  ar: {
    title: "الخدمات",
    add: "إضافة خدمة",
    edit: "تعديل",
    empty: "لا توجد خدمات لهذه المنظمة بعد.",
    saved: "تم حفظ الخدمة كمسودة قيد المراجعة.",
    draft: "مسودة",
    active: "نشطة",
    inactive: "غير نشطة",
    pending: "قيد المراجعة",
    verified: "موثّقة",
  },
  en: {
    title: "Services",
    add: "Add service",
    edit: "Edit",
    empty: "This organization has no services yet.",
    saved: "The service was saved as a draft pending review.",
    draft: "Draft",
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    verified: "Verified",
  },
  eu: {
    title: "Zerbitzuak",
    add: "Gehitu zerbitzua",
    edit: "Editatu",
    empty: "Erakunde honek ez du zerbitzurik oraindik.",
    saved: "Zerbitzua berrikusteko zain dagoen zirriborro gisa gorde da.",
    draft: "Zirriborroa",
    active: "Aktiboa",
    inactive: "Inaktiboa",
    pending: "Zain",
    verified: "Egiaztatuta",
  },
};

const days: Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const copy: Record<Locale, PageCopy> = {
  es: {
    title: "Gestionar organización",
    subtitle:
      "Consulta la entidad y administra sus sedes sin mezclar las cuentas de usuario con los datos de la organización.",
    organizationSummary: "Resumen de la organización",
    reviewNotice:
      "Los cambios de sedes no verifican ni activan la organización. Esa revisión corresponde a la administración de la plataforma.",
    locations: "Sedes",
    addLocation: "Añadir sede",
    editLocation: "Editar sede",
    noLocations: "Todavía no hay sedes.",
    noLocationsHelp:
      "Añade la primera sede. El sistema la marcará automáticamente como sede principal.",
    headOffice: "Sede principal",
    municipality: "Municipio",
    chooseMunicipality: "Selecciona un municipio",
    locationName: "Nombre de la sede",
    addressLine1: "Dirección",
    addressLine2: "Información adicional de la dirección",
    postalCode: "Código postal",
    optional: "Opcional",
    locationStatus: "Estado de la sede",
    active: "Activa",
    inactive: "Inactiva",
    openingHours: "Horario semanal",
    opensAt: "Apertura",
    closesAt: "Cierre",
    openThisDay: "Abre este día",
    closed: "Cerrado",
    makeHeadOffice: "Marcar como sede principal",
    makeHeadOfficeHelp:
      "Al guardar, esta sede sustituirá a la sede principal actual.",
    currentHeadOfficeHelp:
      "La sede principal debe permanecer activa. Para cambiarla, edita otra sede y márcala como principal.",
    saveLocation: "Guardar sede",
    updateLocation: "Guardar cambios",
    cancelEdit: "Cancelar edición",
    saved: "La sede se guardó correctamente.",
    updated: "Los cambios de la sede se guardaron correctamente.",
    loadError: "No se pudo cargar la organización y sus sedes.",
    municipalitiesError: "No se pudo cargar la lista de municipios.",
    saveError: "No se pudo guardar la sede.",
    hoursError:
      "Cada día abierto debe tener hora de apertura y de cierre.",
    hoursOrderError:
      "La hora de cierre debe ser posterior a la hora de apertura.",
    pending: "Pendiente",
    verified: "Verificada",
    rejected: "Rechazada",
    unverified: "Sin verificar",
    back: "Volver a mis organizaciones",
    days: {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    },
  },
  ar: {
    title: "إدارة المنظمة",
    subtitle:
      "راجع بيانات الجهة وأدر مقراتها مع إبقاء حسابات المستخدمين منفصلة عن بيانات المنظمة.",
    organizationSummary: "ملخص المنظمة",
    reviewNotice:
      "تعديل المقرات لا يوثّق المنظمة ولا يفعّلها؛ فالمراجعة من اختصاص إدارة المنصة.",
    locations: "المقرات",
    addLocation: "إضافة مقر",
    editLocation: "تعديل المقر",
    noLocations: "لا توجد مقرات بعد.",
    noLocationsHelp:
      "أضف المقر الأول، وسيضعه النظام تلقائيًا كمقر رئيسي.",
    headOffice: "المقر الرئيسي",
    municipality: "البلدية",
    chooseMunicipality: "اختر البلدية",
    locationName: "اسم المقر",
    addressLine1: "العنوان",
    addressLine2: "معلومات إضافية عن العنوان",
    postalCode: "الرمز البريدي",
    optional: "اختياري",
    locationStatus: "حالة المقر",
    active: "نشط",
    inactive: "غير نشط",
    openingHours: "ساعات العمل الأسبوعية",
    opensAt: "وقت الفتح",
    closesAt: "وقت الإغلاق",
    openThisDay: "مفتوح في هذا اليوم",
    closed: "مغلق",
    makeHeadOffice: "تعيينه مقرًا رئيسيًا",
    makeHeadOfficeHelp:
      "عند الحفظ سيحل هذا المقر محل المقر الرئيسي الحالي.",
    currentHeadOfficeHelp:
      "يجب أن يبقى المقر الرئيسي نشطًا. لتغييره، عدّل مقرًا آخر وعيّنه رئيسيًا.",
    saveLocation: "حفظ المقر",
    updateLocation: "حفظ التعديلات",
    cancelEdit: "إلغاء التعديل",
    saved: "تم حفظ المقر بنجاح.",
    updated: "تم حفظ تعديلات المقر بنجاح.",
    loadError: "تعذر تحميل المنظمة ومقراتها.",
    municipalitiesError: "تعذر تحميل قائمة البلديات.",
    saveError: "تعذر حفظ المقر.",
    hoursError:
      "يجب إدخال وقت الفتح والإغلاق لكل يوم تم تحديده كمفتوح.",
    hoursOrderError:
      "يجب أن يكون وقت الإغلاق بعد وقت الفتح.",
    pending: "قيد المراجعة",
    verified: "موثّقة",
    rejected: "مرفوضة",
    unverified: "غير موثّقة",
    back: "العودة إلى منظماتي",
    days: {
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
    },
  },
  en: {
    title: "Manage organization",
    subtitle:
      "Review the organization and manage its locations while keeping user accounts separate from organization data.",
    organizationSummary: "Organization summary",
    reviewNotice:
      "Location changes do not verify or activate the organization. Platform administrators handle that review.",
    locations: "Locations",
    addLocation: "Add location",
    editLocation: "Edit location",
    noLocations: "There are no locations yet.",
    noLocationsHelp:
      "Add the first location. The system will automatically make it the head office.",
    headOffice: "Head office",
    municipality: "Municipality",
    chooseMunicipality: "Select a municipality",
    locationName: "Location name",
    addressLine1: "Address",
    addressLine2: "Additional address information",
    postalCode: "Postal code",
    optional: "Optional",
    locationStatus: "Location status",
    active: "Active",
    inactive: "Inactive",
    openingHours: "Weekly opening hours",
    opensAt: "Opens",
    closesAt: "Closes",
    openThisDay: "Open this day",
    closed: "Closed",
    makeHeadOffice: "Make this the head office",
    makeHeadOfficeHelp:
      "Saving will replace the current head office with this location.",
    currentHeadOfficeHelp:
      "The head office must remain active. To change it, edit another location and make that one the head office.",
    saveLocation: "Save location",
    updateLocation: "Save changes",
    cancelEdit: "Cancel editing",
    saved: "The location was saved.",
    updated: "The location changes were saved.",
    loadError: "The organization and its locations could not be loaded.",
    municipalitiesError: "The municipality list could not be loaded.",
    saveError: "The location could not be saved.",
    hoursError:
      "Every open day must include both opening and closing times.",
    hoursOrderError:
      "Closing time must be later than opening time.",
    pending: "Pending",
    verified: "Verified",
    rejected: "Rejected",
    unverified: "Unverified",
    back: "Back to my organizations",
    days: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
  },
  eu: {
    title: "Erakundea kudeatu",
    subtitle:
      "Berrikusi erakundea eta kudeatu egoitzak, erabiltzaile-kontuak erakundearen datuetatik bereizita mantenduz.",
    organizationSummary: "Erakundearen laburpena",
    reviewNotice:
      "Egoitzen aldaketek ez dute erakundea egiaztatzen edo aktibatzen. Plataformaren administrazioak egiten du berrikuspena.",
    locations: "Egoitzak",
    addLocation: "Gehitu egoitza",
    editLocation: "Editatu egoitza",
    noLocations: "Oraindik ez dago egoitzarik.",
    noLocationsHelp:
      "Gehitu lehen egoitza. Sistemak automatikoki egoitza nagusi bihurtuko du.",
    headOffice: "Egoitza nagusia",
    municipality: "Udalerria",
    chooseMunicipality: "Hautatu udalerri bat",
    locationName: "Egoitzaren izena",
    addressLine1: "Helbidea",
    addressLine2: "Helbideari buruzko informazio gehigarria",
    postalCode: "Posta-kodea",
    optional: "Aukerakoa",
    locationStatus: "Egoitzaren egoera",
    active: "Aktiboa",
    inactive: "Inaktiboa",
    openingHours: "Asteko ordutegia",
    opensAt: "Irekiera",
    closesAt: "Itxiera",
    openThisDay: "Egun honetan irekita",
    closed: "Itxita",
    makeHeadOffice: "Egoitza nagusi bihurtu",
    makeHeadOfficeHelp:
      "Gordetzean, egoitza honek oraingo egoitza nagusia ordezkatuko du.",
    currentHeadOfficeHelp:
      "Egoitza nagusiak aktibo jarraitu behar du. Aldatzeko, editatu beste egoitza bat eta markatu nagusi gisa.",
    saveLocation: "Gorde egoitza",
    updateLocation: "Gorde aldaketak",
    cancelEdit: "Utzi edizioa",
    saved: "Egoitza gorde da.",
    updated: "Egoitzaren aldaketak gorde dira.",
    loadError: "Ezin izan dira erakundea eta haren egoitzak kargatu.",
    municipalitiesError: "Ezin izan da udalerrien zerrenda kargatu.",
    saveError: "Ezin izan da egoitza gorde.",
    hoursError:
      "Irekitako egun bakoitzak irekiera- eta itxiera-orduak izan behar ditu.",
    hoursOrderError:
      "Itxiera-orduak irekiera-ordua baino geroagokoa izan behar du.",
    pending: "Zain",
    verified: "Egiaztatuta",
    rejected: "Baztertuta",
    unverified: "Egiaztatu gabe",
    back: "Itzuli nire erakundeetara",
    days: {
      monday: "Astelehena",
      tuesday: "Asteartea",
      wednesday: "Asteazkena",
      thursday: "Osteguna",
      friday: "Ostirala",
      saturday: "Larunbata",
      sunday: "Igandea",
    },
  },
};

function emptySchedule(): Record<Day, DaySchedule> {
  return Object.fromEntries(
    days.map((day) => [
      day,
      { enabled: false, opensAt: "", closesAt: "" },
    ])
  ) as Record<Day, DaySchedule>;
}

function emptyLocationForm(isFirstLocation = false): LocationForm {
  return {
    municipalityId: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    phone: "",
    email: "",
    status: "active",
    isHeadOffice: isFirstLocation,
    schedule: emptySchedule(),
  };
}

function scheduleFromLocation(
  openingHours: OpeningHour[]
): Record<Day, DaySchedule> {
  const schedule = emptySchedule();

  openingHours.forEach((item) => {
    schedule[item.day] = {
      enabled: !item.closed,
      opensAt: item.opensAt || "",
      closesAt: item.closesAt || "",
    };
  });

  return schedule;
}

function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return slug || "location-" + Date.now();
}

function optional(value: string) {
  const clean = value.trim();
  return clean || undefined;
}

function openingHoursFromSchedule(
  schedule: Record<Day, DaySchedule>
): OpeningHour[] {
  return days.map((day) => {
    const item = schedule[day];
    return item.enabled
      ? {
          day,
          opensAt: item.opensAt,
          closesAt: item.closesAt,
          closed: false,
        }
      : { day, closed: true };
  });
}

export default function OrganizationManagePage() {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { t, locale } = useI18n();
  const activeLocale = (locale as Locale) in copy ? (locale as Locale) : "es";
  const page = copy[activeLocale];
  const servicePage = serviceCopy[activeLocale];

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [locations, setLocations] = useState<OrganizationLocation[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [form, setForm] = useState<LocationForm>(() =>
    emptyLocationForm()
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [municipalitiesError, setMunicipalitiesError] = useState("");
  const [notice, setNotice] = useState("");

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

  const municipalityById = useMemo(
    () => new Map(municipalities.map((item) => [item._id, item])),
    [municipalities]
  );

  const loadLocations = useCallback(async () => {
    if (!id) return;
    const items = await organizationLocationsService.listMine({
      organizationId: id,
    });
    setLocations(items);
    return items;
  }, [id]);

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
    setMunicipalitiesError("");

    Promise.all([
      organizationsService.getMineById(id),
      organizationLocationsService.listMine({ organizationId: id }),
      municipalitiesService.list(),
      servicesService.listMine({ organizationId: id }),
    ])
      .then(
        ([
          organizationItem,
          locationItems,
          municipalityItems,
          serviceItems,
        ]) => {
        if (!active) return;
        setOrganization(organizationItem);
        setLocations(locationItems);
        setMunicipalities(municipalityItems);
        setServices(serviceItems);
        setForm(emptyLocationForm(locationItems.length === 0));
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
  }, [id, page.loadError]);

  const setField = <K extends keyof Omit<LocationForm, "schedule">>(
    field: K,
    value: LocationForm[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const setDayField = <K extends keyof DaySchedule>(
    day: Day,
    field: K,
    value: DaySchedule[K]
  ) => {
    setForm((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        [day]: {
          ...current.schedule[day],
          [field]: value,
        },
      },
    }));
  };

  const resetForm = (locationCount = locations.length) => {
    setEditingId(null);
    setForm(emptyLocationForm(locationCount === 0));
    setError("");
  };

  const editLocation = (location: OrganizationLocation) => {
    setEditingId(location._id);
    setNotice("");
    setError("");
    setForm({
      municipalityId: referenceId(location.municipalityId),
      name: location.name,
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2 || "",
      postalCode: location.postalCode || "",
      phone: location.phone || "",
      email: location.email || "",
      status: location.status === "inactive" ? "inactive" : "active",
      isHeadOffice: location.isHeadOffice,
      schedule: scheduleFromLocation(location.openingHours || []),
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving || !id) return;

    const openDays = days.filter((day) => form.schedule[day].enabled);
    if (
      openDays.some(
        (day) =>
          !form.schedule[day].opensAt || !form.schedule[day].closesAt
      )
    ) {
      setError(page.hoursError);
      return;
    }
    if (
      openDays.some(
        (day) =>
          form.schedule[day].closesAt <= form.schedule[day].opensAt
      )
    ) {
      setError(page.hoursOrderError);
      return;
    }

    const existing = editingId
      ? locations.find((location) => location._id === editingId)
      : undefined;
    const payload: CreateOrganizationLocationInput = {
      organizationId: id,
      municipalityId: form.municipalityId,
      name: form.name.trim(),
      slug: existing?.slug || slugify(form.name),
      addressLine1: form.addressLine1.trim(),
      addressLine2: optional(form.addressLine2),
      postalCode: optional(form.postalCode),
      phone: optional(form.phone),
      email: optional(form.email),
      openingHours: openingHoursFromSchedule(form.schedule),
      isHeadOffice: locations.length === 0 || form.isHeadOffice,
      status:
        locations.length === 0 || form.isHeadOffice
          ? "active"
          : form.status,
    };

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        const { organizationId: _organizationId, ...updatePayload } = payload;
        await organizationLocationsService.update(editingId, updatePayload);
      } else {
        await organizationLocationsService.create(payload);
      }

      const refreshed = (await loadLocations()) || [];
      setNotice(editingId ? page.updated : page.saved);
      resetForm(refreshed.length);
    } catch (caught: unknown) {
      const message = caught instanceof Error ? caught.message : "";
      setError(message || page.saveError);
    } finally {
      setSaving(false);
    }
  };

  const verificationLabel = organization
    ? organization.verificationStatus === "verified" || organization.verified
      ? page.verified
      : organization.verificationStatus === "pending"
        ? page.pending
        : organization.verificationStatus === "rejected"
          ? page.rejected
          : page.unverified
    : "";

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
      <div className="container" style={{ maxWidth: 1080 }}>
        <Link to="/organizations" className="text-decoration-none">
          ← {page.back}
        </Link>

        <div className="mt-3 mb-4">
          <h1 className="h3 fw-bold mb-2">{page.title}</h1>
          <p className="text-secondary mb-0">{page.subtitle}</p>
        </div>

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h2 className="h5 fw-bold mb-3">{page.organizationSummary}</h2>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="text-secondary small">{t("name")}</div>
                <div className="fw-semibold">{organization.name}</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="text-secondary small">{t("status")}</div>
                <span className="badge text-bg-secondary">
                  {t("status_" + organization.status) || organization.status}
                </span>
              </div>
              <div className="col-6 col-md-3">
                <div className="text-secondary small">{t("verified")}</div>
                <span
                  className={
                    "badge " +
                    (organization.verificationStatus === "verified" ||
                    organization.verified
                      ? "text-bg-success"
                      : "text-bg-warning")
                  }
                >
                  {verificationLabel}
                </span>
              </div>
              {organization.description && (
                <div className="col-12">
                  <div className="text-secondary small">
                    {t("description")}
                  </div>
                  <div>{organization.description}</div>
                </div>
              )}
            </div>
            <div className="alert alert-info mt-4 mb-0">
              {page.reviewNotice}
            </div>
          </div>
        </section>

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-3">
              <h2 className="h4 fw-bold mb-0">
                {servicePage.title} ({services.length})
              </h2>
              <Link
                to={"/organizations/" + organization._id + "/services/new"}
                className="btn btn-dark"
              >
                + {servicePage.add}
              </Link>
            </div>

            {searchParams.get("service") === "saved" && (
              <div className="alert alert-success">{servicePage.saved}</div>
            )}

            {services.length === 0 ? (
              <p className="text-secondary mb-0">{servicePage.empty}</p>
            ) : (
              <div className="list-group list-group-flush">
                {services.map((service) => {
                  const category =
                    service.categoryId &&
                    typeof service.categoryId !== "string"
                      ? service.categoryId
                      : null;
                  const statusLabel =
                    service.status === "active"
                      ? servicePage.active
                      : service.status === "inactive"
                        ? servicePage.inactive
                        : servicePage.draft;

                  return (
                    <div
                      className="list-group-item px-0 py-3"
                      key={service._id}
                    >
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                        <div>
                          <h3 className="h6 fw-bold mb-1">{service.title}</h3>
                          {category?.name && (
                            <div className="text-secondary small">
                              {category.name}
                            </div>
                          )}
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            <span
                              className={
                                "badge " +
                                (service.status === "active"
                                  ? "text-bg-success"
                                  : "text-bg-secondary")
                              }
                            >
                              {statusLabel}
                            </span>
                            <span
                              className={
                                "badge " +
                                (service.verificationStatus === "verified"
                                  ? "text-bg-primary"
                                  : "text-bg-warning")
                              }
                            >
                              {service.verificationStatus === "verified"
                                ? servicePage.verified
                                : servicePage.pending}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Link
                            to={
                              "/organizations/" +
                              organization._id +
                              "/services/" +
                              service._id +
                              "/edit"
                            }
                            className="btn btn-sm btn-outline-dark"
                          >
                            {servicePage.edit}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mb-4">
          <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
            <h2 className="h4 fw-bold mb-0">
              {page.locations} ({locations.length})
            </h2>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => resetForm()}
            >
              + {page.addLocation}
            </button>
          </div>

          {locations.length === 0 ? (
            <div className="alert alert-warning">
              <strong>{page.noLocations}</strong> {page.noLocationsHelp}
            </div>
          ) : (
            <div className="row g-3">
              {orderedLocations.map((location) => {
                const populatedMunicipality =
                  typeof location.municipalityId === "string"
                    ? null
                    : location.municipalityId;
                const municipality =
                  populatedMunicipality ||
                  municipalityById.get(referenceId(location.municipalityId));

                return (
                  <div className="col-12 col-lg-6" key={location._id}>
                    <article
                      className={
                        "card h-100 shadow-sm " +
                        (location.isHeadOffice
                          ? "border-primary"
                          : "border-0")
                      }
                    >
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            <h3 className="h5 fw-bold mb-1">
                              {location.name}
                            </h3>
                            <div className="text-secondary">
                              {municipality?.name || "-"}
                            </div>
                          </div>
                          <div className="d-flex flex-column align-items-end gap-2">
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
                          </div>
                        </div>
                        <hr />
                        <p className="mb-1">{location.addressLine1}</p>
                        {location.addressLine2 && (
                          <p className="mb-1 text-secondary">
                            {location.addressLine2}
                          </p>
                        )}
                        {location.postalCode && (
                          <p className="mb-2 text-secondary">
                            {location.postalCode}
                          </p>
                        )}
                        {(location.phone || location.email) && (
                          <div className="small text-secondary mt-3">
                            {location.phone && <div>{location.phone}</div>}
                            {location.email && <div>{location.email}</div>}
                          </div>
                        )}
                      </div>
                      <div className="card-footer bg-white border-0 p-3 pt-0">
                        <button
                          type="button"
                          className="btn btn-outline-dark w-100"
                          onClick={() => editLocation(location)}
                        >
                          {page.editLocation}
                        </button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card border-0 shadow-sm">
          <form onSubmit={submit}>
            <div className="card-body p-4 p-lg-5">
              <h2 className="h4 fw-bold mb-4">
                {editingId ? page.editLocation : page.addLocation}
              </h2>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {page.municipality} *
                  </label>
                  <select
                    className="form-select"
                    value={form.municipalityId}
                    onChange={(event) =>
                      setField("municipalityId", event.target.value)
                    }
                    required
                  >
                    <option value="">{page.chooseMunicipality}</option>
                    {municipalities.map((municipality) => (
                      <option key={municipality._id} value={municipality._id}>
                        {municipality.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {page.locationName} *
                  </label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(event) => setField("name", event.target.value)}
                    maxLength={120}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    {page.addressLine1} *
                  </label>
                  <input
                    className="form-control"
                    value={form.addressLine1}
                    onChange={(event) =>
                      setField("addressLine1", event.target.value)
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
                    value={form.addressLine2}
                    onChange={(event) =>
                      setField("addressLine2", event.target.value)
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
                    value={form.postalCode}
                    onChange={(event) =>
                      setField("postalCode", event.target.value)
                    }
                    maxLength={12}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("phone")} ({page.optional})
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={(event) => setField("phone", event.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {t("email")} ({page.optional})
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    {page.locationStatus}
                  </label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(event) =>
                      setField(
                        "status",
                        event.target.value as LocationForm["status"]
                      )
                    }
                    disabled={form.isHeadOffice || locations.length === 0}
                  >
                    <option value="active">{page.active}</option>
                    <option value="inactive">{page.inactive}</option>
                  </select>
                </div>

                <div className="col-12 col-md-6 d-flex align-items-end">
                  <div>
                    <div className="form-check">
                      <input
                        id="head-office"
                        type="checkbox"
                        className="form-check-input"
                        checked={form.isHeadOffice || locations.length === 0}
                        onChange={(event) => {
                          setField("isHeadOffice", event.target.checked);
                          if (event.target.checked) setField("status", "active");
                        }}
                        disabled={
                          locations.length === 0 ||
                          Boolean(
                            editingId &&
                              locations.find(
                                (location) => location._id === editingId
                              )?.isHeadOffice
                          )
                        }
                      />
                      <label
                        className="form-check-label fw-semibold"
                        htmlFor="head-office"
                      >
                        {page.makeHeadOffice}
                      </label>
                    </div>
                    <div className="form-text">
                      {form.isHeadOffice
                        ? page.currentHeadOfficeHelp
                        : page.makeHeadOfficeHelp}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <fieldset className="rounded border p-3 p-md-4">
                    <legend className="float-none w-auto px-2 fs-6 fw-semibold">
                      {page.openingHours}
                    </legend>
                    <div className="d-grid gap-3">
                      {days.map((day) => {
                        const item = form.schedule[day];
                        return (
                          <div className="row g-2 align-items-center" key={day}>
                            <div className="col-12 col-md-3">
                              <div className="form-check">
                                <input
                                  id={"day-" + day}
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item.enabled}
                                  onChange={(event) =>
                                    setDayField(day, "enabled", event.target.checked)
                                  }
                                />
                                <label
                                  className="form-check-label fw-semibold"
                                  htmlFor={"day-" + day}
                                >
                                  {page.days[day]}
                                </label>
                              </div>
                            </div>
                            {item.enabled ? (
                              <>
                                <div className="col-6 col-md-4">
                                  <label className="form-label small mb-1">
                                    {page.opensAt}
                                  </label>
                                  <input
                                    type="time"
                                    className="form-control"
                                    value={item.opensAt}
                                    onChange={(event) =>
                                      setDayField(day, "opensAt", event.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div className="col-6 col-md-4">
                                  <label className="form-label small mb-1">
                                    {page.closesAt}
                                  </label>
                                  <input
                                    type="time"
                                    className="form-control"
                                    value={item.closesAt}
                                    onChange={(event) =>
                                      setDayField(day, "closesAt", event.target.value)
                                    }
                                    required
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="col-12 col-md-8 text-secondary small">
                                {page.closed}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              </div>

              {municipalitiesError && (
                <div className="alert alert-danger mt-4 mb-0">
                  {municipalitiesError}
                </div>
              )}
              {error && (
                <div className="alert alert-danger mt-4 mb-0">{error}</div>
              )}
              {notice && (
                <div className="alert alert-success mt-4 mb-0">{notice}</div>
              )}
            </div>

            <div className="card-footer bg-white p-3 d-flex flex-column flex-sm-row gap-2 justify-content-end">
              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => resetForm()}
                >
                  {page.cancelEdit}
                </button>
              )}
              <button
                type="submit"
                className="btn btn-dark"
                disabled={
                  saving ||
                  Boolean(municipalitiesError) ||
                  !form.municipalityId ||
                  !form.name.trim() ||
                  !form.addressLine1.trim()
                }
              >
                {saving
                  ? t("saving")
                  : editingId
                    ? page.updateLocation
                    : page.saveLocation}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
