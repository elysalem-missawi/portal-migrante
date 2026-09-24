import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

/* ─────────────────────────────────────────
   عنوان عمود صغير بنمط Swiss
   ───────────────────────────────────────── */
function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-6 bg-vitoria-green" />
      <h4 className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-vitoria-green">
        {children}
      </h4>
    </div>
  );
}

/* ─────────────────────────────────────────
   رابط بنقطة خضراء تظهر عند hover
   ───────────────────────────────────────── */
function FooterLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 transition hover:text-white"
    >
      <span className="h-1 w-1 rounded-full bg-vitoria-green/0 transition group-hover:bg-vitoria-green" />
      {children}
    </Link>
  );
}

export default function Footer() {
  const { t } = useI18n();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-slate-950 text-white">
      {/* glows متناسقة مع قسم IMPACTO في /sobre */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-vitoria-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-vitoria-green/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ═══════════ الأعمدة الرئيسية ═══════════ */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr] lg:gap-10 lg:py-20">
          {/* ── العمود 1: التعريف ── */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-black text-white"
            >
              <span className="h-2 w-2 rounded-full bg-vitoria-green" />
              {t("app_title")}
            </Link>

            <p className="mt-5 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-vitoria-green">
              {t("footer_project_by")}
            </p>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {t("footer_project_desc")}
            </p>
          </div>

          {/* ── العمود 2: حول المشروع ── */}
          <div>
            <ColumnTitle>{t("footer_about")}</ColumnTitle>
            <ul className="mt-6 space-y-3">
              <li>
                <FooterLink to="/sobre">{t("footer_about")}</FooterLink>
              </li>
              <li>
                <FooterLink to="/contacto">{t("footer_contact")}</FooterLink>
              </li>
              <li>
                <FooterLink to="/servicios/asociaciones">
                  {t("f_charities")}
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* ── العمود 3: روابط سريعة ── */}
          <div>
            <ColumnTitle>{t("quick_links")}</ColumnTitle>
            <ul className="mt-6 space-y-3">
              <li>
                <FooterLink to="/servicios">{t("cta_services")}</FooterLink>
              </li>
              <li>
                <FooterLink to="/foro">{t("nav_forum")}</FooterLink>
              </li>
              <li>
                <FooterLink to="/cultura-vasca">
                  {t("nav_basque_culture")}
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* ── العمود 4: النشرة ── */}
          <div>
            <ColumnTitle>{t("footer_newsletter")}</ColumnTitle>

            <p className="mt-6 text-sm leading-relaxed text-white/60">
              {t("footer_newsletter_desc")}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-5 flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder={t("footer_email_placeholder")}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:border-vitoria-green/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-vitoria-green/30"
                required
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-vitoria-green px-4 py-3 text-sm font-black text-white shadow-lg shadow-vitoria-green/20 transition hover:brightness-110"
              >
                {t("footer_subscribe")}
              </button>

              {subscribed && (
                <p className="flex items-center gap-2 pt-1 text-xs font-bold text-green-300">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-300 text-[10px] text-slate-950">
                    ✓
                  </span>
                  {t("footer_subscribe_success")}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* ═══════════ الجهة الداعمة ═══════════ */}
        <div className="border-t border-white/10 py-10">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div className="max-w-2xl text-center lg:text-start">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-vitoria-green">
                {t("footer_support_label")}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {t("footer_support_desc")}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white p-4 shadow-lg">
              <img
                src="/images/MarcaAytoMonocolor-V.jpg"
                alt="Ayuntamiento de Vitoria-Gasteiz / Vitoria-Gasteizko Udala"
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* ═══════════ الحقوق والإخلاء ═══════════ */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            {/* Copyright + disclaimer */}
            <div className="max-w-3xl text-center lg:text-start">
              <p className="text-sm font-bold text-white/80">
                © {new Date().getFullYear()} {t("app_title")} —{" "}
                {t("footer_copyright")}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-white/40">
                {t("footer_disclaimer")}
              </p>
            </div>

            {/* روابط قانونية */}
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold">
              <Link
                to="/contacto"
                className="text-white/60 transition hover:text-vitoria-green"
              >
                {t("footer_legal_notice")}
              </Link>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <Link
                to="/contacto"
                className="text-white/60 transition hover:text-vitoria-green"
              >
                {t("footer_privacy")}
              </Link>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <Link
                to="/contacto"
                className="text-white/60 transition hover:text-vitoria-green"
              >
                {t("footer_accessibility")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}