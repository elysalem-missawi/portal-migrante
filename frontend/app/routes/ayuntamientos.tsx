import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  municipalitiesService,
  type Municipality,
} from "../services/municipalities.service";
import { useI18n } from "../i18n";
import ServicePagesNav from "../components/ServicePagesNav";

export default function AyuntamientosPage() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [territory, setTerritory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadMunicipalities() {
      try {
        const data = await municipalitiesService.list();
        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(String(err?.message || err || t("ay_error")));
      } finally {
        setLoading(false);
      }
    }

    void loadMunicipalities();
  }, [t]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTerritory =
        territory === "all" ? true : item.territory === territory;

      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        String(item.name || "").toLowerCase().includes(query) ||
        String(item.municipio || "").toLowerCase().includes(query) ||
        String(item.address || "").toLowerCase().includes(query);

      return matchesTerritory && matchesSearch;
    });
  }, [items, search, territory]);

  const territoryCount = useMemo(() => {
    return new Set(items.map((item) => item.territory).filter(Boolean)).size;
  }, [items]);

  const websitesCount = useMemo(() => {
    return items.filter((item) => Boolean(item.website)).length;
  }, [items]);

  const territoryLabel = (value?: string) => {
    switch (value) {
      case "alava":
        return t("territory_alava");
      case "bizkaia":
        return t("territory_bizkaia");
      case "gipuzkoa":
        return t("territory_gipuzkoa");
      default:
        return value || t("territory_undefined");
    }
  };

  const territoryBadgeClass = (value?: string) => {
    switch (value) {
      case "alava":
        return "bg-emerald-50 text-emerald-700";
      case "bizkaia":
        return "bg-blue-50 text-blue-700";
      case "gipuzkoa":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const googleMapsUrl = (item: Municipality) => {
    const query = [
      item.address,
      item.name || item.municipio,
      territoryLabel(item.territory),
      "Euskadi",
    ]
      .filter(Boolean)
      .join(", ");

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container py-5">
          <div className="text-secondary">{t("ay_loading")}</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container py-5">
          <div className="alert alert-danger mb-0" role="alert">
            {t("ay_error")} {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-bottom bg-white">
        <div className="container py-4 py-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 rounded-pill bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 mb-3">
                <span aria-hidden="true">{"\uD83C\uDFDB\uFE0F"}</span>
                {t("ay_eyebrow")}
              </div>
              <h1 className="display-6 fw-bold text-vitoria-black mb-3">
                {t("ay_title")}
              </h1>
              <p className="lead text-secondary mb-0">{t("ay_intro")}</p>
            </div>

            <div className="col-12 col-lg-4">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                <img
                  src="/images/registration-migrant-travel-hero.png"
                  alt=""
                  className="h-48 w-full object-cover"
                  style={{ objectPosition: "center 35%" }}
                />
              </div>
            </div>
          </div>
          <ServicePagesNav activeId="ayuntamientos" />
        </div>
      </section>

      <div className="container py-4 py-lg-5">
        <section className="mb-4">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="h-100 rounded-3 border bg-white p-3 shadow-sm">
                <div className="text-secondary small mb-1">{t("ay_total")}</div>
                <div className="h4 fw-bold mb-0">
                  {items.length.toLocaleString(locale)}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="h-100 rounded-3 border bg-white p-3 shadow-sm">
                <div className="text-secondary small mb-1">
                  {t("ay_territories_count")}
                </div>
                <div className="h4 fw-bold mb-0">
                  {territoryCount.toLocaleString(locale)}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="h-100 rounded-3 border bg-white p-3 shadow-sm">
                <div className="text-secondary small mb-1">
                  {t("ay_online_count")}
                </div>
                <div className="h4 fw-bold mb-0">
                  {websitesCount.toLocaleString(locale)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-3 border bg-white p-3 p-lg-4 shadow-sm">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-lg-8">
              <label htmlFor="municipality-search" className="form-label fw-semibold">
                {t("search")}
              </label>
              <input
                id="municipality-search"
                type="text"
                className="form-control form-control-lg"
                placeholder={t("ay_search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-12 col-lg-4">
              <label htmlFor="municipality-territory" className="form-label fw-semibold">
                {t("location")}
              </label>
              <select
                id="municipality-territory"
                className="form-select form-select-lg"
                value={territory}
                onChange={(e) => setTerritory(e.target.value)}
              >
                <option value="all">{t("ay_all_territories")}</option>
                <option value="alava">{t("territory_alava")}</option>
                <option value="bizkaia">{t("territory_bizkaia")}</option>
                <option value="gipuzkoa">{t("territory_gipuzkoa")}</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-secondary small">
            {filteredItems.length.toLocaleString(locale)}{" "}
            {filteredItems.length === 1 ? t("result_singular") : t("result_plural")}
          </div>
        </section>

        {filteredItems.length === 0 ? (
          <div className="alert alert-light border shadow-sm" role="alert">
            {t("ay_empty")}
          </div>
        ) : (
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="col-12 col-md-6 col-xl-4">
                <article className="h-100 rounded-3 border bg-white p-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-teal-400 to-emerald-500 text-2xl shadow-sm">
                        <span aria-hidden="true">{"\uD83C\uDFDB\uFE0F"}</span>
                      </div>
                      <h2 className="h5 fw-bold text-dark mb-1">
                        {item.name || t("organization_type_municipality")}
                      </h2>
                      {item.municipio && (
                        <div className="text-secondary small">{item.municipio}</div>
                      )}
                    </div>

                    <span
                      className={`rounded-pill px-3 py-2 text-sm font-semibold ${territoryBadgeClass(
                        item.territory
                      )}`}
                    >
                      {territoryLabel(item.territory)}
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-2 small">
                    {item.address && (
                      <div className="d-flex align-items-start gap-2">
                        <span className="text-success" aria-hidden="true">
                          {"\uD83D\uDCCD"}
                        </span>
                        <span className="text-dark">{item.address}</span>
                      </div>
                    )}

                    {item.phone && (
                      <div className="d-flex align-items-start gap-2">
                        <span className="text-success" aria-hidden="true">
                          {"\u260E"}
                        </span>
                        <span className="text-dark">{item.phone}</span>
                      </div>
                    )}

                    {item.email && (
                      <div className="d-flex align-items-start gap-2">
                        <span className="text-success" aria-hidden="true">
                          @
                        </span>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-decoration-none text-dark text-break"
                        >
                          {item.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-top pt-3">
                    <div className="row g-2 small">
                      {item.population !== undefined && item.population !== null && (
                        <div className="col-6">
                          <div className="text-secondary">{t("population")}</div>
                          <div className="fw-semibold">
                            {item.population.toLocaleString(locale)}
                          </div>
                        </div>
                      )}
                      <div className="col-6">
                        <div className="text-secondary">{t("status")}</div>
                        <div className="fw-semibold">{t("available")}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="btn btn-success w-100 rounded-pill fw-semibold"
                      onClick={() =>
                        setExpandedId((current) =>
                          current === item._id ? null : item._id
                        )
                      }
                      aria-expanded={expandedId === item._id}
                    >
                      {t("view_details")}
                    </button>
                  </div>

                  {expandedId === item._id && (
                    <div className="mt-3 rounded-3 border bg-light p-3">
                      <div className="d-grid gap-2">
                        <a
                          href={googleMapsUrl(item)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-success rounded-pill fw-semibold"
                        >
                          {t("open_google_maps")}
                        </a>

                        {item.website ? (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary rounded-pill fw-semibold"
                          >
                            {t("ay_official_site")}
                          </a>
                        ) : (
                          <div className="text-secondary small text-center">
                            {t("ay_no_site")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
