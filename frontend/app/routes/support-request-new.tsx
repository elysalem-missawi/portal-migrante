import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useI18n,
} from "../i18n";

import {
  needsService,
  type Need,
} from "../services/needs.service";

import {
  supportRequestsService,
  type SupportRequest,
} from "../services/supportRequests.service";

type Locale =
  | "es"
  | "eu"
  | "ar"
  | "en";

/* =========================================================
   Need translation
========================================================= */

function localizedNeedLabel(
  need: Need,
  locale: Locale
) {
  return (
    need.labels?.[
      locale
    ] ||
    need.labels?.es ||
    need.code
  );
}

function localizedNeedDescription(
  need: Need,
  locale: Locale
) {
  return (
    need.descriptions?.[
      locale
    ] ||
    need.descriptions?.es ||
    ""
  );
}

/* =========================================================
   Page
========================================================= */

export default function SupportRequestNewPage() {
  const {
    locale,
    t,
  } = useI18n();

  const [
    searchParams,
  ] =
    useSearchParams();

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

  const isArabic =
    activeLocale ===
    "ar";

  const initialNeedId =
    searchParams.get(
      "needId"
    )?.trim() ||
    "";

  /* =======================================================
     State
  ======================================================= */

  const [
    needs,
    setNeeds,
  ] = useState<
    Need[]
  >([]);

  const [
    loadingNeeds,
    setLoadingNeeds,
  ] =
    useState(
      true
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    created,
    setCreated,
  ] =
    useState<
      SupportRequest |
      null
    >(null);

  const [
    form,
    setForm,
  ] =
    useState({
      mainNeedId:
        initialNeedId,

      title:
        "",

      description:
        "",
    });

  /* =======================================================
     Load Needs
  ======================================================= */

  useEffect(() => {
    let mounted =
      true;

    const load =
      async () => {
        setLoadingNeeds(
          true
        );

        try {
          const data =
            await needsService.list();

          if (!mounted) {
            return;
          }

          setNeeds(
            Array.isArray(
              data
            )
              ? data
              : []
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to load needs:",
            error
          );

          if (
            mounted
          ) {
            setError(
              t(
                "no_data"
              )
            );
          }
        } finally {
          if (
            mounted
          ) {
            setLoadingNeeds(
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
     Selected Need
  ======================================================= */

  const selectedNeed =
    useMemo(
      () =>
        needs.find(
          (
            need
          ) =>
            need._id ===
            form.mainNeedId
        ) ||
        null,
      [
        needs,
        form.mainNeedId,
      ]
    );

  /* =======================================================
     Submit
  ======================================================= */

  const submit =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      setError(
        ""
      );

      const title =
        form.title.trim();

      const description =
        form.description.trim();

      if (
        !form.mainNeedId ||
        !title ||
        !description
      ) {
        setError(
          t(
            "no_data"
          )
        );

        return;
      }

      try {
        setSubmitting(
          true
        );

        const result =
          await supportRequestsService.create(
            {
              mainNeedId:
                form.mainNeedId,

              relatedNeedIds:
                [],

              title,

              description,

              sourceLanguage:
                activeLocale,

              urgency:
                "normal",

              contactPreference:
                "platform",
            }
          );

        setCreated(
          result
        );
      } catch (
        error: any
      ) {
        console.error(
          "Failed to create support request:",
          error
        );

        setError(
          String(
            error?.message ||
              t(
                "no_data"
              )
          )
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  /* =======================================================
     Success
  ======================================================= */

  if (created) {
    return (
      <main
        dir={
          isArabic
            ? "rtl"
            : "ltr"
        }
        className="min-h-screen bg-slate-50"
      >
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6">
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-start shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
              ✓
            </div>

            <h1 className="mt-6 text-2xl font-black text-slate-950">
              {t(
                "contact_success_title"
              )}
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              {t(
                "contact_success_message"
              )}
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                {t(
                  "subject"
                )}
              </p>

              <p className="mt-1 font-bold text-slate-950">
                {
                  created.title
                }
              </p>

              <p className="mt-5 text-sm font-bold text-slate-500">
                {t(
                  "status"
                )}
              </p>

              <p className="mt-1 font-semibold text-emerald-700">
                {
                  created.status
                }
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {selectedNeed && (
                <Link
                  to={`/necesidades/${selectedNeed._id}`}
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white no-underline"
                >
                  {t(
                    "back"
                  )}
                </Link>
              )}

              <Link
                to="/foro"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 no-underline"
              >
                {t(
                  "nav_forum"
                )}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     Form
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
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
          <Link
            to={
              initialNeedId
                ? `/necesidades/${initialNeedId}`
                : "/necesidades"
            }
            className="text-sm font-bold text-emerald-700 no-underline"
          >
            {t(
              "back"
            )}
          </Link>

          <div className="mt-7 max-w-2xl text-start">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              🤲
            </div>

            <h1 className="mt-5 text-3xl font-black text-slate-950">
              {t(
                "need_detail_support_title"
              )}
            </h1>

            <p className="mt-3 leading-7 text-slate-600">
              {t(
                "need_detail_support_text"
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {loadingNeeds ? (
            <div className="py-12 text-center text-slate-500">
              {t(
                "loading"
              )}
            </div>
          ) : (
            <form
              onSubmit={
                submit
              }
            >
              {/* =============================================
                  MAIN NEED
              ============================================= */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t(
                    "needs_title"
                  )}
                </label>

                <select
                  value={
                    form.mainNeedId
                  }
                  disabled={
                    Boolean(
                      initialNeedId
                    )
                  }
                  required
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        mainNeedId:
                          event.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    —
                  </option>

                  {needs.map(
                    (
                      need
                    ) => (
                      <option
                        key={
                          need._id
                        }
                        value={
                          need._id
                        }
                      >
                        {localizedNeedLabel(
                          need,
                          activeLocale
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* =============================================
                  Selected Need context
              ============================================= */}

              {selectedNeed && (
                <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <p className="font-black text-emerald-900">
                    {localizedNeedLabel(
                      selectedNeed,
                      activeLocale
                    )}
                  </p>

                  {localizedNeedDescription(
                    selectedNeed,
                    activeLocale
                  ) && (
                    <p className="mt-2 text-sm leading-6 text-emerald-900/70">
                      {localizedNeedDescription(
                        selectedNeed,
                        activeLocale
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* =============================================
                  TITLE
              ============================================= */}

              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t(
                    "subject"
                  )}
                </label>

                <input
                  value={
                    form.title
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        title:
                          event.target.value,
                      })
                    )
                  }
                  maxLength={
                    180
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* =============================================
                  DESCRIPTION
              ============================================= */}

              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t(
                    "message"
                  )}
                </label>

                <textarea
                  rows={
                    7
                  }
                  value={
                    form.description
                  }
                  onChange={(
                    event
                  ) =>
                    setForm(
                      (
                        current
                      ) => ({
                        ...current,

                        description:
                          event.target.value,
                      })
                    )
                  }
                  maxLength={
                    6000
                  }
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* =============================================
                  Current V1 defaults
              ============================================= */}

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    🔒
                  </div>

                  <div className="text-start">
                    <p className="font-bold text-slate-800">
                      Portal Migrante
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {t(
                        "community_trust_desc"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  Error
              ============================================= */}

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {
                    error
                  }
                </div>
              )}

              {/* =============================================
                  Actions
              ============================================= */}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  to={
                    initialNeedId
                      ? `/necesidades/${initialNeedId}`
                      : "/necesidades"
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-600 no-underline"
                >
                  {t(
                    "cancel"
                  )}
                </Link>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !form.mainNeedId ||
                    !form.title.trim() ||
                    !form.description.trim()
                  }
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting
                    ? t(
                        "loading"
                      )
                    : t(
                        "send_message_btn"
                      )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}