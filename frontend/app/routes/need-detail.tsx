import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { useI18n } from "../i18n";

import {
  needsService,
  type Need,
} from "../services/needs.service";

import {
  contentItemsService,
  type ContentItem,
  type GuideStep,
} from "../services/contentItems.service";

import {
  servicesService,
  type Service,
  type ServiceTranslation,
} from "../services/services.service";

type Locale =
  | "es"
  | "eu"
  | "ar"
  | "en";

type LoadState =
  | "loading"
  | "ready"
  | "error"
  | "not-found";

type IconName =
  | "housing"
  | "employment"
  | "education_training"
  | "health"
  | "legal_immigration"
  | "administrative_procedures"
  | "social_services"
  | "language"
  | "family"
  | "community_participation"
  | "default";

function NeedIcon({
  code,
  className = "text-4xl",
}: {
  code: string;
  className?: string;
}) {
  const icons: Record<
    IconName,
    string
  > = {
    housing: "🏠",
    employment: "💼",
    education_training: "🎓",
    health: "💗",
    legal_immigration: "⚖️",
    administrative_procedures: "📄",
    social_services: "🤝",
    language: "🗣️",
    family: "👨‍👩‍👧",
    community_participation: "🌍",
    default: "📌",
  };

  return (
    <span
      aria-hidden="true"
      className={className}
    >
      {icons[
        code as IconName
      ] || icons.default}
    </span>
  );
}

function localizedValue(
  values:
    | Record<
        string,
        string | undefined
      >
    | undefined,
  locale: Locale
) {
  if (!values) {
    return "";
  }

  return (
    values[locale] ||
    values.es ||
    ""
  );
}

function localizedContent(
  item: ContentItem,
  locale: Locale
) {
  return (
    item.translations[
      locale
    ] ||
    item.translations.es
  );
}

function localizedStep(
  step: GuideStep,
  locale: Locale
) {
  return (
    step.translations[
      locale
    ] ||
    step.translations.es
  );
}

function localizedService(
  service: Service,
  locale: Locale
): ServiceTranslation {
  const translated =
    service.translations?.[
      locale
    ];

  const spanish =
    service.translations?.es;

  if (
    translated?.title &&
    translated?.description
  ) {
    return translated;
  }

  if (
    spanish?.title &&
    spanish?.description
  ) {
    return spanish;
  }

  return {
    title:
      service.title,

    description:
      service.description,

    eligibility:
      service.eligibility ||
      "",
  };
}

function serviceOrganizationName(
  service: Service
) {
  const organization =
    service.organizationId;

  if (
    organization &&
    typeof organization !==
      "string"
  ) {
    return (
      organization.name ||
      ""
    );
  }

  return "";
}

