import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usersService } from "../services/users.service";
import { useI18n } from "../i18n";

/* ─────────────────────────────────────────
   قائمة الدول
   ───────────────────────────────────────── */
const countries = [
  ["AF", "Afghanistan", "+93"], ["AL", "Albania", "+355"], ["DZ", "Algeria", "+213"],
  ["AR", "Argentina", "+54"], ["BE", "Belgium", "+32"], ["BR", "Brazil", "+55"],
  ["CM", "Cameroon", "+237"], ["CA", "Canada", "+1"], ["CL", "Chile", "+56"],
  ["CO", "Colombia", "+57"], ["CI", "Cote d'Ivoire", "+225"], ["EG", "Egypt", "+20"],
  ["FR", "France", "+33"], ["DE", "Germany", "+49"], ["GH", "Ghana", "+233"],
  ["GN", "Guinea", "+224"], ["GW", "Guinea-Bissau", "+245"], ["IT", "Italy", "+39"],
  ["ML", "Mali", "+223"], ["MR", "Mauritania", "+222"], ["MA", "Morocco", "+212"],
  ["NL", "Netherlands", "+31"], ["NG", "Nigeria", "+234"], ["PK", "Pakistan", "+92"],
  ["PS", "Palestine", "+970"], ["PT", "Portugal", "+351"], ["SN", "Senegal", "+221"],
  ["ES", "Spain", "+34"], ["SD", "Sudan", "+249"], ["SY", "Syria", "+963"],
  ["TN", "Tunisia", "+216"], ["TR", "Turkey", "+90"], ["UA", "Ukraine", "+380"],
  ["GB", "United Kingdom", "+44"], ["US", "United States", "+1"], ["VE", "Venezuela", "+58"],
] as const;

type Country = (typeof countries)[number];

