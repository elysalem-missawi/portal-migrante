import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { http } from "../services/api";
import { usersService, type RegisterUserResult } from "../services/users.service";
import { useI18n } from "../i18n";

const facebookRegister = (accessToken: string) =>
  http<RegisterUserResult>("/users/register/facebook", {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });

const countries = [
  ["AF", "Afghanistan", "+93"], ["AL", "Albania", "+355"], ["DZ", "Algeria", "+213"],
  ["AD", "Andorra", "+376"], ["AO", "Angola", "+244"], ["AR", "Argentina", "+54"],
  ["AM", "Armenia", "+374"], ["AU", "Australia", "+61"], ["AT", "Austria", "+43"],
  ["AZ", "Azerbaijan", "+994"], ["BH", "Bahrain", "+973"], ["BD", "Bangladesh", "+880"],
  ["BY", "Belarus", "+375"], ["BE", "Belgium", "+32"], ["BJ", "Benin", "+229"],
  ["BO", "Bolivia", "+591"], ["BA", "Bosnia and Herzegovina", "+387"], ["BR", "Brazil", "+55"],
  ["BG", "Bulgaria", "+359"], ["BF", "Burkina Faso", "+226"], ["BI", "Burundi", "+257"],
  ["KH", "Cambodia", "+855"], ["CM", "Cameroon", "+237"], ["CA", "Canada", "+1"],
  ["CV", "Cape Verde", "+238"], ["CF", "Central African Republic", "+236"], ["TD", "Chad", "+235"],
  ["CL", "Chile", "+56"], ["CN", "China", "+86"], ["CO", "Colombia", "+57"],
  ["KM", "Comoros", "+269"], ["CG", "Congo", "+242"], ["CD", "Congo DR", "+243"],
  ["CR", "Costa Rica", "+506"], ["CI", "Cote d'Ivoire", "+225"], ["HR", "Croatia", "+385"],
  ["CU", "Cuba", "+53"], ["CY", "Cyprus", "+357"], ["CZ", "Czech Republic", "+420"],
  ["DK", "Denmark", "+45"], ["DJ", "Djibouti", "+253"], ["DO", "Dominican Republic", "+1"],
  ["EC", "Ecuador", "+593"], ["EG", "Egypt", "+20"], ["SV", "El Salvador", "+503"],
  ["GQ", "Equatorial Guinea", "+240"], ["ER", "Eritrea", "+291"], ["EE", "Estonia", "+372"],
  ["ET", "Ethiopia", "+251"], ["FI", "Finland", "+358"], ["FR", "France", "+33"],
  ["GA", "Gabon", "+241"], ["GM", "Gambia", "+220"], ["GE", "Georgia", "+995"],
  ["DE", "Germany", "+49"], ["GH", "Ghana", "+233"], ["GR", "Greece", "+30"],
  ["GT", "Guatemala", "+502"], ["GN", "Guinea", "+224"], ["GW", "Guinea-Bissau", "+245"],
  ["HT", "Haiti", "+509"], ["HN", "Honduras", "+504"], ["HU", "Hungary", "+36"],
  ["IS", "Iceland", "+354"], ["IN", "India", "+91"], ["ID", "Indonesia", "+62"],
  ["IR", "Iran", "+98"], ["IQ", "Iraq", "+964"], ["IE", "Ireland", "+353"],
  ["IL", "Israel", "+972"], ["IT", "Italy", "+39"], ["JM", "Jamaica", "+1"],
  ["JP", "Japan", "+81"], ["JO", "Jordan", "+962"], ["KZ", "Kazakhstan", "+7"],
  ["KE", "Kenya", "+254"], ["KW", "Kuwait", "+965"], ["KG", "Kyrgyzstan", "+996"],
  ["LA", "Laos", "+856"], ["LV", "Latvia", "+371"], ["LB", "Lebanon", "+961"],
  ["LR", "Liberia", "+231"], ["LY", "Libya", "+218"], ["LI", "Liechtenstein", "+423"],
  ["LT", "Lithuania", "+370"], ["LU", "Luxembourg", "+352"], ["MG", "Madagascar", "+261"],
  ["MW", "Malawi", "+265"], ["MY", "Malaysia", "+60"], ["ML", "Mali", "+223"],
  ["MT", "Malta", "+356"], ["MR", "Mauritania", "+222"], ["MU", "Mauritius", "+230"],
  ["MX", "Mexico", "+52"], ["MD", "Moldova", "+373"], ["MC", "Monaco", "+377"],
  ["MN", "Mongolia", "+976"], ["ME", "Montenegro", "+382"], ["MA", "Morocco", "+212"],
  ["MZ", "Mozambique", "+258"], ["MM", "Myanmar", "+95"], ["NA", "Namibia", "+264"],
  ["NP", "Nepal", "+977"], ["NL", "Netherlands", "+31"], ["NZ", "New Zealand", "+64"],
  ["NI", "Nicaragua", "+505"], ["NE", "Niger", "+227"], ["NG", "Nigeria", "+234"],
  ["KP", "North Korea", "+850"], ["MK", "North Macedonia", "+389"], ["NO", "Norway", "+47"],
  ["OM", "Oman", "+968"], ["PK", "Pakistan", "+92"], ["PS", "Palestine", "+970"],
  ["PA", "Panama", "+507"], ["PY", "Paraguay", "+595"], ["PE", "Peru", "+51"],
  ["PH", "Philippines", "+63"], ["PL", "Poland", "+48"], ["PT", "Portugal", "+351"],
  ["QA", "Qatar", "+974"], ["RO", "Romania", "+40"], ["RU", "Russia", "+7"],
  ["RW", "Rwanda", "+250"], ["SA", "Saudi Arabia", "+966"], ["SN", "Senegal", "+221"],
  ["RS", "Serbia", "+381"], ["SL", "Sierra Leone", "+232"], ["SG", "Singapore", "+65"],
  ["SK", "Slovakia", "+421"], ["SI", "Slovenia", "+386"], ["SO", "Somalia", "+252"],
  ["ZA", "South Africa", "+27"], ["KR", "South Korea", "+82"], ["ES", "Spain", "+34"],
  ["LK", "Sri Lanka", "+94"], ["SD", "Sudan", "+249"], ["SE", "Sweden", "+46"],
  ["CH", "Switzerland", "+41"], ["SY", "Syria", "+963"], ["TW", "Taiwan", "+886"],
  ["TJ", "Tajikistan", "+992"], ["TZ", "Tanzania", "+255"], ["TH", "Thailand", "+66"],
  ["TG", "Togo", "+228"], ["TN", "Tunisia", "+216"], ["TR", "Turkey", "+90"],
  ["TM", "Turkmenistan", "+993"], ["UG", "Uganda", "+256"], ["UA", "Ukraine", "+380"],
  ["AE", "United Arab Emirates", "+971"], ["GB", "United Kingdom", "+44"],
  ["US", "United States", "+1"], ["UY", "Uruguay", "+598"], ["UZ", "Uzbekistan", "+998"],
  ["VE", "Venezuela", "+58"], ["VN", "Vietnam", "+84"], ["YE", "Yemen", "+967"],
  ["ZM", "Zambia", "+260"], ["ZW", "Zimbabwe", "+263"],
] as const;

