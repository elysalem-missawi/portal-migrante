import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

function MiniIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-vitoria-green text-xl text-white">
      {children}
    </div>
  );
}

export default function Sobre() {
  const { t } = useI18n();

  const values = [
    "about_value_clarity",
    "about_value_access",
    "about_value_community",
    "about_value_data",
  ];

  const platformParts = [
    { key: "about_part_services", icon: "📘" },
    { key: "about_part_directory", icon: "🏛️" },
    { key: "about_part_forum", icon: "💬" },
    { key: "about_part_culture", icon: "📍" },
  ];

  const phases = [
    { title: "about_phase_1_title", desc: "about_phase_1_desc" },
    { title: "about_phase_2_title", desc: "about_phase_2_desc" },
    { title: "about_phase_3_title", desc: "about_phase_3_desc" },
  ];

  const needs = [
    "about_need_guidance",
    "about_need_support",
    "about_need_funding",
    "about_need_partners",
  ];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_78%,rgba(0,151,57,0.82)_0%,rgba(0,151,57,0.42)_24%,transparent_48%),linear-gradient(135deg,#2448ad_0%,#284fb8_46%,#173f89_100%)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              {t("about_badge")}
            </p>
            <h1 className="text-5xl font-black leading-tight sm:text-6xl">
              {t("about_title")}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-200">
              {t("about_subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/servicios"
                className="rounded-lg bg-vitoria-green px-6 py-3 text-center font-bold text-white"
              >
                {t("explore_services")}
              </Link>
              <Link
                to="/contacto"
                className="rounded-lg border border-white/60 px-6 py-3 text-center font-bold text-white"
              >
                {t("contact_us")}
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/70 bg-white/10 backdrop-blur">
            <img
              src="/images/registration-migrant-travel-hero.png"
              alt=""
              className="h-60 w-full object-cover sm:h-72"
              style={{ objectPosition: "center 35%" }}
            />
            <div className="p-6">
              <h2 className="text-2xl font-black">{t("about_summary_title")}</h2>
              <div className="mt-6 grid gap-3">
              {values.map((key) => (
                <div key={key} className="rounded-lg bg-white/15 p-4">
                  <p className="font-semibold">{t(key)}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold text-vitoria-green">{t("about_origin_label")}</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">
              {t("about_origin_title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {t("about_origin_desc")}
            </p>
          </div>

          <div className="rounded-lg border border-vitoria-green/20 bg-green-50 p-6">
            <h3 className="text-2xl font-black text-slate-950">
              {t("about_lived_title")}
            </h3>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-slate-700">
              {t("about_lived_desc")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-vitoria-green">{t("about_platform_label")}</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">
              {t("about_platform_title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {t("about_platform_desc")}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platformParts.map((part) => (
              <div key={part.key} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <MiniIcon>{part.icon}</MiniIcon>
                <p className="mt-6 text-xl font-black leading-relaxed text-slate-950">
                  {t(part.key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-vitoria-green">{t("about_impact_label")}</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">
              {t("about_impact_title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {t("about_impact_desc")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "home_impact_access",
              "home_impact_basque_image",
              "home_impact_data",
              "home_impact_cohesion",
            ].map((key) => (
              <div key={key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-xl font-black text-vitoria-green">✓</span>
                <p className="mt-4 text-lg font-bold leading-relaxed text-slate-950">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_88%_78%,rgba(0,151,57,0.82)_0%,rgba(0,151,57,0.42)_24%,transparent_48%),linear-gradient(135deg,#2448ad_0%,#284fb8_46%,#173f89_100%)] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-green-300">{t("about_plan_label")}</p>
            <h2 className="mt-3 text-4xl font-black">{t("about_plan_title")}</h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {phases.map((phase, index) => (
              <div key={phase.title} className="rounded-lg border border-white/15 bg-white/10 p-6">
                <div className="mb-6 text-sm font-black text-green-300">0{index + 1}</div>
                <h3 className="text-2xl font-black">{t(phase.title)}</h3>
                <p className="mt-4 leading-relaxed text-slate-200">{t(phase.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold text-vitoria-green">{t("about_needs_label")}</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">
              {t("about_needs_title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {t("about_needs_desc")}
            </p>
          </div>

          <div className="grid gap-4">
            {needs.map((key) => (
              <div key={key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-lg font-bold text-slate-950">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-vitoria-green p-8 text-white sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-black">{t("about_cta_title")}</h2>
              <p className="mt-3 text-lg text-white/90">{t("about_cta_desc")}</p>
            </div>
            <Link
              to="/contacto"
              className="mt-6 inline-flex rounded-lg bg-white px-6 py-4 text-lg font-black text-vitoria-green sm:mt-0"
            >
              {t("contact_us")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
