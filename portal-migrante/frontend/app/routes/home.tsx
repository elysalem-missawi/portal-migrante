import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useI18n } from "../i18n";

type IconName =
  | "people"
  | "heart"
  | "building"
  | "briefcase"
  | "pin"
  | "chart"
  | "graduation"
  | "home"
  | "health"
  | "scale"
  | "network"
  | "check";

function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  const paths: Record<IconName, ReactNode> = {
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20c.5-4 2.8-6 5.5-6s5 2 5.5 6" />
        <path d="M14 15c3.2 0 5.2 1.7 5.8 5" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
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
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
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
    graduation: (
      <>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
    home: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v11h14V10" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    health: (
      <>
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
        <path d="M12 9v5" />
        <path d="M9.5 11.5h5" />
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
    network: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="7" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path d="M8.5 8l2.5 7" />
        <path d="M15.5 9.5L13 15" />
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
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl text-start">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();

  const ecosystem = [
    {
      number: "01",
      icon: "people" as IconName,
      title: t("home_dt_social_title"),
      description: t("home_dt_social_desc"),
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      number: "02",
      icon: "briefcase" as IconName,
      title: t("home_dt_work_title"),
      description: t("home_dt_work_desc"),
      accent: "bg-blue-50 text-blue-700",
    },
    {
      number: "03",
      icon: "pin" as IconName,
      title: t("home_dt_services_title"),
      description: t("home_dt_services_desc"),
      accent: "bg-violet-50 text-violet-700",
    },
    {
      number: "04",
      icon: "chart" as IconName,
      title: t("home_dt_data_title"),
      description: t("home_dt_data_desc"),
      accent: "bg-cyan-50 text-cyan-700",
    },
  ];

  const actors = [
    {
      icon: "people" as IconName,
      title: t("home_actor_people_title"),
      description: t("home_actor_people_short"),
      to: "/servicios",
      color: "bg-emerald-50 text-emerald-700",
      outline: "border-emerald-200 group-hover:border-emerald-400",
    },
    {
      icon: "heart" as IconName,
      title: t("home_actor_entities_title"),
      description: t("home_actor_entities_short"),
      to: "/organizations",
      color: "bg-violet-50 text-violet-700",
      outline: "border-violet-200 group-hover:border-violet-400",
    },
    {
      icon: "building" as IconName,
      title: t("home_actor_admin_title"),
      description: t("home_actor_admin_short"),
      to: "/ayuntamientos",
      color: "bg-blue-50 text-blue-700",
      outline: "border-blue-200 group-hover:border-blue-400",
    },
  ];

  const services = [
    {
      icon: "briefcase" as IconName,
      title: t("f_work"),
      description: t("home_area_jobs_desc"),
      to: "/servicios?c=empleo",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: "graduation" as IconName,
      title: t("f_education"),
      description: t("home_area_training_desc"),
      to: "/servicios?c=educacion",
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: "home" as IconName,
      title: t("f_housing"),
      description: t("home_area_housing_desc"),
      to: "/servicios?c=vivienda",
      color: "bg-violet-50 text-violet-700",
    },
    {
      icon: "health" as IconName,
      title: t("f_health"),
      description: t("home_area_health_desc"),
      to: "/servicios?c=salud",
      color: "bg-rose-50 text-rose-700",
    },
    {
      icon: "scale" as IconName,
      title: t("f_legal"),
      description: t("home_area_admin_desc"),
      to: "/servicios?c=legal",
      color: "bg-amber-50 text-amber-700",
    },
    {
      icon: "building" as IconName,
      title: t("f_municipalities"),
      description: t("home_area_local_desc"),
      to: "/ayuntamientos",
      color: "bg-cyan-50 text-cyan-700",
    },
  ];

  const municipalityBenefits = [
    t("home_municipality_benefit_1"),
    t("home_municipality_benefit_3"),
    t("home_municipality_benefit_4"),
    t("home_municipality_benefit_6"),
  ];

  const demoMetrics = [
    { value: "24", label: t("nav_services") },
    { value: "12", label: t("home_actor_entities_title") },
    { value: "4", label: t("f_municipalities") },
    { value: "18", label: t("nav_forum") },
  ];

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/registration-migrant-travel-hero.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/68 to-slate-950/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/5" />

        <div className="mx-auto flex min-h-[590px] max-w-7xl items-center px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl text-start">
            <div className="inline-flex rounded-full border border-emerald-300/40 bg-slate-950/35 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur">
              {t("home_dt_badge")}
            </div>

            <h1 className="mt-7 max-w-[820px] text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.55rem]">
              {t("home_dt_title")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">
              {t("home_dt_subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/servicios"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-7 py-3.5 font-semibold text-white shadow-xl shadow-black/10 transition hover:bg-emerald-400"
              >
                {t("home_dt_explore")}
                <span className="ms-2" aria-hidden>
                  →
                </span>
              </Link>

              <Link
                to="/sobre"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-slate-950/20 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                {t("home_dt_project")}
              </Link>
            </div>

            <div className="mt-9 grid max-w-2xl gap-3 text-sm sm:grid-cols-3">
              {actors.map((actor) => (
                <div
                  key={actor.title}
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-slate-950/25 px-3 py-3 backdrop-blur-sm"
                >
                  <Icon name={actor.icon} className="h-5 w-5 text-emerald-300" />
                  <span className="font-medium text-slate-100">{actor.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM: connected circles, compact desktop diagram */}
      <section className="overflow-hidden bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              {t("home_areas_label")}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              {t("home_ecosystem_title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {t("home_ecosystem_short_desc")}
            </p>
          </div>

          {/* Desktop: fixed geometry keeps all four connectors aligned with circle edges. */}
          <div className="relative mx-auto mt-8 hidden h-[520px] w-[760px] lg:block">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 760 520"
              fill="none"
              aria-hidden="true"
            >
              {/* Outer circle edges -> center circle edges */}
              <path d="M380 144 V176" stroke="#6EE7B7" strokeWidth="2" />
              <path d="M263 260 H296" stroke="#93C5FD" strokeWidth="2" />
              <path d="M464 260 H497" stroke="#C4B5FD" strokeWidth="2" />
              <path d="M380 344 V376" stroke="#67E8F9" strokeWidth="2" />
              <circle cx="380" cy="173" r="4" fill="#34D399" stroke="white" strokeWidth="2" />
              <circle cx="293" cy="260" r="4" fill="#60A5FA" stroke="white" strokeWidth="2" />
              <circle cx="467" cy="260" r="4" fill="#A78BFA" stroke="white" strokeWidth="2" />
              <circle cx="380" cy="347" r="4" fill="#22D3EE" stroke="white" strokeWidth="2" />
            </svg>

            {/* Social: top node */}
            <div className="absolute left-1/2 top-2 -translate-x-1/2">
              <Link
                to="/servicios"
                className="group flex h-[136px] w-[136px] flex-col items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/50 p-3 text-center shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition-transform duration-200 motion-safe:hover:scale-[1.03] hover:border-emerald-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                  <Icon name="people" className="h-5 w-5" />
                </span>
                <span className="mt-2.5 px-1 text-sm font-bold leading-snug text-slate-950">
                  {t("home_dt_social_title")}
                </span>
              </Link>
            </div>

            {/* Labour: left node */}
            <div className="absolute left-[127px] top-1/2 -translate-y-1/2">
              <Link
                to="/servicios?c=empleo"
                className="group flex h-[136px] w-[136px] flex-col items-center justify-center rounded-full border border-blue-200 bg-blue-50/50 p-3 text-center shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition-transform duration-200 motion-safe:hover:scale-[1.03] hover:border-blue-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                  <Icon name="briefcase" className="h-5 w-5" />
                </span>
                <span className="mt-2.5 px-1 text-sm font-bold leading-snug text-slate-950">
                  {t("home_dt_work_title")}
                </span>
              </Link>
            </div>

            {/* Zubia: center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex h-[168px] w-[168px] items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-900 shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
                <div className="pointer-events-none absolute inset-3 rounded-full border border-white/25" />
                <div className="relative z-10 px-4 text-center text-white">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                    <Icon name="network" className="h-5 w-5" />
                  </span>
                  <div className="mt-3 text-2xl font-bold tracking-tight">Zubia</div>
                  <div className="mt-1 text-xs font-medium leading-snug text-slate-200">
                    {t("home_ecosystem_center")}
                  </div>
                </div>
              </div>
            </div>

            {/* Services: right node */}
            <div className="absolute right-[127px] top-1/2 -translate-y-1/2">
              <Link
                to="/servicios"
                className="group flex h-[136px] w-[136px] flex-col items-center justify-center rounded-full border border-violet-200 bg-violet-50/50 p-3 text-center shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition-transform duration-200 motion-safe:hover:scale-[1.03] hover:border-violet-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-violet-700 shadow-sm">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <span className="mt-2.5 px-1 text-sm font-bold leading-snug text-slate-950">
                  {t("home_dt_services_title")}
                </span>
              </Link>
            </div>

            {/* Data: bottom node */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <Link
                to="/sobre"
                className="group flex h-[136px] w-[136px] flex-col items-center justify-center rounded-full border border-cyan-200 bg-cyan-50/50 p-3 text-center shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition-transform duration-200 motion-safe:hover:scale-[1.03] hover:border-cyan-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-cyan-700 shadow-sm">
                  <Icon name="chart" className="h-5 w-5" />
                </span>
                <span className="mt-2.5 px-1 text-sm font-bold leading-snug text-slate-950">
                  {t("home_dt_data_title")}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile and tablet: accessible 2x2 layout, no absolute positioning. */}
          <div className="mt-8 lg:hidden">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-900 text-center text-white shadow-xl">
              <div className="px-3">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                  <Icon name="network" className="h-5 w-5" />
                </span>
                <div className="mt-2 text-xl font-bold">Zubia</div>
                <div className="mt-1 text-xs leading-snug text-slate-200">
                  {t("home_ecosystem_center")}
                </div>
              </div>
            </div>
            <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3 sm:gap-5">
              {[
                {
                  title: t("home_dt_social_title"),
                  icon: "people" as IconName,
                  to: "/servicios",
                  wrapper: "border-emerald-200 bg-emerald-50/50",
                  iconStyle: "text-emerald-700",
                },
                {
                  title: t("home_dt_work_title"),
                  icon: "briefcase" as IconName,
                  to: "/servicios?c=empleo",
                  wrapper: "border-blue-200 bg-blue-50/50",
                  iconStyle: "text-blue-700",
                },
                {
                  title: t("home_dt_services_title"),
                  icon: "pin" as IconName,
                  to: "/servicios",
                  wrapper: "border-violet-200 bg-violet-50/50",
                  iconStyle: "text-violet-700",
                },
                {
                  title: t("home_dt_data_title"),
                  icon: "chart" as IconName,
                  to: "/sobre",
                  wrapper: "border-cyan-200 bg-cyan-50/50",
                  iconStyle: "text-cyan-700",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className={`flex aspect-square min-w-0 flex-col items-center justify-center rounded-full border p-3 text-center shadow-sm transition-transform duration-200 motion-safe:hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 ${item.wrapper}`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ${item.iconStyle}`}>
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="mt-2 px-1 text-xs font-bold leading-tight text-slate-950 sm:text-sm">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACTORS: three stakeholders connected through Zubia */}
      <section className="border-y border-slate-100 bg-slate-50 py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              {t("home_vision_label")}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-[2.15rem]">
              {t("home_vision_title")}
            </h2>
          </div>

          <div className="mx-auto mt-9 max-w-5xl">
            {/* Each stakeholder is a destination, not a decorative card. */}
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {actors.map((actor) => (
                <Link
                  key={actor.title}
                  to={actor.to}
                  className="group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 text-start shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 md:min-h-[210px] md:flex-col md:justify-center md:px-4 md:py-6 md:text-center"
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition duration-200 group-hover:scale-105 ${actor.outline}`}
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${actor.color}`}>
                      <Icon name={actor.icon} className="h-5 w-5" />
                    </span>
                  </span>
                  <span className="block min-w-0">
                    <span className="block text-base font-bold leading-snug text-slate-950 md:mt-4 md:text-lg">
                      {actor.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-6 text-slate-600 md:mx-auto md:max-w-[230px]">
                      {actor.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Real connection diagram: all three lines meet before reaching the platform. */}
            <div className="relative hidden h-12 md:block" aria-hidden="true">
              <span className="absolute left-[16.6667%] top-0 h-5 w-px -translate-x-1/2 bg-slate-300" />
              <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-slate-300" />
              <span className="absolute left-[83.3333%] top-0 h-5 w-px -translate-x-1/2 bg-slate-300" />
              <span className="absolute left-[16.6667%] right-[16.6667%] top-5 h-px bg-slate-300" />
              <span className="absolute left-1/2 top-5 h-7 w-px -translate-x-1/2 bg-emerald-400" />
              <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-500 ring-4 ring-slate-50" />
            </div>

            {/* Zubia is the connecting infrastructure, not a fourth stakeholder. */}
            <div className="mx-auto mt-4 flex max-w-lg items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-lg md:mt-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                <Icon name="network" className="h-6 w-6" />
              </span>
              <span className="min-w-0 text-start">
                <span className="block text-base font-bold">Zubia Social Euskadi</span>
                <span className="block text-sm text-slate-300">
                  {t("home_ecosystem_center")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL + LABOUR */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("home_integration_label")}
            title={t("home_integration_title")}
            description={t("home_integration_desc")}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="absolute end-0 top-0 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="people" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  {t("home_social_label")}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  {t("home_social_title")}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {t("home_social_desc")}
                </p>

                <Link
                  to="/servicios"
                  className="mt-6 inline-flex font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {t("view_information")} →
                </Link>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="absolute end-0 top-0 h-40 w-40 rounded-full bg-blue-100/80 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon name="briefcase" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  {t("home_work_label")}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  {t("home_work_title")}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {t("home_work_desc")}
                </p>

                <Link
                  to="/servicios?c=empleo"
                  className="mt-6 inline-flex font-semibold text-blue-700 hover:text-blue-800"
                >
                  {t("view_information")} →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <SectionHeading
              eyebrow={t("home_areas_label")}
              title={t("home_areas_title")}
            />

            <p className="text-start leading-7 text-slate-600">
              {t("home_areas_desc")}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.to}
                className="group min-h-[210px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${service.color}`}>
                  <Icon name={service.icon} className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-bold text-slate-950">{service.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MUNICIPALITIES */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(37,99,235,0.18),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
          <div className="text-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              {t("home_municipality_label")}
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              {t("home_municipality_title")}
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
              {t("home_municipality_desc")}
            </p>

            <div className="mt-7 space-y-3">
              {municipalityBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                    <Icon name="check" className="h-4 w-4" />
                  </span>

                  <span className="leading-6 text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/sobre"
              className="mt-8 inline-flex rounded-xl border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              {t("home_municipality_cta")} →
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white p-4 text-slate-900 shadow-2xl sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Zubia Social Euskadi · DEMO
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {t("home_municipality_label")}
                </h3>
              </div>

              <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                Euskadi
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {demoMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-2xl font-bold text-slate-950">
                    {metric.value}
                  </div>

                  <div className="mt-1 text-xs font-medium text-slate-500">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800">
                    {t("home_dt_tag_data")}
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    DEMO
                  </span>
                </div>

                <div className="mt-6 flex h-40 items-end gap-3">
                  {[34, 48, 44, 64, 72, 88].map((height, index) => (
                    <div key={index} className="flex h-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-emerald-400"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 p-5">
                <div className="font-bold text-slate-800">
                  {t("home_dt_tag_territory")}
                </div>

                <div className="mx-auto mt-7 flex h-32 w-32 items-center justify-center rounded-full bg-[conic-gradient(#10b981_0_30%,#2563eb_30%_55%,#8b5cf6_55%_75%,#f59e0b_75%_100%)]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center text-xs font-bold text-slate-600">
                    ZUBIA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MVP */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9 lg:grid-cols-[1fr_0.45fr] lg:items-center">
            <div className="text-start">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                {t("home_mvp_label")}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                {t("home_mvp_title")}
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                {t("home_mvp_desc")}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon name="network" />
              </div>

              <p className="mt-4 font-semibold leading-7 text-emerald-950">
                {t("home_mvp_note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-950 to-emerald-950 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-3xl text-start">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              {t("home_final_transform_title")}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              {t("home_final_transform_desc")}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              to="/users/new"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-400"
            >
              {t("create_account_link")}
            </Link>

            <Link
              to="/sobre"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              {t("home_dt_project")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
