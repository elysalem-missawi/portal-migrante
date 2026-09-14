import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";
import {
  moderationService,
  type ModerationTargetType,
  type ReviewDecision,
  type ReviewQueue,
} from "../services/moderation.service";
import type {
  ServiceCostType,
  ServiceDeliveryMode,
} from "../services/services.service";
import { isPlatformAdminUser } from "./guards/ProtectedPlatformStaffRoute";

type Locale = "eu" | "es" | "en" | "ar";

type PageCopy = {
  title: string;
  subtitle: string;
  organizations: string;
  services: string;
  pending: string;
  oldestFirst: string;
  noOrganizations: string;
  noServices: string;
  createdBy: string;
  registration: string;
  locations: string;
  headOffice: string;
  active: string;
  inactive: string;
  missingHeadOffice: string;
  organization: string;
  category: string;
  deliveryModes: string;
  onlineNoLocation: string;
  cost: string;
  appointment: string;
  yes: string;
  no: string;
  organizationFirst: string;
  approve: string;
  reject: string;
  approvalNote: string;
  rejectionReason: string;
  reasonPlaceholder: string;
  confirmApprove: string;
  confirmReject: string;
  cancel: string;
  approvedNotice: string;
  rejectedNotice: string;
  loadError: string;
  reviewError: string;
  recentHistory: string;
  noHistory: string;
  reviewer: string;
  decision: string;
  reason: string;
  date: string;
  targetOrganization: string;
  targetService: string;
  delivery: Record<ServiceDeliveryMode, string>;
  costs: Record<ServiceCostType, string>;
};

