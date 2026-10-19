import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { DEMO_FALLBACK_ENABLED } from "../services/api";
import {
  publicationCategoriesService,
  publicationsService,
} from "../services/publications.service";
import type {
  Publication,
  PublicationCategory,
  PublicationType,
} from "../services/publications.service";

type Locale = "eu" | "es" | "en" | "ar";
type DataSource = "loading" | "api" | "fallback" | "error";

interface AnnouncementView {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  location: string;
  type: PublicationType;
  contact: string;
  contactMethod: Publication["contactMethod"];
  date: string;
  urgency: Publication["urgency"];
  verified: boolean;
  publisher: string;
}

const pageCopy: Record<
  Locale,
  {
    loading: string;
    fallback: string;
    error: string;
    platformContact: string;
    unknownLocation: string;
    publisher: string;
    typeLabels: Record<PublicationType, string>;
  }
> = {
  es: {
    loading: "Cargando anuncios publicados...",
    fallback:
      "No se pudo conectar con los anuncios. Mostramos temporalmente ejemplos de referencia.",
    error:
      "No se pudo conectar con los anuncios. No se muestran ejemplos en este entorno.",
    platformContact: "Contacto mediante el portal",
    unknownLocation: "Euskadi",
    publisher: "Publicado por",
    typeLabels: {
      announcement: "Anuncio",
      need: "Necesidad",
      offer: "Oferta",
      event: "Evento",
      resource: "Recurso",
    },
  },
  ar: {
    loading: "جارٍ تحميل الإعلانات المنشورة...",
    fallback:
      "تعذر الاتصال بالإعلانات. نعرض مؤقتًا أمثلة مرجعية.",
    error:
      "تعذر الاتصال بالإعلانات. لا تُعرض أمثلة تجريبية في هذه البيئة.",
    platformContact: "التواصل عبر البوابة",
    unknownLocation: "إقليم الباسك",
    publisher: "نشر بواسطة",
    typeLabels: {
      announcement: "إعلان",
      need: "حاجة",
      offer: "عرض",
      event: "فعالية",
      resource: "مورد",
    },
  },
  en: {
    loading: "Loading published announcements...",
    fallback:
      "Announcements are unavailable. Reference examples are shown temporarily.",
    error:
      "Announcements are unavailable. Demo examples are not shown in this environment.",
    platformContact: "Contact through the portal",
    unknownLocation: "Euskadi",
    publisher: "Published by",
    typeLabels: {
      announcement: "Announcement",
      need: "Need",
      offer: "Offer",
      event: "Event",
      resource: "Resource",
    },
  },
  eu: {
    loading: "Argitaratutako iragarkiak kargatzen...",
    fallback:
      "Ezin izan da iragarkietara konektatu. Erreferentzia-adibideak erakusten dira aldi baterako.",
    error:
      "Ezin izan da iragarkietara konektatu. Ingurune honetan ez da demo-adibiderik erakusten.",
    platformContact: "Atariaren bidezko kontaktua",
    unknownLocation: "Euskadi",
    publisher: "Argitaratzailea",
    typeLabels: {
      announcement: "Iragarkia",
      need: "Beharra",
      offer: "Eskaintza",
      event: "Ekitaldia",
      resource: "Baliabidea",
    },
  },
};

function categoryIcon(category: string) {
  const value = category.toLowerCase();

  if (["housing", "vivienda", "accommodation"].includes(value)) return "🏠";
  if (["work", "empleo", "employment", "job"].includes(value)) return "💼";
  if (["education", "educacion", "training"].includes(value)) return "🎓";
  if (["health", "salud", "healthcare"].includes(value)) return "💗";
  if (["legal", "juridico", "jurídico", "immigration"].includes(value)) {
    return "⚖️";
  }
  if (["event", "evento", "community", "comunidad"].includes(value)) {
    return "👥";
  }
  return "📌";
}

function populatedCategory(
  publication: Publication,
  categories: PublicationCategory[]
) {
  if (
    publication.categoryId &&
    typeof publication.categoryId !== "string"
  ) {
    return publication.categoryId;
  }

  if (typeof publication.categoryId === "string") {
    return categories.find(
      (category) => category._id === publication.categoryId
    );
  }

  return undefined;
}

function publicationLocation(
  publication: Publication,
  unknownLocation: string
) {
  const municipality = publication.municipalityId;
  return municipality && typeof municipality !== "string"
    ? municipality.name
    : unknownLocation;
}

function publicationPublisher(publication: Publication) {
  const organization = publication.organizationId;
  if (organization && typeof organization !== "string") {
    return organization.name;
  }

  const author = publication.authorUserId;
  if (author && typeof author !== "string") {
    return author.displayName || author.fullName || "";
  }

  return "";
}

