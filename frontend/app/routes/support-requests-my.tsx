import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useI18n,
} from "../i18n";

import {
  supportRequestsService,
  type SupportRequest,
  type SupportRequestStatus,
  type SupportContactPreference,
} from "../services/supportRequests.service";

import type {
  Need,
} from "../services/needs.service";

type Locale =
  | "es"
  | "eu"
  | "ar"
  | "en";

type Filter =
  | "all"
  | SupportRequestStatus;

/* =========================================================
   Helpers
========================================================= */

function localizedNeedLabel(
  need:
    | string
    | Need,
  locale:
    Locale
) {
  if (
    typeof need ===
    "string"
  ) {
    return "";
  }

  return (
    need.labels?.[
      locale
    ] ||
    need.labels?.es ||
    need.code
  );
}

function formatDate(
  value:
    string,
  locale:
    string
) {
  return new Intl.DateTimeFormat(
    locale,
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    }
  ).format(
    new Date(
      value
    )
  );
}

function statusClass(
  status:
    SupportRequestStatus
) {
  switch (
    status
  ) {
    case "resolved":
      return "bg-emerald-50 text-emerald-700";

    case "closed":
      return "bg-slate-100 text-slate-600";

    case "in_progress":
      return "bg-blue-50 text-blue-700";

    case "in_review":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-violet-50 text-violet-700";
  }
}

function statusTranslationKey(
  status:
    SupportRequestStatus
) {
  switch (
    status
  ) {
    case "in_review":
      return "support_status_in_review";

    case "in_progress":
      return "support_status_in_progress";

    case "resolved":
      return "support_status_resolved";

    case "closed":
      return "support_status_closed";

    default:
      return "support_status_open";
  }
}

function contactTranslationKey(
  value:
    SupportContactPreference
) {
  switch (
    value
  ) {
    case "email":
      return "support_contact_email";

    case "phone":
      return "support_contact_phone";

    default:
      return "support_contact_platform";
  }
}

/* =========================================================
   Page
========================================================= */

export default function SupportRequestsMyPage() {
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
    ).includes(
      locale
    )
      ? (locale as Locale)
      : "es";

  const isArabic =
    activeLocale ===
    "ar";

  const [
    requests,
    setRequests,
  ] = useState<
    SupportRequest[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    error,
    setError,
  ] = useState(
    ""
  );

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "all"
    );

  /* =======================================================
     Load
  ======================================================= */

  useEffect(() => {
    let mounted =
      true;

    const load =
      async () => {
        setLoading(
          true
        );

        setError(
          ""
        );

        try {
          const result =
            await supportRequestsService.listMine();

          if (
            !mounted
          ) {
            return;
          }

          setRequests(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (
          error: any
        ) {
          console.error(
            "Failed to load support requests:",
            error
          );

          if (
            mounted
          ) {
            setError(
              String(
                error?.message ||
                  t(
                    "no_data"
                  )
              )
            );
          }
        } finally {
          if (
            mounted
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void load();

    return () => {
      mounted =
        false;
    };
  }, [
    t,
  ]);

  /* =======================================================
     Filter
  ======================================================= */

  const visibleRequests =
    useMemo(
      () => {
        if (
          filter ===
          "all"
        ) {
          return requests;
        }

        return requests.filter(
          (
            request
          ) =>
            request.status ===
            filter
        );
      },
      [
        requests,
        filter,
      ]
    );

  const filters: Array<{
    value: Filter;
    label: string;
  }> = [
    {
      value: "all",
      label: t(
        "support_status_all"
      ),
    },
    {
      value: "open",
      label: t(
        "support_status_open"
      ),
    },
    {
      value: "in_review",
      label: t(
        "support_status_in_review"
      ),
    },
    {
      value: "in_progress",
      label: t(
        "support_status_in_progress"
      ),
    },
    {
      value: "resolved",
      label: t(
        "support_status_resolved"
      ),
    },
    {
      value: "closed",
      label: t(
        "support_status_closed"
      ),
    },
  ];

  /* =======================================================
     Render
  ======================================================= */

  return (
    <main
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      className="min-h-screen bg-slate-50"
    >
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
          <Link
            to="/profile"
            className="text-sm font-bold text-emerald-700 no-underline"
          >
            {t(
              "back"
            )}
          </Link>

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl text-start">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                🤲
              </div>

              <h1 className="mt-5 text-3xl font-black text-slate-950">
                {t(
                  "support_my_title"
                )}
              </h1>

              <p className="mt-3 leading-7 text-slate-600">
                {t(
                  "support_my_intro"
                )}
              </p>
            </div>

            <Link
              to="/support/new"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-emerald-700"
            >
              <span
                aria-hidden
              >
                +
              </span>

              <span className="ms-2">
                {t(
                  "support_new_request"
                )}
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          {filters.map(
            (
              item
            ) => (
              <button
                key={
                  item.value
                }
                type="button"
                onClick={() =>
                  setFilter(
                    item.value
                  )
                }
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  filter ===
                  item.value
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {
                  item.label
                }
              </button>
            )
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {
              error
            }
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              {t(
                "loading"
              )}
            </p>
          </div>
        ) : visibleRequests.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🤲
            </div>

            <p className="mt-4 font-bold text-slate-700">
              {t(
                "no_data"
              )}
            </p>

            <Link
              to="/support/new"
              className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white no-underline"
            >
              {t(
                "support_new_request"
              )}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleRequests.map(
              (
                request
              ) => {
                const needLabel =
                  localizedNeedLabel(
                    request.mainNeedId,
                    activeLocale
                  );

                return (
                  <article
                    key={
                      request._id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 text-start">
                        <div className="flex flex-wrap items-center gap-2">
                          {needLabel && (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              {
                                needLabel
                              }
                            </span>
                          )}

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                              request.status
                            )}`}
                          >
                            {t(
                              statusTranslationKey(
                                request.status
                              )
                            )}
                          </span>
                        </div>

                        <h2 className="mt-4 text-lg font-black leading-7 text-slate-950 sm:text-xl">
                          {
                            request.title
                          }
                        </h2>

                        <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {
                            request.description
                          }
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
                          <span>
                            {formatDate(
                              request.createdAt,
                              activeLocale
                            )}
                          </span>

                          <span>
                            ·
                          </span>

                          <span>
                            {t(
                              contactTranslationKey(
                                request.contactPreference
                              )
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg">
                          {isArabic
                            ? "←"
                            : "→"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}