export default function NeedDetailPage() {
  const { id } =
    useParams();

  const {
    locale,
    t,
  } = useI18n();

  const activeLocale =
    (
      [
        "es",
        "eu",
        "ar",
        "en",
      ] as string[]
    ).includes(locale)
      ? (locale as Locale)
      : "es";

  const [
    need,
    setNeed,
  ] = useState<
    Need | null
  >(null);

  const [
    contentItems,
    setContentItems,
  ] = useState<
    ContentItem[]
  >([]);

  const [
    services,
    setServices,
  ] = useState<
    Service[]
  >([]);

  const [
    state,
    setState,
  ] =
    useState<LoadState>(
      "loading"
    );

  useEffect(() => {
    let mounted = true;

    const loadData =
      async () => {
        if (!id) {
          setState(
            "not-found"
          );

          return;
        }

        setState(
          "loading"
        );

        try {
          const [
            needData,
            contentData,
            serviceData,
          ] =
            await Promise.all([
              needsService.getById(
                id
              ),

              contentItemsService.list(
                {
                  needId:
                    id,
                }
              ),

              servicesService.list(
                {
                  needId:
                    id,
                }
              ),
            ]);

          if (!mounted) {
            return;
          }

          setNeed(
            needData
          );

          setContentItems(
            contentData
          );

          setServices(
            serviceData
          );

          setState(
            "ready"
          );
        } catch (
          error: any
        ) {
          console.error(
            "Failed to load need detail:",
            error
          );

          if (!mounted) {
            return;
          }

          if (
            error?.status ===
            404
          ) {
            setState(
              "not-found"
            );
          } else {
            setState(
              "error"
            );
          }
        }
      };

    void loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const label =
    useMemo(
      () =>
        localizedValue(
          need?.labels,
          activeLocale
        ),
      [
        need,
        activeLocale,
      ]
    );

  const description =
    useMemo(
      () =>
        localizedValue(
          need?.descriptions,
          activeLocale
        ),
      [
        need,
        activeLocale,
      ]
    );

  const informationItems =
    useMemo(
      () =>
        contentItems
          .filter(
            (item) =>
              item.type ===
              "information"
          )
          .sort(
            (
              a,
              b
            ) =>
              a.order -
              b.order
          ),
      [contentItems]
    );

  const guideItems =
    useMemo(
      () =>
        contentItems
          .filter(
            (item) =>
              item.type ===
              "guide"
          )
          .sort(
            (
              a,
              b
            ) =>
              a.order -
              b.order
          ),
      [contentItems]
    );

  const resourceItems =
    useMemo(
      () =>
        contentItems
          .filter(
            (item) =>
              item.type ===
              "external_resource"
          )
          .sort(
            (
              a,
              b
            ) =>
              a.order -
              b.order
          ),
      [contentItems]
    );

  if (
    state ===
    "loading"
  ) {
    return (
      <main className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600">
            {t(
              "need_detail_loading"
            )}
          </div>
        </div>
      </main>
    );
  }

  if (
    state ===
    "error"
  ) {
    return (
      <main className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <h1 className="text-xl font-bold text-red-900">
              {t(
                "need_detail_error_title"
              )}
            </h1>

            <p className="mt-2 text-red-700">
              {t(
                "need_detail_error_text"
              )}
            </p>

            <Link
              to="/necesidades"
              className="mt-6 inline-flex font-semibold text-emerald-700 no-underline"
            >
              {t(
                "need_detail_back"
              )}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (
    state ===
      "not-found" ||
    !need
  ) {
    return (
      <main className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-700">
              {t(
                "need_detail_not_found"
              )}
            </p>

            <Link
              to="/necesidades"
              className="mt-6 inline-flex font-semibold text-emerald-700 no-underline"
            >
              {t(
                "need_detail_back"
              )}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <Link
            to="/necesidades"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 no-underline hover:text-emerald-800"
          >
            <span
              aria-hidden
            >
              {activeLocale ===
              "ar"
                ? "→"
                : "←"}
            </span>

            {t(
              "need_detail_breadcrumb"
            )}
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-50">
              <NeedIcon
                code={
                  need.code
                }
              />
            </div>

            <div className="max-w-3xl text-start">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                {t(
                  "portal_brand"
                )}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {label}
              </h1>

              {description && (
                <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                  {
                    description
                  }
                </p>
              )}

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                {t(
                  "need_detail_intro"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {informationItems.length >
        0 && (
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 lg:px-8">
          <div className="mb-5 text-start">
            <h2 className="text-2xl font-bold text-slate-950">
              {t(
                "need_detail_info_title"
              )}
            </h2>

            <p className="mt-2 text-slate-600">
              {t(
                "need_detail_info_text"
              )}
            </p>
          </div>

          <div className="grid gap-4">
            {informationItems.map(
              (item) => {
                const content =
                  localizedContent(
                    item,
                    activeLocale
                  );

                return (
                  <article
                    key={
                      item._id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-slate-950">
                      {
                        content.title
                      }
                    </h3>

                    {content.summary && (
                      <p className="mt-2 font-medium leading-6 text-slate-700">
                        {
                          content.summary
                        }
                      </p>
                    )}

                    {content.content && (
                      <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                        {
                          content.content
                        }
                      </p>
                    )}

                    <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      {
                        item.source
                          .name
                      }
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>
      )}

      {guideItems.length >
        0 && (
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 lg:px-8">
          <div className="mb-5 text-start">
            <h2 className="text-2xl font-bold text-slate-950">
              {t(
                "need_detail_guides_title"
              )}
            </h2>

            <p className="mt-2 text-slate-600">
              {t(
                "need_detail_guides_text"
              )}
            </p>
          </div>

          <div className="grid gap-5">
            {guideItems.map(
              (item) => {
                const content =
                  localizedContent(
                    item,
                    activeLocale
                  );

                const steps =
                  [
                    ...(item.steps ||
                      []),
                  ].sort(
                    (
                      a,
                      b
                    ) =>
                      a.order -
                      b.order
                  );

                return (
                  <article
                    key={
                      item._id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-slate-950">
                      {
                        content.title
                      }
                    </h3>

                    {content.summary && (
                      <p className="mt-2 leading-6 text-slate-600">
                        {
                          content.summary
                        }
                      </p>
                    )}

                    {content.content && (
                      <p className="mt-3 leading-7 text-slate-600">
                        {
                          content.content
                        }
                      </p>
                    )}

                    <div className="mt-6 space-y-4">
                      {steps.map(
                        (
                          step,
                          index
                        ) => {
                          const stepContent =
                            localizedStep(
                              step,
                              activeLocale
                            );

                          return (
                            <div
                              key={`${item._id}-${step.order}-${index}`}
                              className="flex gap-4 rounded-xl bg-slate-50 p-4"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                {index +
                                  1}
                              </div>

                              <div className="text-start">
                                <h4 className="font-semibold text-slate-900">
                                  {
                                    stepContent.title
                                  }
                                </h4>

                                {stepContent.content && (
                                  <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {
                                      stepContent.content
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      {
                        item.source
                          .name
                      }
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>
      )}

      {resourceItems.length >
        0 && (
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 lg:px-8">
          <div className="mb-5 text-start">
            <h2 className="text-2xl font-bold text-slate-950">
              {t(
                "need_detail_resources_title"
              )}
            </h2>

            <p className="mt-2 text-slate-600">
              {t(
                "need_detail_resources_text"
              )}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {resourceItems.map(
              (item) => {
                const content =
                  localizedContent(
                    item,
                    activeLocale
                  );

                const url =
                  item
                    .resourceData
                    ?.url ||
                  item.source
                    .url;

                return (
                  <article
                    key={
                      item._id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                      🔗
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-950">
                      {
                        content.title
                      }
                    </h3>

                    {content.summary && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {
                          content.summary
                        }
                      </p>
                    )}

                    {content.content && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {
                          content.content
                        }
                      </p>
                    )}

                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center font-semibold text-emerald-700 no-underline hover:text-emerald-800"
                      >
                        {t(
                          "need_detail_open_resource"
                        )}

                        <span
                          className="ms-2"
                          aria-hidden
                        >
                          ↗
                        </span>
                      </a>
                    )}

                    <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                      {
                        item.source
                          .name
                      }
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>
      )}

      {services.length >
        0 && (
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 lg:px-8">
          <div className="mb-5 max-w-3xl text-start">
            <h2 className="text-2xl font-bold text-slate-950">
              {t(
                "need_detail_services_title"
              )}
            </h2>

            <p className="mt-2 leading-7 text-slate-600">
              {t(
                "need_detail_services_text"
              )}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {services.map(
              (service) => {
                const content =
                  localizedService(
                    service,
                    activeLocale
                  );

                const organizationName =
                  serviceOrganizationName(
                    service
                  );

                return (
                  <article
                    key={
                      service._id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                        🏢
                      </div>

                      <div className="min-w-0 flex-1 text-start">
                        <h3 className="text-lg font-bold leading-6 text-slate-950">
                          {
                            content.title
                          }
                        </h3>

                        {organizationName && (
                          <p className="mt-2 text-sm font-semibold text-emerald-700">
                            {
                              organizationName
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-5 leading-7 text-slate-600">
                      {
                        content.description
                      }
                    </p>

                    {content.eligibility && (
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {
                          content.eligibility
                        }
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
                      <Link
                        to={`/servicios/${service._id}/detalle`}
                        className="inline-flex items-center font-semibold text-emerald-700 no-underline hover:text-emerald-800"
                      >
                        {t(
                          "need_detail_services_action"
                        )}
                      </Link>

                      {service.website && (
                        <a
                          href={
                            service.website
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-slate-600 no-underline"
                        >
                          {t(
                            "website"
                          )}
                        </a>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-3xl text-start">
          <h2 className="text-2xl font-bold text-slate-950">
            {t(
              "need_detail_journey_title"
            )}
          </h2>

          <p className="mt-2 leading-7 text-slate-600">
            {t(
              "need_detail_journey_text"
            )}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to={`/foro?needId=${need._id}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              💬
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              {t(
                "need_detail_community_title"
              )}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t(
                "need_detail_community_text"
              )}
            </p>

            <div className="mt-5 text-sm font-semibold text-emerald-700">
              {t(
                "need_detail_community_action"
              )}
            </div>
          </Link>

          {/* =================================================
              SUPPORT REQUEST
          ================================================= */}

          <Link
            to={`/support/new?needId=${need._id}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              🤲
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-950">
              {t(
                "need_detail_support_title"
              )}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t(
                "need_detail_support_text"
              )}
            </p>

            <div className="mt-5 text-sm font-semibold text-emerald-700">
              {t(
                "need_detail_support_action"
              )}
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}