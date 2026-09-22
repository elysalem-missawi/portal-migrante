import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

/* ─────────────────────────────────────────
   Section wrapper: رقم ضخم + عنوان جانبي
   يستخدم flex حتى ينعكس تلقائياً في RTL
   ───────────────────────────────────────── */
function Section({
  number,
  label,
  children,
}: {
  number: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-20">
          {/* الرقم + التسمية (يُثبَّت أثناء التمرير) */}
          <div className="lg:sticky lg:top-24 lg:h-fit lg:w-40 lg:shrink-0">
            <div className="font-mono text-7xl font-black leading-none tracking-tighter text-vitoria-green/15 sm:text-8xl">
              {number}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-6 bg-vitoria-green" />
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-vitoria-green">
                {label}
              </span>
            </div>
          </div>

          {/* المحتوى */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* نقطة خضراء صغيرة — العنصر المتكرر في كل الصفحة */
function Dot() {
  return (
    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-vitoria-green" />
  );
}

function PlatformIcon({ name }: { name: string }) {
  const common = {
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "building") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-4h6v4" />
        <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
      </svg>
    );
  }

  if (name === "message") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.9L3 21l1.9-4.3A8.3 8.3 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" />
      </svg>
    );
  }

  if (name === "map") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
        <path d="M9 3v15M15 6v15" />
        <path d="M12 8.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        <path d="M12 13.5c1.6-1.8 2.5-3.1 2.5-4.1a2.5 2.5 0 0 0-5 0c0 1 .9 2.3 2.5 4.1Z" />
      </svg>
    );
  }

  return (
    <svg {...common} aria-hidden="true">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z" />
      <path d="M4 4.5v17" />
      <path d="M8 6h8M8 10h8M8 14h5" />
    </svg>
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
    { key: "about_part_services", icon: "book" },
    { key: "about_part_directory", icon: "building" },
    { key: "about_part_forum", icon: "message" },
    { key: "about_part_culture", icon: "map" },
  ];

  const phases = [
    { title: "about_phase_1_title", desc: "about_phase_1_desc" },
    { title: "about_phase_2_title", desc: "about_phase_2_desc" },
    { title: "about_phase_3_title", desc: "about_phase_3_desc" },
  ];

  const impactKeys = [
    "home_impact_access",
    "home_impact_basque_image",
    "home_impact_data",
    "home_impact_cohesion",
  ];

  const needs = [
    "about_need_guidance",
    "about_need_support",
    "about_need_funding",
    "about_need_partners",
  ];

  return (
    <main className="bg-white">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32">
        {/* glows — mono-tone emerald to keep Swiss feel */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-emerald-50/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-end gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* النص */}
            <div>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-vitoria-green" />
                <span className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                  {t("about_badge")}
                </span>
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                {t("about_title")}
              </h1>

              {/* خط أخضر صغير تحت العنوان — نقطة ارتكاز بصرية */}
              <span className="mt-6 block h-1 w-20 rounded-full bg-vitoria-green" />

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                {t("about_subtitle")}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to="/servicios"
                  className="group inline-flex items-center gap-2 border-b-2 border-vitoria-green pb-1 text-base font-black text-vitoria-green"
                >
                  {t("explore_services")}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  to="/contacto"
                  className="group inline-flex items-center gap-2 border-b-2 border-slate-950 pb-1 text-base font-black text-slate-950"
                >
                  {t("contact_us")}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* الصورة */}
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)]">
              <img
                src="/images/hiroSobreNodotros.png"
                alt={t("about_hero_tag")}
                className="h-[320px] w-full object-cover object-center sm:h-[420px] lg:h-[500px]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
              <div className="absolute bottom-5 start-5 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-black text-slate-950 shadow-lg backdrop-blur">
                {t("about_hero_tag")}
              </div>
            </div>
          </div>

          {/* القيم — شريط سفلي */}
          <div className="mt-16 grid gap-x-10 gap-y-5 border-t border-slate-200 pt-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:pt-10">
            {values.map((key) => (
              <div key={key} className="flex items-start gap-3">
                <Dot />
                <p className="text-sm font-bold leading-relaxed text-slate-950">
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 01 · ORIGEN ═══════════ */}
      <Section number="01" label={t("about_origin_label")}>
        <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
          {t("about_origin_title")}
        </h2>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-14">
          <p className="text-lg leading-relaxed text-slate-600">
            {t("about_origin_desc")}
          </p>
          <div className="border-l-2 border-vitoria-green pl-6">
            <h3 className="text-lg font-black text-slate-950">
              {t("about_lived_title")}
            </h3>
            <p className="mt-3 leading-relaxed text-slate-600">
              {t("about_lived_desc")}
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════════ 02 · PLATAFORMA ═══════════ */}
      <Section number="02" label={t("about_platform_label")}>
        <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
          {t("about_platform_title")}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t("about_platform_desc")}
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {platformParts.map((part, i) => (
            <div
              key={part.key}
              className="group rounded-3xl border border-slate-200 bg-slate-50/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-vitoria-green/40 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-vitoria-green shadow-sm ring-1 ring-slate-200">
                  <PlatformIcon name={part.icon} />
                </span>
                <span className="font-mono text-xs font-black text-slate-300 transition group-hover:text-vitoria-green">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-7 font-black leading-snug text-slate-950">
                {t(part.key)}
              </p>
              <div className="mt-6 h-1 w-8 rounded-full bg-vitoria-green transition-all duration-300 group-hover:w-14" />
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ 03 · IMPACTO ═══════════ */}
      <Section number="03" label={t("about_impact_label")}>
        <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
          {t("about_impact_title")}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t("about_impact_desc")}
        </p>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2">
          {impactKeys.map((key, i) => (
            <li
              key={key}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="font-mono text-5xl font-black leading-none tracking-tighter text-slate-100 transition group-hover:text-vitoria-green/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-5 font-bold leading-relaxed text-slate-950">
                {t(key)}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ═══════════ 04 · FASES ═══════════ */}
      <Section number="04" label={t("about_plan_label")}>
        <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
          {t("about_plan_title")}
        </h2>

        <div className="relative mt-14 grid gap-10 lg:grid-cols-3 lg:gap-0">
          {/* خط واصل بتدرّج أخضر */}
          <div className="pointer-events-none absolute start-[16.66%] end-[16.66%] top-8 hidden h-px bg-gradient-to-r from-vitoria-green/40 via-vitoria-green/20 to-vitoria-green/40 lg:block" />

          {phases.map((phase, i) => (
            <div
              key={phase.title}
              className="relative lg:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-vitoria-green font-mono text-sm font-black text-white shadow-lg shadow-emerald-900/10">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 text-lg font-black text-slate-950">
                {t(phase.title)}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-slate-600">
                {t(phase.desc)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ 05 · NECESIDADES ═══════════ */}
      <Section number="05" label={t("about_needs_label")}>
        <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
          {t("about_needs_title")}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t("about_needs_desc")}
        </p>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2">
          {needs.map((key) => (
            <li
              key={key}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:bg-white hover:shadow-sm"
            >
              <Dot />
              <p className="text-base font-bold leading-snug text-slate-950 sm:text-lg">
                {t(key)}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ═══════════ CTA — نص مركزي فقط ═══════════ */}
      <section className="border-t border-slate-200 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-vitoria-green">
            —
          </span>
          <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
            {t("about_cta_title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {t("about_cta_desc")}
          </p>
          <Link
            to="/contacto"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-vitoria-green px-8 py-4 text-base font-black text-white transition hover:brightness-110"
          >
            {t("contact_us")}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}