const copy: Record<Locale, PageCopy> = {
  es: {
    title: "Revisión de contenidos",
    subtitle:
      "Valida organizaciones y servicios antes de que sean visibles públicamente.",
    organizations: "Organizaciones",
    services: "Servicios",
    pending: "Pendiente de revisión",
    oldestFirst: "Solicitudes más antiguas primero",
    noOrganizations: "No hay organizaciones pendientes.",
    noServices: "No hay servicios pendientes.",
    createdBy: "Registrada por",
    registration: "Número de registro",
    locations: "Sedes declaradas",
    headOffice: "Sede principal",
    active: "Activa",
    inactive: "Inactiva",
    missingHeadOffice:
      "No se puede aprobar hasta que exista una sede principal activa.",
    organization: "Organización",
    category: "Categoría",
    deliveryModes: "Modalidades",
    onlineNoLocation: "Servicio sin sede física",
    cost: "Coste",
    appointment: "Cita previa",
    yes: "Sí",
    no: "No",
    organizationFirst:
      "La organización debe estar activa y verificada antes de aprobar el servicio.",
    approve: "Aprobar y publicar",
    reject: "Rechazar",
    approvalNote: "Nota interna (opcional)",
    rejectionReason: "Motivo del rechazo",
    reasonPlaceholder:
      "Explica qué debe corregirse para que la decisión sea trazable.",
    confirmApprove: "Confirmar aprobación",
    confirmReject: "Confirmar rechazo",
    cancel: "Cancelar",
    approvedNotice: "Elemento aprobado y publicado correctamente.",
    rejectedNotice:
      "Elemento rechazado. El responsable podrá corregirlo y enviarlo de nuevo.",
    loadError: "No se pudo cargar la cola de revisión.",
    reviewError: "No se pudo aplicar la decisión.",
    recentHistory: "Decisiones recientes",
    noHistory: "Todavía no hay decisiones registradas.",
    reviewer: "Revisor",
    decision: "Decisión",
    reason: "Motivo o nota",
    date: "Fecha",
    targetOrganization: "Organización",
    targetService: "Servicio",
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
    title: "مراجعة المحتوى",
    subtitle:
      "تحقق من المنظمات والخدمات قبل أن تصبح ظاهرة للعموم.",
    organizations: "المنظمات",
    services: "الخدمات",
    pending: "قيد المراجعة",
    oldestFirst: "تظهر الطلبات الأقدم أولًا",
    noOrganizations: "لا توجد منظمات تنتظر المراجعة.",
    noServices: "لا توجد خدمات تنتظر المراجعة.",
    createdBy: "سجلها",
    registration: "رقم التسجيل",
    locations: "المقرات المعلنة",
    headOffice: "المقر الرئيسي",
    active: "نشط",
    inactive: "غير نشط",
    missingHeadOffice:
      "لا يمكن الاعتماد قبل وجود مقر رئيسي نشط.",
    organization: "المنظمة",
    category: "الفئة",
    deliveryModes: "طرق تقديم الخدمة",
    onlineNoLocation: "خدمة دون مقر فعلي",
    cost: "التكلفة",
    appointment: "موعد مسبق",
    yes: "نعم",
    no: "لا",
    organizationFirst:
      "يجب اعتماد المنظمة وتفعيلها قبل اعتماد الخدمة.",
    approve: "اعتماد ونشر",
    reject: "رفض",
    approvalNote: "ملاحظة داخلية (اختيارية)",
    rejectionReason: "سبب الرفض",
    reasonPlaceholder:
      "اشرح ما يجب تصحيحه حتى يكون القرار واضحًا وقابلًا للتتبع.",
    confirmApprove: "تأكيد الاعتماد",
    confirmReject: "تأكيد الرفض",
    cancel: "إلغاء",
    approvedNotice: "تم اعتماد العنصر ونشره بنجاح.",
    rejectedNotice:
      "تم رفض العنصر، ويمكن للمسؤول تصحيحه وإرساله للمراجعة من جديد.",
    loadError: "تعذر تحميل قائمة المراجعة.",
    reviewError: "تعذر تطبيق القرار.",
    recentHistory: "القرارات الأخيرة",
    noHistory: "لا توجد قرارات مسجلة حتى الآن.",
    reviewer: "المراجع",
    decision: "القرار",
    reason: "السبب أو الملاحظة",
    date: "التاريخ",
    targetOrganization: "منظمة",
    targetService: "خدمة",
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
    title: "Content review",
    subtitle:
      "Validate organizations and services before they become publicly visible.",
    organizations: "Organizations",
    services: "Services",
    pending: "Pending review",
    oldestFirst: "Oldest requests are shown first",
    noOrganizations: "There are no organizations awaiting review.",
    noServices: "There are no services awaiting review.",
    createdBy: "Registered by",
    registration: "Registration number",
    locations: "Declared locations",
    headOffice: "Head office",
    active: "Active",
    inactive: "Inactive",
    missingHeadOffice:
      "Approval is blocked until an active head office exists.",
    organization: "Organization",
    category: "Category",
    deliveryModes: "Delivery modes",
    onlineNoLocation: "Service without a physical location",
    cost: "Cost",
    appointment: "Appointment",
    yes: "Yes",
    no: "No",
    organizationFirst:
      "The organization must be active and verified before the service can be approved.",
    approve: "Approve and publish",
    reject: "Reject",
    approvalNote: "Internal note (optional)",
    rejectionReason: "Rejection reason",
    reasonPlaceholder:
      "Explain what must be corrected so the decision remains traceable.",
    confirmApprove: "Confirm approval",
    confirmReject: "Confirm rejection",
    cancel: "Cancel",
    approvedNotice: "The item was approved and published.",
    rejectedNotice:
      "The item was rejected. Its manager can correct and resubmit it.",
    loadError: "The review queue could not be loaded.",
    reviewError: "The decision could not be applied.",
    recentHistory: "Recent decisions",
    noHistory: "No decisions have been recorded yet.",
    reviewer: "Reviewer",
    decision: "Decision",
    reason: "Reason or note",
    date: "Date",
    targetOrganization: "Organization",
    targetService: "Service",
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
    title: "Edukien berrikuspena",
    subtitle:
      "Baliozkotu erakundeak eta zerbitzuak publikoki ikusgai jarri aurretik.",
    organizations: "Erakundeak",
    services: "Zerbitzuak",
    pending: "Berrikusteko zain",
    oldestFirst: "Eskaera zaharrenak lehenengo",
    noOrganizations: "Ez dago berrikusteko erakunderik.",
    noServices: "Ez dago berrikusteko zerbitzurik.",
    createdBy: "Erregistratzailea",
    registration: "Erregistro-zenbakia",
    locations: "Adierazitako egoitzak",
    headOffice: "Egoitza nagusia",
    active: "Aktiboa",
    inactive: "Inaktiboa",
    missingHeadOffice:
      "Ezin da onartu egoitza nagusi aktibo bat egon arte.",
    organization: "Erakundea",
    category: "Kategoria",
    deliveryModes: "Arreta-modalitateak",
    onlineNoLocation: "Egoitza fisikorik gabeko zerbitzua",
    cost: "Kostua",
    appointment: "Hitzordua",
    yes: "Bai",
    no: "Ez",
    organizationFirst:
      "Erakundeak aktibo eta egiaztatuta egon behar du zerbitzua onartu aurretik.",
    approve: "Onartu eta argitaratu",
    reject: "Baztertu",
    approvalNote: "Barne-oharra (aukerakoa)",
    rejectionReason: "Baztertzeko arrazoia",
    reasonPlaceholder:
      "Azaldu zer zuzendu behar den erabakia trazagarria izan dadin.",
    confirmApprove: "Berretsi onespena",
    confirmReject: "Berretsi baztertzea",
    cancel: "Utzi",
    approvedNotice: "Elementua onartu eta argitaratu da.",
    rejectedNotice:
      "Elementua baztertu da. Arduradunak zuzendu eta berriro bidal dezake.",
    loadError: "Ezin izan da berrikuspen-ilara kargatu.",
    reviewError: "Ezin izan da erabakia aplikatu.",
    recentHistory: "Azken erabakiak",
    noHistory: "Oraindik ez da erabakirik erregistratu.",
    reviewer: "Berrikuslea",
    decision: "Erabakia",
    reason: "Arrazoia edo oharra",
    date: "Data",
    targetOrganization: "Erakundea",
    targetService: "Zerbitzua",
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

type Selection = {
  targetType: ModerationTargetType;
  targetId: string;
  decision: ReviewDecision;
};

function relationName(
  value:
    | string
    | { name?: string; fullName?: string; displayName?: string }
    | null
    | undefined
) {
  if (!value || typeof value === "string") return "";
  return value.displayName || value.fullName || value.name || "";
}

function dateLabel(value: string | undefined, locale: Locale) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminModerationPage() {
  const { locale } = useI18n();
  const { currentUser } = useAuth();
  const activeLocale = (locale as Locale) in copy ? (locale as Locale) : "es";
  const page = copy[activeLocale];
  const platformAdmin = isPlatformAdminUser(currentUser);

  const [queue, setQueue] = useState<ReviewQueue | null>(null);
  const [activeTab, setActiveTab] = useState<ModerationTargetType>(
    platformAdmin ? "organization" : "service"
  );
  const [selection, setSelection] = useState<Selection | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadQueue = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      setError("");
      try {
        const result = await moderationService.getQueue("all");
        setQueue(result);
        if (
          !result.permissions.canReviewOrganizations &&
          activeTab === "organization"
        ) {
          setActiveTab("service");
        }
      } catch (caught: unknown) {
        const message = caught instanceof Error ? caught.message : "";
        setError(message || page.loadError);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [activeTab, page.loadError]
  );

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  const beginReview = (
    targetType: ModerationTargetType,
    targetId: string,
    decision: ReviewDecision
  ) => {
    setSelection({ targetType, targetId, decision });
    setReason("");
    setError("");
    setNotice("");
  };

  const applyReview = async () => {
    if (!selection || reviewing) return;
    if (selection.decision === "reject" && !reason.trim()) return;

    setReviewing(true);
    setError("");
    try {
      await moderationService.review({
        ...selection,
        reason: reason.trim() || undefined,
      });
      setNotice(
        selection.decision === "approve"
          ? page.approvedNotice
          : page.rejectedNotice
      );
      setSelection(null);
      setReason("");
      await loadQueue(false);
    } catch (caught: unknown) {
      const message = caught instanceof Error ? caught.message : "";
      setError(message || page.reviewError);
    } finally {
      setReviewing(false);
    }
  };

  const reviewControls = (
    targetType: ModerationTargetType,
    targetId: string
  ) => {
    const selected =
      selection?.targetType === targetType &&
      selection.targetId === targetId;

    return (
      <div className="mt-4 border-top pt-3">
        {!selected ? (
          <div className="d-flex flex-column flex-sm-row gap-2">
            <button
              type="button"
              className="btn btn-success"
              onClick={() =>
                beginReview(targetType, targetId, "approve")
              }
            >
              {page.approve}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() =>
                beginReview(targetType, targetId, "reject")
              }
            >
              {page.reject}
            </button>
          </div>
        ) : (
          <div className="rounded border bg-light p-3">
            <label className="form-label fw-semibold">
              {selection.decision === "reject"
                ? page.rejectionReason + " *"
                : page.approvalNote}
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={page.reasonPlaceholder}
              maxLength={2000}
            />
            <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
              <button
                type="button"
                className={
                  selection.decision === "approve"
                    ? "btn btn-success"
                    : "btn btn-danger"
                }
                onClick={applyReview}
                disabled={
                  reviewing ||
                  (selection.decision === "reject" &&
                    !reason.trim())
                }
              >
                {reviewing
                  ? "..."
                  : selection.decision === "approve"
                    ? page.confirmApprove
                    : page.confirmReject}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSelection(null);
                  setReason("");
                }}
                disabled={reviewing}
              >
                {page.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <main className="bg-light min-vh-100 py-5">
        <div className="container text-secondary">...</div>
      </main>
    );
  }

  return (
    <main className="bg-light min-vh-100 py-4 py-lg-5">
      <div className="container" style={{ maxWidth: 1120 }}>
        <div className="mb-4">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <h1 className="h3 fw-bold mb-0">{page.title}</h1>
            <span className="badge text-bg-warning">{page.pending}</span>
          </div>
          <p className="text-secondary mb-1">{page.subtitle}</p>
          <p className="small text-secondary mb-0">{page.oldestFirst}</p>
        </div>

        {notice && <div className="alert alert-success">{notice}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-2">
            <div className="nav nav-pills nav-fill gap-2">
              {queue?.permissions.canReviewOrganizations && (
                <button
                  type="button"
                  className={
                    "nav-link " +
                    (activeTab === "organization" ? "active" : "")
                  }
                  onClick={() => {
                    setActiveTab("organization");
                    setSelection(null);
                  }}
                >
                  {page.organizations}{" "}
                  <span className="badge text-bg-light text-dark">
                    {queue.counts.organizations}
                  </span>
                </button>
              )}
              <button
                type="button"
                className={
                  "nav-link " +
                  (activeTab === "service" ? "active" : "")
                }
                onClick={() => {
                  setActiveTab("service");
                  setSelection(null);
                }}
              >
                {page.services}{" "}
                <span className="badge text-bg-light text-dark">
                  {queue?.counts.services || 0}
                </span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === "organization" ? (
          queue && queue.organizations.length > 0 ? (
            <div className="d-grid gap-4">
              {queue.organizations.map((organization) => {
                const creator = relationName(
                  organization.createdByUserId
                );
                const activeHeadOffice = organization.locations.find(
                  (location) =>
                    location.isHeadOffice &&
                    location.status === "active"
                );

                return (
                  <article
                    className="card border-0 shadow-sm"
                    key={organization._id}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                        <div>
                          <h2 className="h5 fw-bold mb-1">
                            {organization.name}
                          </h2>
                          <div className="text-secondary">
                            {organization.legalName || ""}
                          </div>
                        </div>
                        <span className="badge text-bg-warning align-self-start">
                          {page.pending}
                        </span>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-12 col-md-4">
                          <div className="small text-secondary">
                            {page.registration}
                          </div>
                          <div>{organization.registrationNumber || "-"}</div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="small text-secondary">
                            {page.createdBy}
                          </div>
                          <div>{creator || "-"}</div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="small text-secondary">
                            {page.date}
                          </div>
                          <div>
                            {dateLabel(
                              organization.createdAt,
                              activeLocale
                            )}
                          </div>
                        </div>
                        {organization.description && (
                          <div className="col-12">
                            <p className="mb-0">
                              {organization.description}
                            </p>
                          </div>
                        )}
                      </div>

                      <h3 className="h6 fw-bold mt-4">
                        {page.locations} ({organization.locations.length})
                      </h3>
                      {organization.locations.length > 0 ? (
                        <div className="row g-2">
                          {organization.locations.map((location) => {
                            const municipality =
                              typeof location.municipalityId === "string"
                                ? ""
                                : location.municipalityId?.name || "";
                            return (
                              <div
                                className="col-12 col-md-6"
                                key={location._id}
                              >
                                <div className="rounded border p-3 h-100">
                                  <div className="d-flex justify-content-between gap-2">
                                    <strong>{location.name}</strong>
                                    {location.isHeadOffice && (
                                      <span className="badge text-bg-primary">
                                        {page.headOffice}
                                      </span>
                                    )}
                                  </div>
                                  <div className="small text-secondary mt-1">
                                    {[location.addressLine1, municipality]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </div>
                                  <span
                                    className={
                                      "badge mt-2 " +
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
                            );
                          })}
                        </div>
                      ) : null}

                      {!activeHeadOffice && (
                        <div className="alert alert-danger mt-3 mb-0">
                          {page.missingHeadOffice}
                        </div>
                      )}

                      {reviewControls(
                        "organization",
                        organization._id
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 text-secondary">
                {page.noOrganizations}
              </div>
            </div>
          )
        ) : queue && queue.services.length > 0 ? (
          <div className="d-grid gap-4">
            {queue.services.map((service) => {
              const organization =
                service.organizationId &&
                typeof service.organizationId !== "string"
                  ? service.organizationId
                  : null;
              const category =
                service.categoryId &&
                typeof service.categoryId !== "string"
                  ? service.categoryId
                  : null;
              const organizationReady =
                organization?.status === "active" &&
                organization.verificationStatus === "verified";

              return (
                <article
                  className="card border-0 shadow-sm"
                  key={service._id}
                >
                  <div className="card-body p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div>
                        <h2 className="h5 fw-bold mb-1">
                          {service.title}
                        </h2>
                        <div className="text-secondary">
                          {page.organization}: {organization?.name || "-"}
                        </div>
                      </div>
                      <span className="badge text-bg-warning align-self-start">
                        {page.pending}
                      </span>
                    </div>

                    <p className="mt-3 mb-3">{service.description}</p>

                    <div className="row g-3">
                      <div className="col-12 col-md-4">
                        <div className="small text-secondary">
                          {page.category}
                        </div>
                        <div>{category?.name || "-"}</div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="small text-secondary">
                          {page.cost}
                        </div>
                        <div>{page.costs[service.costType]}</div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="small text-secondary">
                          {page.appointment}
                        </div>
                        <div>
                          {service.appointmentRequired
                            ? page.yes
                            : page.no}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="small text-secondary">
                          {page.deliveryModes}
                        </div>
                        <div className="d-flex flex-wrap gap-2 mt-1">
                          {service.deliveryModes.map((mode) => (
                            <span
                              className="badge text-bg-light border text-dark"
                              key={mode}
                            >
                              {page.delivery[mode]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <h3 className="h6 fw-bold mt-4">
                      {page.locations} ({service.locationIds.length})
                    </h3>
                    {service.locationIds.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {service.locationIds.map((location) => (
                          <span
                            className="badge text-bg-light border text-dark"
                            key={
                              typeof location === "string"
                                ? location
                                : location._id
                            }
                          >
                            {typeof location === "string"
                              ? location
                              : location.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="small text-secondary mb-0">
                        {page.onlineNoLocation}
                      </p>
                    )}

                    {!organizationReady && (
                      <div className="alert alert-danger mt-3 mb-0">
                        {page.organizationFirst}
                      </div>
                    )}

                    {reviewControls("service", service._id)}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-secondary">
              {page.noServices}
            </div>
          </div>
        )}

        <section className="card border-0 shadow-sm mt-5">
          <div className="card-body p-4">
            <h2 className="h4 fw-bold mb-3">{page.recentHistory}</h2>
            {queue && queue.recentActions.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>{page.decision}</th>
                      <th>{page.organization}</th>
                      <th>{page.reviewer}</th>
                      <th>{page.reason}</th>
                      <th>{page.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.recentActions.map((action) => (
                      <tr key={action._id}>
                        <td>
                          <span
                            className={
                              "badge " +
                              (action.action === "approve"
                                ? "text-bg-success"
                                : "text-bg-danger")
                            }
                          >
                            {action.action === "approve"
                              ? page.approve
                              : page.reject}
                          </span>
                        </td>
                        <td>
                          <div className="fw-semibold">
                            {action.targetLabel || "-"}
                          </div>
                          <div className="small text-secondary">
                            {action.targetType === "organization"
                              ? page.targetOrganization
                              : page.targetService}
                          </div>
                        </td>
                        <td>{relationName(action.moderatorUserId) || "-"}</td>
                        <td>{action.reason || "-"}</td>
                        <td>{dateLabel(action.createdAt, activeLocale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-secondary mb-0">{page.noHistory}</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
