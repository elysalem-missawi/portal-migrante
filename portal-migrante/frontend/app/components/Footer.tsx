import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

/* ─────────────────────────────────────────
   أيقونات SVG مضمّنة
   ───────────────────────────────────────── */
function NetworkIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="7" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M8.5 8l2.5 7" />
      <path d="M15.5 9.5L13 15" />
    </svg>
  );
}

function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8l9 6 9-6" />
      <rect x="3" y="6" width="18" height="13" rx="2" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function ArrowUpIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 15l7-7 7 7" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   رابط بسيط (نمط Home)
   ───────────────────────────────────────── */
function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center text-sm text-slate-600 transition hover:text-emerald-700"
    >
      <span>{children}</span>
      <span
        className="ms-1.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────
   عنوان عمود (eyebrow)
   ───────────────────────────────────────── */
function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
      {children}
    </h3>
  );
}

/* ─────────────────────────────────────────
   خط فاصل أنيق بتدرج أخضر
   ───────────────────────────────────────── */
function ElegantDivider() {
  return (
    <div className="relative h-px w-full bg-slate-200">
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-emerald-500/60 to-transparent" />
    </div>
  );
}

/* ─────────────────────────────────────────
   اللغات المتاحة (نفس ترتيب LanguageSwitcher)
   ───────────────────────────────────────── */
type LocaleCode = "eu" | "es" | "en" | "ar";

const LANGUAGES: ReadonlyArray<{
  code: LocaleCode;
  label: string;
  name: string;
}> = [
  { code: "eu", label: "EU", name: "Euskara" },
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "AR", name: "العربية" },
];

export default function Footer() {
  const { t, locale, setLocale } = useI18n();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      {/* ═══════ خط متدرج رفيع في الأعلى (هوية Home) ═══════ */}
      <div className="h-1 bg-gradient-to-r from-blue-950 via-emerald-700 to-emerald-500" />

      {/* ═══════════ المحتوى الرئيسي ═══════════ */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1.5fr] lg:gap-12">

          {/* ── العمود 1: الهوية + الاتصال ── */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <NetworkIcon />
              </span>
              <span className="text-lg font-bold text-slate-950">
                {t("app_title")}
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              {t("footer_project_desc")}
            </p>

            {/* معلومات الاتصال */}
            <div className="mt-5 space-y-2">
              <a
                href="mailto:info@zubiasocial.eus"
                className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-emerald-700"
              >
                <MailIcon className="h-4 w-4 shrink-0" />
                info@zubiasocial.eus
              </a>
              <a
                href="tel:+34945000000"
                className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-emerald-700"
              >
                <PhoneIcon className="h-4 w-4 shrink-0" />
                +34 945 000 000
              </a>
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              {t("footer_project_by")}
            </p>
          </div>

          {/* ── العمود 2: حول ── */}
          <div>
            <ColumnHeading>{t("footer_about")}</ColumnHeading>
            <ul className="mt-5 space-y-3">
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
            <ColumnHeading>{t("quick_links")}</ColumnHeading>
            <ul className="mt-5 space-y-3">
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
            <ColumnHeading>{t("footer_newsletter")}</ColumnHeading>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              {t("footer_newsletter_desc")}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <input
                name="email"
                type="email"
                required
                placeholder={t("footer_email_placeholder")}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              >
                {t("footer_subscribe")}
              </button>
            </form>

            {subscribed && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  ✓
                </span>
                {t("footer_subscribe_success")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ خط فاصل أنيق بين المحتوى الرئيسي والشريط السفلي ═══════ */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <ElegantDivider />
      </div>

      {/* ═══════════ الشريط السفلي ═══════════ */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">

            {/* ── اليمين (RTL): كادر الشعار + النص الداعم ── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
                <img
                  src="/images/MarcaAytoMonocolor-V.jpg"
                  alt="Ayuntamiento de Vitoria-Gasteiz / Vitoria-Gasteizko Udala"
                  className="h-14 w-auto shrink-0"
                />
                <div className="min-w-0 border-s border-slate-200 ps-5">
                  <p className="text-sm font-bold text-slate-800">
                    Vitoria-Gasteiz
                  </p>
                  <p className="text-xs text-slate-500">
                    Vitoria-Gasteizko Udala
                  </p>
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                    {t("footer_support_label")}
                  </p>
                  <p className="text-xs leading-6 text-slate-500 lg:text-start">
                {t("footer_support_desc")}
              </p>
                </div>
              </div>
 
            </div>

            {/* ── اليسار (RTL): الحقوق + اللغات + الإخلاء + زر الأعلى ── */}
            <div className="flex flex-col gap-4 text-center lg:items-start lg:text-start">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  © {new Date().getFullYear()} {t("app_title")}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {t("footer_copyright")}
                </p>
              </div>

              {/* مبدّل اللغة التفاعلي */}
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="text-xs font-semibold text-slate-500">
                  {t("language") || "Idioma"}:
                </span>

                {LANGUAGES.map((lang) => {
                  const isActive = locale === lang.code;

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLocale(lang.code)}
                      aria-label={`Cambiar a ${lang.name}`}
                      aria-current={isActive ? "true" : undefined}
                      title={lang.name}
                      className={`
                        min-w-[36px]
                        rounded-md
                        border
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        transition
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-emerald-500
                        focus-visible:ring-offset-1
                        ${
                          isActive
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        }
                      `}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>

              {/* خط فاصل رفيع داخلي */}
              <div className="h-px w-full bg-slate-200" />

              <p className="text-xs leading-6 text-slate-500">
                {t("footer_disclaimer")}
              </p>

              {/* زر العودة للأعلى */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBackToTop}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  aria-label="Volver arriba"
                >
                  <ArrowUpIcon className="h-4 w-4" />
                  {t("footer_back_to_top")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}