function toAnnouncement(
  publication: Publication,
  categories: PublicationCategory[],
  unknownLocation: string
): AnnouncementView {
  const category = populatedCategory(publication, categories);

  return {
    id: publication._id,
    title: publication.title,
    description: publication.description,
    category: category?.code || "community",
    categoryLabel: category?.name || category?.code || "Community",
    location: publicationLocation(publication, unknownLocation),
    type: publication.type,
    contact: publication.contactValue || "",
    contactMethod: publication.contactMethod,
    date:
      publication.publishedAt ||
      publication.createdAt ||
      new Date().toISOString(),
    urgency: publication.urgency,
    verified: publication.verificationStatus === "verified",
    publisher: publicationPublisher(publication),
  };
}

function contactHref(announcement: AnnouncementView) {
  if (!announcement.contact) return "";

  if (announcement.contactMethod === "email") {
    return "mailto:" + announcement.contact;
  }
  if (announcement.contactMethod === "phone") {
    return "tel:" + announcement.contact;
  }
  if (announcement.contactMethod === "whatsapp") {
    const digits = announcement.contact.replace(/[^\d]/g, "");
    return digits ? "https://wa.me/" + digits : "";
  }
  if (announcement.contactMethod === "external_url") {
    return announcement.contact;
  }

  return "";
}

function fallbackAnnouncements(
  t: (key: string) => string
): AnnouncementView[] {
  return [
    {
      id: "fallback-housing",
      title: t("ad_housing_vitoria"),
      description: t("ad_housing_vitoria_desc"),
      category: "housing",
      categoryLabel: t("f_housing"),
      location: "Vitoria-Gasteiz",
      type: "offer",
      contact: "ana.garcia@email.com",
      contactMethod: "email",
      date: "2026-09-10",
      urgency: "urgent",
      verified: true,
      publisher: "",
    },
    {
      id: "fallback-work",
      title: t("ad_job_bilbao"),
      description: t("ad_job_bilbao_desc"),
      category: "work",
      categoryLabel: t("f_work"),
      location: "Bilbao",
      type: "offer",
      contact: "+34 944 123 456",
      contactMethod: "phone",
      date: "2026-09-09",
      urgency: "normal",
      verified: true,
      publisher: "",
    },
    {
      id: "fallback-education",
      title: t("ad_spanish_classes"),
      description: t("ad_spanish_classes_desc"),
      category: "education",
      categoryLabel: t("f_education"),
      location: "Donostia",
      type: "resource",
      contact: "profesor.jose@email.com",
      contactMethod: "email",
      date: "2026-09-08",
      urgency: "normal",
      verified: false,
      publisher: "",
    },
  ];
}

