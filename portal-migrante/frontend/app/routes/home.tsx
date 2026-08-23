import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useI18n } from "../i18n";

type IconName =
  | "language"
  | "network"
  | "process"
  | "chat"
  | "book"
  | "building"
  | "globe"
  | "heart"
  | "home"
  | "graduation"
  | "scale"
  | "briefcase"
  | "hands"
  | "pin"
  | "chart"
  | "spark"
  | "check";

function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  const paths: Record<IconName, ReactNode> = {
    language: (
      <>
        <path d="M3 5h12" />
        <path d="M9 3v2c0 4-2 7-5 9" />
        <path d="M5 10c2 3 5 5 9 5" />
        <path d="M17 14l4 7" />
        <path d="M14 21l4-7 4 7" />
      </>
    ),
    network: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="7" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path d="M8.5 8l2.5 7" />
        <path d="M15.5 9.5L13 15" />
      </>
    ),
    process: (
      <>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </>
    ),
    chat: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      </>
    ),
    building: (
      <>
        <path d="M4 21h16" />
        <path d="M6 21V8l6-4 6 4v13" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 0 1 0 20" />
        <path d="M12 2a15 15 0 0 0 0 20" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    ),
    home: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v11h14V10" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    graduation: (
      <>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
    scale: (
      <>
        <path d="M12 3v18" />
        <path d="M5 7h14" />
        <path d="M6 7l-3 6h6L6 7z" />
        <path d="M18 7l-3 6h6l-3-6z" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </>
    ),
    hands: (
      <>
        <path d="M7 11l3 3a3 3 0 0 0 4 0l3-3" />
        <path d="M3 12l4-4 5 5" />
        <path d="M21 12l-4-4-5 5" />
        <path d="M8 16l2 2" />
        <path d="M14 18l2-2" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-5.2 7-12A7 7 0 0 0 5 9c0 6.8 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
      </>
    ),
    spark: (
      <>
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
        <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17z" />
      </>
    ),
    check: <path d="M20 6L9 17l-5-5" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="max-w-3xl">
      <div
        className={`mb-5 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-bold ${
          dark
            ? "border-white/20 bg-white/10 text-green-200"
            : "border-emerald-100 bg-emerald-50 text-emerald-800"
        }`}
      >
        <span className="h-2 w-8 rounded-full bg-vitoria-green" />
        <span>{eyebrow}</span>
        <span className="h-2 w-8 rounded-full bg-vitoria-green" />
      </div>
      <h2 className={`text-4xl font-black leading-tight sm:text-5xl ${dark ? "text-white" : "text-slate-950"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-lg leading-relaxed sm:text-xl ${dark ? "text-slate-200" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();

  const problems: { key: string; icon: IconName }[] = [
    { key: "home_problem_language", icon: "language" },
    { key: "home_problem_scattered", icon: "network" },
    { key: "home_problem_admin", icon: "process" },
    { key: "home_problem_channels", icon: "chat" },
  ];

  const pillars: { key: string; desc: string; icon: IconName }[] = [
    { key: "home_pillar_info", desc: "home_pillar_info_desc", icon: "book" },
    { key: "home_pillar_directory", desc: "home_pillar_directory_desc", icon: "building" },
    { key: "home_pillar_forum", desc: "home_pillar_forum_desc", icon: "chat" },
    { key: "home_pillar_languages", desc: "home_pillar_languages_desc", icon: "globe" },
  ];

  const sections: { key: string; icon: IconName; to: string }[] = [
    { key: "f_health", icon: "heart", to: "/servicios/salud" },
    { key: "f_housing", icon: "home", to: "/servicios/vivienda" },
    { key: "f_education", icon: "graduation", to: "/servicios/educacion" },
    { key: "f_legal", icon: "scale", to: "/servicios/legal" },
    { key: "f_work", icon: "briefcase", to: "/servicios/empleo" },
    { key: "f_municipalities", icon: "building", to: "/ayuntamientos" },
    { key: "f_charities", icon: "hands", to: "/servicios/asociaciones" },
    { key: "nav_forum", icon: "chat", to: "/foro" },
    { key: "nav_basque_culture", icon: "pin", to: "/cultura-vasca" },
  ];

  const impacts: { key: string; icon: IconName }[] = [
    { key: "home_impact_access", icon: "check" },
    { key: "home_impact_pressure", icon: "building" },
    { key: "home_impact_jobs", icon: "briefcase" },
    { key: "home_impact_cohesion", icon: "hands" },
    { key: "home_impact_basque_image", icon: "spark" },
    { key: "home_impact_data", icon: "chart" },
  ];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_78%,rgba(0,151,57,0.82)_0%,rgba(0,151,57,0.42)_24%,transparent_48%),linear-gradient(135deg,#2448ad_0%,#284fb8_46%,#173f89_100%)] text-white">
  {/* Imagen de fondo exclusiva para pantallas grandes (lg+) */}
  <div className="absolute inset-0 hidden lg:block">
    <img
      src="/images/registration-migrant-travel-hero.png"
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover object-center"
    />
    {/* Capa de degradado sobre la imagen para asegurar legibilidad del texto */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#173f89]/95 via-[#2448ad]/85 to-transparent" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-normal text-white sm:text-6xl lg:text-7xl">
          {t("home_hero_title")}
        </h1>
        <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-200 sm:text-2xl">
          {t("home_hero_subtitle")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/servicios"
            className="inline-flex items-center justify-center rounded-lg bg-vitoria-green px-7 py-4 text-lg font-black text-white shadow-lg shadow-black/20 transition hover:bg-green-700"
          >
            {t("btn_start")}
          </Link>
          <Link
            to="/foro"
            className="inline-flex items-center justify-center rounded-lg border border-white/70 px-7 py-4 text-lg font-black text-white transition hover:bg-green-700 hover:text-slate-950"
          >
            {t("home_join_forum")}
          </Link>
          <Link
            to="/sobre"
            className="inline-flex items-center justify-center rounded-lg border border-white/70 px-7 py-4 text-lg font-black text-white transition hover:bg-green-700 hover:text-slate-950"
          >
            {t("home_project_info")}
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/70 bg-white/10 backdrop-blur">
        {/* En pantallas móviles se mantiene la imagen dentro de la tarjeta */}
        <div className="relative lg:hidden">
          <img
            src="/images/registration-migrant-travel-hero.png"
            alt="Euskadi Portal Migrante"
            className="h-64 w-full object-cover sm:h-80"
            style={{ objectPosition: "center 35%" }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-5 text-lg font-black text-white">
            Euskadi · Portal Migrante
          </div>
        </div>

        {/* Título interno visible únicamente en pantallas grandes */}
        <div className="hidden border-b border-white/20 p-5 text-lg font-black text-white lg:block">
          Euskadi · Portal Migrante
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          {[
            "home_pillar_info",
            "home_pillar_directory",
            "home_pillar_forum",
            "home_pillar_languages",
          ].map((key, index) => (
            <div key={key} className="flex items-center gap-4 rounded-lg bg-white/15 p-4 backdrop-blur-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-sm font-black text-green-200">
                0{index + 1}
              </span>
              <span className="text-lg font-bold leading-relaxed text-white">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              eyebrow={t("home_problem_label")}
              title={t("home_problem_title")}
              description={t("home_problem_desc")}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {problems.map((problem, index) => (
                <div
                  key={problem.key}
                  className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-700">0{index + 1}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon name={problem.icon} />
                    </span>
                  </div>
                  <p className="text-xl font-bold leading-relaxed text-slate-950">{t(problem.key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl justify-center text-center">
            <SectionHeading
              eyebrow={t("home_solution_label")}
              title={t("home_solution_title")}
              description={t("home_solution_desc")}
            />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div key={pillar.key} className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-vitoria-green text-white">
                  <Icon name={pillar.icon} className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-950">{t(pillar.key)}</h3>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{t(pillar.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow={t("home_sections_label")} title={t("home_sections_title")} />
            <Link to="/servicios" className="text-lg font-black text-vitoria-green hover:underline">
              {t("explore_services")}
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.to}
                to={section.to}
                className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-vitoria-green hover:shadow-xl"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-vitoria-green transition group-hover:bg-vitoria-green group-hover:text-white">
                    <Icon name={section.icon} className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-950 group-hover:text-vitoria-green">
                      {t(section.key)}
                    </h3>
                    <p className="mt-2 text-lg leading-relaxed text-slate-600">
                      {t("home_section_card_desc")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <SectionHeading
              eyebrow={t("home_impact_label")}
              title={t("home_impact_title")}
              description={t("home_impact_desc")}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {impacts.map((impact) => (
                <div key={impact.key} className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon name={impact.icon} />
                  </div>
                  <p className="text-xl font-bold leading-relaxed text-slate-800">{t(impact.key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow={t("home_phase_label")}
                title={t("home_phase_title")}
                description={t("home_phase_desc")}
              />
              <p className="mt-6 rounded-lg border border-vitoria-green/25 bg-green-50 p-5 text-lg font-bold leading-relaxed text-slate-800">
                {t("home_lived_experience")}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "home_phase_item_association",
                  "home_phase_item_proposal",
                  "home_phase_item_platform",
                  "home_phase_item_partners",
                ].map((key) => (
                  <div key={key} className="rounded-lg bg-white p-5 shadow-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
                      <Icon name="check" className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-bold leading-relaxed text-slate-900">{t(key)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-lg bg-vitoria-green p-8 text-white sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-black">{t("home_final_cta_title")}</h2>
              <p className="mt-3 text-lg text-white/90">{t("home_final_cta_desc")}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row">
              <Link
                to="/users/new"
                className="rounded-lg bg-white px-6 py-4 text-center text-lg font-black text-vitoria-green"
              >
                {t("create_account_link")}
              </Link>
              <Link
                to="/contacto"
                className="rounded-lg border border-white px-6 py-4 text-center text-lg font-black text-white"
              >
                {t("contact_us")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