type Country = (typeof countries)[number];
type AccountType = "individual" | "organization_account";

const flagUrl = (iso: string) =>
  `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;

const countryLabel = ([, name]: Country) => name;
const phoneLabel = (country: Country) => `${countryLabel(country)} ${country[2]}`;

function CountrySearchInput({
  value,
  onChange,
  mode,
  placeholder,
  required,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  mode: "country" | "phone";
  placeholder: string;
  required?: boolean;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const query = value.trim().toLowerCase();
  const valueFor = (c: Country) =>
    mode === "phone" ? phoneLabel(c) : countryLabel(c);

  const selected = countries.find((c) => valueFor(c) === value);
  const filtered = countries
    .filter(([iso, name, code]) => {
      const h = `${iso} ${name} ${code}`.toLowerCase();
      return !query || h.includes(query);
    })
    .slice(0, 10);

  return (
    <div className="relative">
      {selected && (
        <img
          src={flagUrl(selected[0])}
          alt=""
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-6 -translate-y-1/2 rounded-sm object-cover ring-1 ring-slate-200"
        />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        required={required}
        aria-label={ariaLabel}
        autoComplete="off"
        className={`w-full rounded-xl border border-slate-200 bg-white py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
          selected ? "pl-14 pr-4" : "px-4"
        }`}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-40 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          {filtered.map((c) => (
            <button
              key={`${mode}-${c[0]}-${c[2]}`}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(valueFor(c));
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50"
            >
              <img
                src={flagUrl(c[0])}
                alt=""
                className="h-4 w-6 rounded-sm object-cover ring-1 ring-slate-200"
              />
              <span className="flex-1 font-medium text-slate-800">{c[1]}</span>
              {mode === "phone" && (
                <span className="font-mono text-xs text-slate-500">{c[2]}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const nativeLanguages = [
  "Arabic / العربية",
  "English",
  "French / Français",
  "Spanish / Español",
];

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
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-slate-800"
    >
      {children}
      {required && <span className="ml-1 text-emerald-600">*</span>}
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

function AccountTypeCard({
  icon,
  title,
  desc,
  selected,
  onSelect,
}: {
  icon: string;
  title: string;
  desc: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full rounded-2xl border-2 p-5 text-left transition-all ${
        selected
          ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl transition ${
            selected
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
              : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
          }`}
        >
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <div
            className={`text-sm font-bold ${
              selected ? "text-emerald-900" : "text-slate-900"
            }`}
          >
            {title}
          </div>
          <div className="mt-0.5 text-xs leading-relaxed text-slate-500">
            {desc}
          </div>
        </div>

        <span
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
            selected
              ? "border-emerald-500 bg-emerald-500"
              : "border-slate-300 bg-white"
          }`}
        >
          {selected && (
            <svg
              className="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </div>
    </button>
  );
}

export default function NewUserPage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  const [formData, setFormData] = useState({
    accountType: "individual" as AccountType,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneCountryCode: phoneLabel(["ES", "Spain", "+34"]),
    phoneNumber: "",
    originCountry: "",
    nativeLanguage: "",
    organizationName: "",
    cif: "",
    contactPersonName: "",
    orgPhoneCountryCode: phoneLabel(["ES", "Spain", "+34"]),
    orgPhoneNumber: "",
    address: "",
    postalCode: "",
    legalConsentAccepted: false,
  });

  const [showOptional, setShowOptional] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOrg = formData.accountType === "organization_account";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((c) => ({
      ...c,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const phoneDialCode = formData.phoneCountryCode.match(/\+\d+/)?.[0] || "";
  const phoneNumber = phoneDialCode
    ? `${phoneDialCode}${formData.phoneNumber.replace(/\D/g, "")}`
    : "";

  const orgPhoneDialCode =
    formData.orgPhoneCountryCode.match(/\+\d+/)?.[0] || "";
  const orgPhoneNumber = orgPhoneDialCode
    ? `${orgPhoneDialCode}${formData.orgPhoneNumber.replace(/\D/g, "")}`
    : "";

  const isFormReady = isOrg
    ? formData.organizationName.trim().length > 0 &&
      /^[A-Z0-9\-]{5,15}$/i.test(formData.cif.trim()) &&
      formData.email.trim().length > 0 &&
      formData.address.trim().length > 0 &&
      /^\d{4,5}$/.test(formData.postalCode.trim()) &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.legalConsentAccepted
    : formData.firstName.trim().length > 0 &&
      formData.lastName.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.legalConsentAccepted;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!isOrg) {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError(t("register_error_names"));
          return;
        }
      } else {
        if (!formData.organizationName.trim()) {
          setError(t("register_error_org_name"));
          return;
        }
        if (!/^[A-Z0-9\-]{5,15}$/i.test(formData.cif.trim())) {
          setError(t("register_error_cif"));
          return;
        }
        if (!formData.address.trim()) {
          setError(t("register_error_address"));
          return;
        }
        if (!/^\d{4,5}$/.test(formData.postalCode.trim())) {
          setError(t("register_error_postal"));
          return;
        }
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

      await usersService.register({
        accountType: formData.accountType,
        fullName: isOrg
          ? formData.organizationName.trim()
          : `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        phone: isOrg ? orgPhoneNumber || undefined : phoneNumber || undefined,
        password: formData.password,
        preferredLanguage: locale,
        originCountry: isOrg ? undefined : formData.originCountry || undefined,
        nativeLanguage: isOrg ? undefined : formData.nativeLanguage || undefined,
        legalConsentAccepted: formData.legalConsentAccepted,
        firstName: isOrg ? undefined : formData.firstName.trim(),
        lastName: isOrg ? undefined : formData.lastName.trim(),
        organizationName: isOrg ? formData.organizationName.trim() : undefined,
        cif: isOrg ? formData.cif.trim() : undefined,
        contactPersonName: isOrg
          ? formData.contactPersonName.trim() || undefined
          : undefined,
        address: isOrg ? formData.address.trim() : undefined,
        postalCode: isOrg ? formData.postalCode.trim() : undefined,
      });

      setSuccess(
        isOrg ? t("register_success_org_desc") : t("user_create_success")
      );

      window.setTimeout(
        () =>
          navigate("/login", {
            state: { registered: true, email: formData.email.trim() },
          }),
        900
      );
    } catch (err: any) {
      setError(err.message || t("user_create_error"));
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setSaving(true);
      setError("");
      const result = await usersService.googleRegister(
        credentialResponse.credential
      );
      setSuccess(t("user_create_success"));
      window.setTimeout(
        () =>
          navigate("/login", {
            state: { registered: true, email: result.user.email },
          }),
        900
      );
    } catch (err: any) {
      setError(err.message || t("user_create_error"));
    } finally {
      setSaving(false);
    }
  };

  const handleFacebookSuccess = async (response: any) => {
    try {
      setSaving(true);
      setError("");

      if (!response?.accessToken) {
        setError(t("user_create_error"));
        return;
      }

      const result = await facebookRegister(response.accessToken);

      setSuccess(t("user_create_success"));
      window.setTimeout(
        () =>
          navigate("/login", {
            state: { registered: true, email: result.user.email },
          }),
        900
      );
    } catch (err: any) {
      setError(err.message || t("user_create_error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-800 transition hover:text-emerald-600"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
              Z
            </span>
            <span>Zubia Social Euskadi</span>
          </Link>
          <Link
            to="/users/login"
            className="text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
          >
            {t("login_button")} →
          </Link>
        </div>
      </div>

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

        {isOrg && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500 text-sm text-white">
              ℹ
            </span>
            <div>
              <div className="text-sm font-bold text-blue-900">
                {t("register_org_social_note_title")}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-blue-800/80">
                {t("register_org_social_note_desc")}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8">
            <SectionTitle>{t("account_type")}</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <AccountTypeCard
                icon="👤"
                title={t("account_type_individual")}
                desc={t("register_type_individual_desc")}
                selected={!isOrg}
                onSelect={() =>
                  setFormData((c) => ({ ...c, accountType: "individual" }))
                }
              />
              <AccountTypeCard
                icon="🏛️"
                title={t("account_type_organization_account")}
                desc={t("register_type_organization_desc")}
                selected={isOrg}
                onSelect={() =>
                  setFormData((c) => ({
                    ...c,
                    accountType: "organization_account",
                  }))
                }
              />
            </div>
          </div>

          {!isOrg && (
            <>
              <div className="mb-8 space-y-5">
                <SectionTitle>{t("register_personal_data")}</SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" required>
                      {t("register_first_name")}
                    </Label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.firstName}
                      onChange={handleChange}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" required>
                      {t("register_last_name")}
                    </Label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.lastName}
                      onChange={handleChange}
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" required>
                    {t("email")}
                  </Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="password" required>
                      {t("password")}
                    </Label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      {t("password_help")}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" required>
                      {t("confirm_password")}
                    </Label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setShowOptional(!showOptional)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-slate-100/50"
                  aria-expanded={showOptional}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          showOptional ? "rotate-90" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {showOptional
                          ? t("register_hide_optional")
                          : t("register_show_optional")}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {t("register_optional_help")}
                      </div>
                    </div>
                  </div>
                </button>

                {showOptional && (
                  <div className="border-t border-slate-200 p-5">
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="phoneNumber">{t("phone")}</Label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <CountrySearchInput
                            value={formData.phoneCountryCode}
                            onChange={(v) =>
                              setFormData((c) => ({
                                ...c,
                                phoneCountryCode: v,
                              }))
                            }
                            mode="phone"
                            placeholder={t("phone_search_placeholder")}
                            ariaLabel={t("phone_country_code")}
                          />
                          <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            inputMode="tel"
                            placeholder={t("phone_number")}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="originCountry">
                            {t("origin_country")}
                          </Label>
                          <CountrySearchInput
                            value={formData.originCountry}
                            onChange={(v) =>
                              setFormData((c) => ({
                                ...c,
                                originCountry: v,
                              }))
                            }
                            mode="country"
                            placeholder={t("country_search_placeholder")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="nativeLanguage">
                            {t("native_language")}
                          </Label>
                          <select
                            id="nativeLanguage"
                            name="nativeLanguage"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            value={formData.nativeLanguage}
                            onChange={handleChange}
                          >
                            <option value="">{t("select_option")}</option>
                            {nativeLanguages.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {isOrg && (
            <>
              <div className="mb-8 space-y-5">
                <SectionTitle>{t("register_org_data")}</SectionTitle>

                <div>
                  <Label htmlFor="organizationName" required>
                    {t("register_org_name")}
                  </Label>
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder={t("register_placeholder_org_name")}
                    autoComplete="organization"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cif" required>
                      {t("register_cif")}
                    </Label>
                    <input
                      id="cif"
                      name="cif"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.cif}
                      onChange={handleChange}
                      placeholder="G01234567"
                      maxLength={15}
                      required
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      {t("register_cif_help")}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="contactPersonName">
                      {t("register_contact_person")}
                    </Label>
                    <input
                      id="contactPersonName"
                      name="contactPersonName"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-5">
                <SectionTitle>{t("register_contact_info")}</SectionTitle>

                <div>
                  <Label htmlFor="email" required>
                    {t("email")}
                  </Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="orgPhoneNumber">{t("phone")}</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <CountrySearchInput
                      value={formData.orgPhoneCountryCode}
                      onChange={(v) =>
                        setFormData((c) => ({
                          ...c,
                          orgPhoneCountryCode: v,
                        }))
                      }
                      mode="phone"
                      placeholder={t("phone_search_placeholder")}
                      ariaLabel={t("phone_country_code")}
                    />
                    <input
                      id="orgPhoneNumber"
                      name="orgPhoneNumber"
                      type="tel"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.orgPhoneNumber}
                      onChange={handleChange}
                      inputMode="tel"
                      placeholder={t("phone_number")}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                  <div>
                    <Label htmlFor="address" required>
                      {t("register_address")}
                    </Label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t("register_placeholder_address")}
                      autoComplete="street-address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" required>
                      {t("register_postal_code")}
                    </Label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="01001"
                      maxLength={5}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-5">
                <SectionTitle>{t("register_security")}</SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="password" required>
                      {t("password")}
                    </Label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      {t("password_help")}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" required>
                      {t("confirm_password")}
                    </Label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-sm text-white">
                  ✓
                </span>
                <div>
                  <div className="text-sm font-bold text-emerald-900">
                    {t("register_org_note_title")}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-emerald-800/80">
                    {t("register_org_note_desc")}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="mb-6">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50">
              <input
                id="legalConsentAccepted"
                type="checkbox"
                name="legalConsentAccepted"
                className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/30"
                checked={formData.legalConsentAccepted}
                onChange={handleChange}
                required
              />
              <span className="text-sm leading-relaxed text-slate-700">
                {t("legal_consent_text")}
                <Link
                  to="/condiciones"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 font-semibold text-emerald-600 underline decoration-emerald-300 underline-offset-2 transition hover:text-emerald-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("legal_terms_link")}
                </Link>
              </span>
            </label>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                !
              </span>
              <p className="text-sm font-medium leading-relaxed text-red-800">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                ✓
              </span>
              <p className="text-sm font-medium leading-relaxed text-emerald-800">
                {success}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/foro")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={saving || !isFormReady}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {saving
                ? t("saving")
                : isOrg
                  ? t("register_submit_organization")
                  : t("register_submit")}
              {!saving && (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>

        {!isOrg && (
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t("register_or_divider")}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex h-[52px] items-center justify-center [&>div]:w-full [&_iframe]:!w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError(t("user_create_error"))}
                  text="signup_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  logo_alignment="left"
                  width="100%"
                />
              </div>

              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID || ""}
                onSuccess={handleFacebookSuccess}
                onFail={() => setError(t("user_create_error"))}
                render={({ onClick }) => (
                  <button
                    type="button"
                    onClick={onClick}
                    className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-[#1877F2]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>{t("register_facebook_button")}</span>
                  </button>
                )}
              />
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              {t("register_social_note")}
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          {t("register_already_have")}{" "}
          <Link
            to="/users/login"
            className="font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            {t("login_button")}
          </Link>
        </p>
      </div>
    </main>
  );
}