export default function Anuncios() {
  const { t, locale } = useI18n();
  const activeLocale = (locale as Locale) in pageCopy ? (locale as Locale) : "es";
  const copy = pageCopy[activeLocale];

  const [announcements, setAnnouncements] = useState<AnnouncementView[]>([]);
  const [source, setSource] = useState<DataSource>("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showOnlyUrgent, setShowOnlyUrgent] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    setSource("loading");
    try {
      const [publicationItems, categoryItems] = await Promise.all([
        publicationsService.list(),
        publicationCategoriesService.list(),
      ]);
        setAnnouncements(
          publicationItems.map((publication) =>
            toAnnouncement(
              publication,
              categoryItems,
              copy.unknownLocation
            )
          )
        );
        setSource("api");
    } catch {
      if (DEMO_FALLBACK_ENABLED) {
        setAnnouncements(fallbackAnnouncements(t));
        setSource("fallback");
      } else {
        setAnnouncements([]);
        setSource("error");
      }
    }
  }, [copy.unknownLocation, t]);

  useEffect(() => {
    void loadAnnouncements();
  }, [loadAnnouncements]);

  const categories = [
    { value: "all", label: t("all_categories") },
    ...Array.from(
      new Map(
        announcements.map((announcement) => [
          announcement.category,
          announcement.categoryLabel,
        ])
      )
    ).map(([value, label]) => ({ value, label })),
  ];

  const locations = [
    { value: "all", label: t("all_locations") },
    ...Array.from(
      new Set(
        announcements
          .map((announcement) => announcement.location)
          .filter(Boolean)
      )
    ).map((value) => ({ value, label: value })),
  ];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      announcement.title.toLowerCase().includes(query) ||
      announcement.description.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "all" ||
      announcement.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" ||
      announcement.location === selectedLocation;
    const matchesUrgent =
      !showOnlyUrgent || announcement.urgency !== "normal";

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesUrgent
    );
  });

  return (
    <div className="min-h-screen bg-neutral-background">
      <div className="bg-vitoria-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t("ads_title")}
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {t("ads_subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {source === "loading" && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 text-vitoria-gray">
            {copy.loading}
          </div>
        )}
        {source === "fallback" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <span>{copy.fallback}</span>
            <button
              type="button"
              className="rounded-lg border border-amber-400 bg-white px-3 py-2 text-sm font-bold text-amber-950"
              onClick={() => void loadAnnouncements()}
            >
              {t("retry")}
            </button>
          </div>
        )}
        {source === "error" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900" role="alert">
            <span>{copy.error}</span>
            <button
              type="button"
              className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-bold text-red-950"
              onClick={() => void loadAnnouncements()}
            >
              {t("retry")}
            </button>
          </div>
        )}

        <div className="bg-neutral-surface rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-vitoria-black mb-4">
            {t("filter_ads")}
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-vitoria-black mb-2">
                {t("search")}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-vitoria-black mb-2">
                {t("category")}
              </label>
              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-vitoria-black mb-2">
                {t("location")}
              </label>
              <select
                value={selectedLocation}
                onChange={(event) =>
                  setSelectedLocation(event.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitoria-green focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOnlyUrgent}
                  onChange={(event) =>
                    setShowOnlyUrgent(event.target.checked)
                  }
                  className="mr-2 h-4 w-4 text-vitoria-green focus:ring-vitoria-green border-gray-300 rounded"
                />
                <span className="text-sm text-vitoria-black">
                  {t("urgent_only")}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/login" className="btn-primary no-underline">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t("add_ad")}
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-vitoria-gray">
            {t("showing_results")} {filteredAnnouncements.length}{" "}
            {t("of")} {announcements.length} {t("ads")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {filteredAnnouncements.map((announcement) => {
            const href = contactHref(announcement);
            const contactLabel =
              announcement.contact || copy.platformContact;

            return (
              <article
                key={announcement.id}
                className="bg-neutral-surface rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl">
                      <span aria-hidden="true">
                        {categoryIcon(announcement.category)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-vitoria-black">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-vitoria-gray">
                        {announcement.categoryLabel} •{" "}
                        {announcement.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {announcement.urgency !== "normal" && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {t("urgent")}
                      </span>
                    )}
                    {announcement.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {t("verified")}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-vitoria-gray mb-4">
                  {announcement.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-vitoria-gray">
                      {t("type")}:
                    </span>
                    <span className="font-medium text-vitoria-black ml-2">
                      {copy.typeLabels[announcement.type]}
                    </span>
                  </div>
                  <div>
                    <span className="text-vitoria-gray">
                      {t("date")}:
                    </span>
                    <span className="font-medium text-vitoria-black ml-2">
                      {new Date(announcement.date).toLocaleDateString(
                        locale
                      )}
                    </span>
                  </div>
                </div>

                {announcement.publisher && (
                  <p className="mb-4 text-sm text-vitoria-gray">
                    {copy.publisher}:{" "}
                    <span className="font-medium text-vitoria-black">
                      {announcement.publisher}
                    </span>
                  </p>
                )}

                <div className="flex items-center justify-between gap-4 border-t pt-4">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-vitoria-gray">
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="truncate">{contactLabel}</span>
                  </div>

                  {href ? (
                    <a
                      href={href}
                      target={
                        announcement.contactMethod === "external_url" ||
                        announcement.contactMethod === "whatsapp"
                          ? "_blank"
                          : undefined
                      }
                      rel="noreferrer"
                      className="btn bg-vitoria-green/10 text-vitoria-green hover:bg-vitoria-green hover:text-white transition-colors no-underline"
                    >
                      {t("contact")}
                    </a>
                  ) : (
                    <Link
                      to="/login"
                      className="btn bg-vitoria-green/10 text-vitoria-green hover:bg-vitoria-green hover:text-white transition-colors no-underline"
                    >
                      {t("contact")}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filteredAnnouncements.length === 0 && source !== "loading" && (
          <div className="text-center py-12">
            <div className="text-vitoria-gray mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-vitoria-black mb-2">
              {t("no_ads_found")}
            </h3>
            <p className="text-vitoria-gray mb-6">
              {t("try_different_filters")}
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLocation("all");
                setShowOnlyUrgent(false);
              }}
              className="btn-primary"
            >
              {t("clear_filters")}
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-vitoria-gradient text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              {t("share_your_ad")}
            </h2>
            <p className="text-lg mb-6">
              {t("help_community_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="btn-primary bg-white text-vitoria-green hover:bg-gray-100 no-underline"
              >
                {t("publish_ad")}
              </Link>
              <Link
                to="/contacto"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-vitoria-green transition-colors"
              >
                {t("need_help")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