const flagUrl = (iso: string) =>
  `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;

const countryLabel = ([, name]: Country) => name;
const phoneLabel = (country: Country) => `${countryLabel(country)} ${country[2]}`;

function Label({
  children,
  required = false,
  htmlFor,
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-slate-800">
      {children}
      {required && <span className="ms-1 text-emerald-600">*</span>}
    </label>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-6 bg-emerald-500" />
      <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-600">
        {children}
      </h3>
    </div>
  );
}

function CountrySearchInput({
  value,
  onChange,
  mode,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  mode: "country" | "phone";
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const query = value.trim().toLowerCase();
  const valueFor = (country: Country) =>
    mode === "phone" ? phoneLabel(country) : countryLabel(country);
  const selected = countries.find((country) => valueFor(country) === value);
  const filtered = countries
    .filter(([iso, name, code]) =>
      !query || `${iso} ${name} ${code}`.toLowerCase().includes(query)
    )
    .slice(0, 12);

  return (
    <div className="relative">
      {selected && (
        <img
          src={flagUrl(selected[0])}
          alt=""
          className="pointer-events-none absolute start-4 top-1/2 h-4 w-6 -translate-y-1/2 rounded-sm object-cover ring-1 ring-slate-200"
        />
      )}
      <input
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200 bg-white py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
          selected ? "ps-14 pe-4" : "px-4"
        }`}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-40 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          {filtered.map((country) => (
            <button
              key={`${mode}-${country[0]}-${country[2]}`}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(valueFor(country));
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition hover:bg-slate-50"
            >
              <img
                src={flagUrl(country[0])}
                alt=""
                className="h-4 w-6 rounded-sm object-cover ring-1 ring-slate-200"
              />
              <span className="flex-1 font-medium text-slate-800">{country[1]}</span>
              {mode === "phone" && (
                <span className="font-mono text-xs text-slate-500">{country[2]}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewUserPage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  const [showOptional, setShowOptional] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneCountryCode: phoneLabel(["ES", "Spain", "+34"]),
    phoneNumber: "",
    originCountry: "",
    legalConsentAccepted: false,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));

    /* امسح خطأ الحقل عند الكتابة */
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((current) => ({ ...current, [name]: undefined }));
    }

    /* امسح خطأ API عند الكتابة */
    if (apiError) setApiError("");
  };

  const isReady =
    formData.displayName.trim().length >= 2 &&
    formData.email.trim().length > 0 &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    formData.legalConsentAccepted;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setApiError("");
    setSuccess("");

    /* افحص الأخطاء */
    const validation = validate();
    setFieldErrors(validation);

    if (Object.keys(validation).length > 0) {
      /* مرّر إلى أول خطأ */
      window.setTimeout(() => {
        const firstError = formRef.current?.querySelector(
          '[aria-invalid="true"]'
        );
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          (firstError as HTMLElement).focus({ preventScroll: true });
        }
      }, 50);
      return;
    }

    setSaving(true);

    try {
      if (formData.displayName.trim().length < 2) {
        setError(t("register_display_name_error"));
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        setError(t("register_error_email"));
        return;
      }
      if (formData.password.length < 8) {
        setError(t("password_min_error"));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t("password_match_error"));
        return;
      }
      if (!formData.legalConsentAccepted) {
        setError(t("legal_consent_required"));
        return;
      }

      const phoneDialCode =
        formData.phoneCountryCode.match(/\+\d+/)?.[0] || "";
      const phoneNumber = formData.phoneNumber.replace(/\D/g, "");
      const phone =
        phoneDialCode && phoneNumber ? `${phoneDialCode}${phoneNumber}` : undefined;

      /* إرسال البيانات — as any لتجاوز فحص TypeScript
         لأن RegisterPayload قد يعرّف fullName/originCountry كحقول مطلوبة */
      await usersService.register({
        displayName: formData.displayName.trim(),
        fullName: formData.fullName.trim() || undefined,
        email: formData.email.trim(),
        password: formData.password,
        phone,
        originCountry: formData.originCountry.trim() || undefined,
        preferredLanguage: locale,
        legalConsentAccepted: true,
      });

      setSuccess(t("user_create_success"));
      window.setTimeout(
        () =>
          navigate("/login", {
            state: { registered: true, email: formData.email.trim() },
          }),
        1200
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";

      /* ترجمة رسائل الباكند المعروفة */
      if (/email.*already|ya.*registrado|already.*exists/i.test(message)) {
        setFieldErrors({ email: t("register_error_email_taken") });
      } else if (/password.*weak|contraseña.*débil/i.test(message)) {
        setFieldErrors({ password: t("register_error_password_weak") });
      } else if (
        /phone.*required|tel[eé]fono.*requerido|tel[eé]fono.*obligatorio|móvil.*requerido/i.test(
          message
        )
      ) {
        setFieldErrors({ phoneNumber: t("register_error_phone_required") });
      } else if (/email.*required|correo.*requerido/i.test(message)) {
        setFieldErrors({ email: t("register_error_email_required") });
      } else if (
        /name.*required|nombre.*requerido|nombre.*necesario/i.test(message)
      ) {
        setFieldErrors({ displayName: t("register_display_name_error") });
      } else if (/password.*required|contraseña.*requerida/i.test(message)) {
        setFieldErrors({ password: t("password_min_error") });
      } else {
        /* رسالة عامة مترجمة — لا نعرض رسائل الباكند الخام */
        setApiError(t("user_create_error"));
      }
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────────────────────────────────
     الرسم
     ───────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t("register_title")}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {t("user_new_title")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {t("user_new_subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 text-sm leading-6 text-blue-950">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg ring-1 ring-blue-100">
                🏛️
              </span>
              <div>
                <p className="font-bold">{t("register_org_link_title")}</p>
                <p className="mt-1 text-blue-900/80">{t("register_org_link_desc")}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-5">
            <SectionTitle>{t("register_personal_data")}</SectionTitle>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="displayName" required>
                  {t("display_name")}
                </Label>
                <input
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  autoComplete="nickname"
                  required
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  {t("display_name_help")}
                </p>
              </div>

              <div>
                <Label htmlFor="fullName">{t("full_name")}</Label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" required>{t("email")}</Label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                autoComplete="email"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="password" required>{t("password")}</Label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  required
                />
                <p className="mt-1.5 text-xs text-slate-500">{t("password_help")}</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" required>{t("confirm_password")}</Label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowOptional((value) => !value)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start transition hover:bg-slate-100/60"
              aria-expanded={showOptional}
            >
              <div>
                <div className="text-sm font-bold text-slate-800">
                  {showOptional ? t("register_hide_optional") : t("register_show_optional")}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {t("register_optional_help")}
                </div>
              </div>
              <span className={`text-xl text-slate-400 transition-transform ${showOptional ? "rotate-90" : ""}`}>›</span>
            </button>

            {showOptional && (
              <div className="space-y-5 border-t border-slate-200 p-5">
                <div>
                  <Label htmlFor="phoneNumber">{t("phone")}</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <CountrySearchInput
                      value={formData.phoneCountryCode}
                      onChange={(value) =>
                        setFormData((current) => ({ ...current, phoneCountryCode: value }))
                      }
                      mode="phone"
                      placeholder={t("phone_search_placeholder")}
                    />
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      placeholder={t("phone_number")}
                    />
                  </div>
                </div>

                <div>
                  <Label>{t("origin_country")}</Label>
                  <CountrySearchInput
                    value={formData.originCountry}
                    onChange={(value) =>
                      setFormData((current) => ({ ...current, originCountry: value }))
                    }
                    mode="country"
                    placeholder={t("country_search_placeholder")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm leading-6 text-slate-700">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
              i
            </span>
            <div>
              <span className="font-bold text-slate-900">{t("register_language_label")}: </span>
              {t("register_language_note")}
            </div>
          </div>

          <label className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              name="legalConsentAccepted"
              checked={formData.legalConsentAccepted}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>
              {t("legal_consent_text")}{" "}
              <Link to="/condiciones" className="font-bold text-emerald-700 underline">
                {t("legal_terms_link")}
              </Link>
            </span>
          </label>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              {t("cancel")}
            </Link>
            <button
              type="submit"
              disabled={!isReady || saving}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? t("saving") : t("register_submit")}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {t("register_already_have")}{" "}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            {t("login_button")}
          </Link>
        </p>
      </div>
    </main>
  );
}