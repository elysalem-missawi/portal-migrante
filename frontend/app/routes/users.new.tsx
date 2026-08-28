import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usersService, type User } from "../services/users.service";
import { useI18n } from "../i18n";

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

const flagUrl = (iso: string) => `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;

const countryLabel = ([, name]: Country) => name;

const phoneLabel = (country: Country) => `${countryLabel(country)} ${country[2]}`;

function CountrySearchInput({
  value,
  onChange,
  mode,
  placeholder,
  hint,
  required,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  mode: "country" | "phone";
  placeholder: string;
  hint: string;
  required?: boolean;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const query = value.trim().toLowerCase();
  const valueFor = (country: Country) =>
    mode === "phone" ? phoneLabel(country) : countryLabel(country);
  const selectedCountry = countries.find((country) => valueFor(country) === value);
  const filteredCountries = countries
    .filter(([iso, name, code]) => {
      const haystack = `${iso} ${name} ${code}`.toLowerCase();
      return !query || haystack.includes(query);
    })
    .slice(0, 12);

  return (
    <div className="position-relative">
      {selectedCountry && (
        <img
          src={flagUrl(selectedCountry[0])}
          alt=""
          width={24}
          height={18}
          className="position-absolute rounded-1 border"
          style={{
            insetInlineStart: 14,
            top: "50%",
            transform: "translateY(-50%)",
            objectFit: "cover",
            zIndex: 2,
          }}
        />
      )}
      <input
        className={`form-control form-control-lg pe-5 ${
          selectedCountry ? "ps-5" : ""
        }`}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        placeholder={placeholder}
        required={required}
        aria-label={ariaLabel}
        autoComplete="off"
      />
      <span
        aria-hidden="true"
        className="position-absolute text-secondary"
        style={{
          insetInlineEnd: 14,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {"\u2315"}
      </span>
      {open && filteredCountries.length > 0 && (
        <div
          className="position-absolute start-0 end-0 mt-1 overflow-auto rounded-3 border bg-white shadow-sm"
          style={{ zIndex: 30, maxHeight: 260 }}
        >
          <div className="border-bottom bg-light px-3 py-2 small text-secondary">
            {hint}
          </div>
          {filteredCountries.map((country) => (
            <button
              key={`${mode}-${country[0]}-${country[2]}`}
              type="button"
              className="btn btn-light d-flex w-100 align-items-center gap-2 rounded-0 border-0 px-3 py-2 text-start"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(valueFor(country));
                setOpen(false);
              }}
            >
              <img
                src={flagUrl(country[0])}
                alt=""
                width={24}
                height={18}
                className="rounded-1 border"
                style={{ objectFit: "cover" }}
              />
              <span className="flex-grow-1">{country[1]}</span>
              {mode === "phone" && (
                <span className="fw-semibold text-secondary">{country[2]}</span>
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

function RequiredLabel({
  children,
  required = true,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="d-inline-flex align-items-center gap-1">
      <span>{children}</span>
      {required && (
        <span className="text-danger" aria-label="required">
          *
        </span>
      )}
    </span>
  );
}

export default function NewUserPage() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    email: "",
    phoneCountryCode: phoneLabel(["ES", "Spain", "+34"]),
    phoneNumber: "",
    originCountry: "",
    nativeLanguage: "",
    password: "",
    confirmPassword: "",
    legalConsentAccepted: false,
  });

  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const phoneDialCode = formData.phoneCountryCode.match(/\+\d+/)?.[0] || "";
  const phoneNumber = `${phoneDialCode}${formData.phoneNumber.replace(/\D/g, "")}`;
  const isFormReady =
    formData.fullName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    phoneDialCode.length > 0 &&
    formData.phoneNumber.replace(/\D/g, "").length > 0 &&
    formData.originCountry.trim().length > 0 &&
    formData.nativeLanguage.length > 0 &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    formData.legalConsentAccepted;
  const isRegistrationLocked = Boolean(registeredUser);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (isRegistrationLocked) {
        setError(t("registration_already_created"));
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

      if (!phoneDialCode) {
        setError(t("phone_country_code_required"));
        return;
      }

      const result = await usersService.register({
        accountType: "individual",
        role: "community_user",
        fullName: formData.fullName.trim(),
        displayName: formData.displayName.trim() || undefined,
        email: formData.email.trim(),
        phone: phoneNumber,
        password: formData.password,
        preferredLanguage: locale,
        originCountry: formData.originCountry,
        nativeLanguage: formData.nativeLanguage,
        legalConsentAccepted: formData.legalConsentAccepted,
        status: "pending",
        isVerified: false,
      });

      setRegisteredUser(result.user);
      setSuccess(
        result.phoneVerification?.sent
          ? t("phone_code_sent")
          : t("user_create_success")
      );
    } catch (err: any) {
      setError(err.message || t("user_create_error"));
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyPhone = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!registeredUser) return;

    setVerifying(true);
    setError("");
    setSuccess("");

    try {
      const user = await usersService.verifyPhone(
        registeredUser._id,
        verificationCode
      );
      setRegisteredUser(user);
      setSuccess(t("phone_verified_success"));
      setTimeout(() => navigate("/foro"), 700);
    } catch (err: any) {
      const message = String(err.message || "");
      setError(
        message.toLowerCase().includes("invalid verification code")
          ? t("phone_code_invalid")
          : message || t("phone_verify_error")
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!registeredUser) return;

    setVerifying(true);
    setError("");
    setSuccess("");

    try {
      await usersService.sendPhoneCode(registeredUser._id);
      setSuccess(t("phone_code_sent"));
    } catch (err: any) {
      setError(err.message || t("phone_code_send_error"));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(34,197,94,0.12), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #eef6f1 100%)",
      }}
    >
      <div className="container py-4 py-lg-5">
        <div className="row g-4 align-items-stretch">
          <aside className="col-12 col-xl-4">
            <div
              className="h-100 overflow-hidden rounded-3 border shadow-sm text-white"
              style={{
                minHeight: 560,
                backgroundImage:
                  "linear-gradient(180deg, rgba(2,44,23,0.12), rgba(2,44,23,0.88)), url('/images/registration-migrant-travel-hero.png')",
                backgroundPosition: "center top",
                backgroundSize: "cover",
              }}
            >
              <div className="d-flex h-100 flex-column justify-content-end p-4 p-lg-5">
                <div className="mb-3 d-inline-flex align-items-center gap-2 rounded-pill bg-white bg-opacity-25 px-3 py-2 text-sm fw-semibold">
                  <span aria-hidden="true">{"\uD83D\uDCF1"}</span>
                  {t("phone_verify_title")}
                </div>
                <h1 className="display-6 fw-bold mb-3">
                  {t("registration_panel_title")}
                </h1>
                <p className="lead mb-4 text-white-50">
                  {t("registration_panel_desc")}
                </p>
                <div className="d-grid gap-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="rounded-3 bg-white bg-opacity-10 p-3">
                      <div className="small fw-bold text-white-50 mb-1">0{item}</div>
                      <div>{t(`registration_panel_point_${item}`)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="col-12 col-xl-8">
            <div className="mb-4">
              <h1 className="display-6 fw-bold text-vitoria-black mb-2">
                {t("user_new_title")}
              </h1>
              <p className="lead text-secondary mb-0">{t("user_new_subtitle")}</p>
              <p className="small text-secondary mt-2 mb-0">
                <span className="text-danger">*</span> {t("required_fields_note")}
              </p>
            </div>
          <form
            onSubmit={handleSubmit}
            className="rounded-3 border bg-white p-4 p-lg-5 shadow-sm"
          >
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel>{t("full_name")}</RequiredLabel>
                </label>
                <input
                  name="fullName"
                  className="form-control form-control-lg"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel required={false}>{t("display_name")}</RequiredLabel>
                </label>
                <input
                  name="displayName"
                  className="form-control form-control-lg"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder={t("display_name_help")}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel>{t("email")}</RequiredLabel>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel>{t("phone")}</RequiredLabel>
                </label>
                <div className="row g-2">
                  <div className="col-12 col-lg-6">
                    <CountrySearchInput
                      value={formData.phoneCountryCode}
                      onChange={(value) =>
                        setFormData((current) => ({
                          ...current,
                          phoneCountryCode: value,
                        }))
                      }
                      mode="phone"
                      placeholder={t("phone_search_placeholder")}
                      hint={t("phone_search_hint")}
                      aria-label={t("phone_country_code")}
                      required
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <input
                      name="phoneNumber"
                      className="form-control form-control-lg"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      inputMode="tel"
                      placeholder={t("phone_number")}
                      required
                    />
                  </div>
                </div>
                <div className="form-text">{t("phone_sms_help")}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel>{t("origin_country")}</RequiredLabel>
                </label>
                <CountrySearchInput
                  value={formData.originCountry}
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      originCountry: value,
                    }))
                  }
                  mode="country"
                  placeholder={t("country_search_placeholder")}
                  hint={t("country_search_hint")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel>{t("native_language")}</RequiredLabel>
                </label>
                <select
                  name="nativeLanguage"
                  className="form-select form-select-lg"
                  value={formData.nativeLanguage}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("select_option")}</option>
                  {nativeLanguages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel>{t("password")}</RequiredLabel>
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
                <div className="form-text">{t("password_help")}</div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  <RequiredLabel>{t("confirm_password")}</RequiredLabel>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control form-control-lg"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
              </div>

              <div className="col-12">
                <div className="d-flex align-items-start gap-3 rounded-3 border bg-light p-3">
                  <input
                    id="legalConsentAccepted"
                    type="checkbox"
                    name="legalConsentAccepted"
                    className="form-check-input flex-shrink-0 mt-1"
                    checked={formData.legalConsentAccepted}
                    onChange={handleChange}
                    required
                  />
                  <label
                    className="text-secondary"
                    htmlFor="legalConsentAccepted"
                  >
                    <RequiredLabel>{t("legal_consent_text")}</RequiredLabel>
                    <div className="mt-2">
                      <Link
                        to="/condiciones"
                        target="_blank"
                        rel="noreferrer"
                        className="fw-semibold text-primary text-decoration-underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {t("legal_terms_link")}
                      </Link>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger mt-4 mb-0">{error}</div>}
            {success && (
              <div className="alert alert-success mt-4 mb-0">{success}</div>
            )}

            <div className="mt-4 d-grid d-md-flex justify-content-md-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                onClick={() => navigate("/foro")}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="btn btn-success btn-lg rounded-pill px-5 fw-semibold"
                disabled={saving || !isFormReady || isRegistrationLocked}
              >
                {isRegistrationLocked
                  ? t("registration_waiting_phone")
                  : saving
                    ? t("saving")
                    : t("create_user")}
              </button>
            </div>
          </form>

          {registeredUser && (
            <form
              onSubmit={handleVerifyPhone}
              className="mt-4 rounded-3 border bg-white p-4 shadow-sm"
            >
              <h2 className="h5 fw-bold mb-2">{t("phone_verify_title")}</h2>
              <p className="text-muted mb-3">{t("phone_verify_subtitle")}</p>

              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-semibold">{t("phone_code")}</label>
                  <input
                    className="form-control form-control-lg"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-md-4 d-grid">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg rounded-pill"
                    disabled={verifying}
                  >
                    {verifying ? t("saving") : t("verify_phone")}
                  </button>
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-between gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={handleResendCode}
                  disabled={verifying}
                >
                  {t("resend_code")}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-dark rounded-pill"
                  onClick={() => navigate("/foro")}
                >
                  {t("nav_forum")}
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </main>
  );
}
