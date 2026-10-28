import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useI18n } from "../i18n";

import {
  needsService,
  type Need,
} from "../services/needs.service";

type Locale =
  | "es"
  | "eu"
  | "ar"
  | "en";

type LoadState =
  | "loading"
  | "ready"
  | "error";

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
}: {
  code: string;
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
      className="text-3xl leading-none"
    >
      {icons[code as IconName] ||
        icons.default}
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

export default function NeedsPage() {
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
    needs,
    setNeeds,
  ] = useState<Need[]>([]);

  const [
    state,
    setState,
  ] =
    useState<LoadState>(
      "loading"
    );

  useEffect(() => {
    let mounted = true;

    const loadNeeds =
      async () => {
        setState("loading");

        try {
          const data =
            await needsService.list();

          if (!mounted) {
            return;
          }

          setNeeds(data);
          setState("ready");
        } catch (error) {
          console.error(
            "Failed to load needs:",
            error
          );

          if (!mounted) {
            return;
          }

          setNeeds([]);
          setState("error");
        }
      };

    void loadNeeds();

    return () => {
      mounted = false;
    };
  }, []);

  const orderedNeeds =
    useMemo(
      () =>
        [...needs].sort(
          (a, b) =>
            a.order -
            b.order
        ),
      [needs]
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              {t("needs_eyebrow")}
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {t("needs_title")}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {t("needs_intro")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {state ===
          "loading" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
            {t(
              "needs_loading"
            )}
          </div>
        )}

        {state ===
          "error" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="font-semibold text-red-900">
              {t(
                "needs_error_title"
              )}
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {t(
                "needs_error_text"
              )}
            </p>
          </div>
        )}

        {state ===
          "ready" &&
          orderedNeeds.length ===
            0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
              {t(
                "needs_empty"
              )}
            </div>
          )}

        {state ===
          "ready" &&
          orderedNeeds.length >
            0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {orderedNeeds.map(
                (need) => {
                  const label =
                    localizedValue(
                      need.labels,
                      activeLocale
                    );

                  const description =
                    localizedValue(
                      need.descriptions,
                      activeLocale
                    );

                  return (
                    <Link
                      key={
                        need._id
                      }
                      to={`/necesidades/${need._id}`}
                      className="
                        group
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        text-start
                        no-underline
                        shadow-sm
                        transition
                        hover:-translate-y-0.5
                        hover:border-emerald-300
                        hover:shadow-md
                      "
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                          <NeedIcon
                            code={
                              need.code
                            }
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
                            {label}
                          </h2>

                          {description && (
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                              {
                                description
                              }
                            </p>
                          )}

                          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                            {activeLocale ===
                            "ar" ? (
                              <>
                                <span
                                  aria-hidden
                                >
                                  ←
                                </span>

                                {t(
                                  "needs_view_options"
                                )}
                              </>
                            ) : (
                              <>
                                {t(
                                  "needs_view_options"
                                )}

                                <span
                                  aria-hidden
                                >
                                  →
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
      </section>
    </main>
  );
}