import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useI18n } from "../i18n";
import { useAuth } from "../auth";

export default function LoginUserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const { signIn, status: authStatus } = useAuth();

  // ✅ اقرأ البريد من state مرة واحدة عند أول رندر
  const initialEmail =
    (location.state as { email?: string } | null)?.email || "";

  const [formData, setFormData] = useState({
    email: initialEmail,
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // ✅ تحقق
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const passwordValid = formData.password.length > 0;
  const canSubmit = emailValid && passwordValid && !saving;

  // ✅ effect واحد للرسائل فقط — بدون t في الاعتماديات
  useEffect(() => {
    const state = location.state as { registered?: boolean } | null;
    if (authStatus === "authenticated") {
      setSuccess(t("login_success"));
    } else if (state?.registered) {
      setSuccess(t("registration_login_required"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, location.state]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await signIn({
        email: formData.email.trim(),
        password: formData.password,
      });
      setSuccess(t("login_success"));
      const from =
        (location.state as { from?: string } | null)?.from || "/foro";
      setTimeout(() => navigate(from), 400);
    } catch (err: any) {
      setError(err.message || t("login_error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className="py-5"
      style={{
        minHeight: "calc(100vh - 80px)",
        background:
          "radial-gradient(circle at 15% 20%, rgba(34,197,94,0.10), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef6f1 100%)",
      }}
    >
      <div className="container py-lg-4">
        <div className="row g-4 g-lg-5 align-items-stretch justify-content-center">
          {/* ============ HERO ============ */}
          <aside className="col-12 col-lg-6">
            <div
              className="h-100 overflow-hidden rounded-4 border shadow-sm text-white position-relative"
              style={{
                minHeight: 520,
                backgroundImage:
                  "linear-gradient(180deg, rgba(2,44,23,0.10) 0%, rgba(2,44,23,0.85) 100%), url('/images/registration-migrant-travel-hero.png')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="d-flex h-100 flex-column justify-content-end p-4 p-lg-5">
                <span className="mb-3 d-inline-flex align-items-center gap-2 rounded-pill bg-white bg-opacity-25 px-3 py-2 small fw-semibold align-self-start">
                  🌍 {t("nav_forum")}
                </span>
                <h1 className="display-6 fw-bold mb-3">{t("login_title")}</h1>
                <p className="lead mb-0 text-white-50">
                  {t("login_subtitle")}
                </p>
              </div>
            </div>
          </aside>

          {/* ============ FORM ============ */}
          <div className="col-12 col-lg-6">
            <form
              onSubmit={submit}
              noValidate
              className="h-100 rounded-4 border bg-white p-4 p-lg-5 shadow-sm d-flex flex-column"
            >
              <header className="mb-4">
                <h2 className="h3 fw-bold mb-2">{t("login_title")}</h2>
                <p className="text-secondary mb-0">{t("login_subtitle")}</p>
              </header>

              {error && (
                <div
                  className="alert alert-danger d-flex align-items-start gap-2"
                  role="alert"
                  aria-live="assertive"
                >
                  <span aria-hidden="true">⚠️</span>
                  <div>{error}</div>
                </div>
              )}
              {success && (
                <div
                  className="alert alert-success d-flex align-items-start gap-2"
                  role="status"
                  aria-live="polite"
                >
                  <span aria-hidden="true">✓</span>
                  <div>{success}</div>
                </div>
              )}

              {/* ============ EMAIL ============ */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  {t("email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={t("login_email_placeholder")}
                  className={`form-control form-control-lg ${
                    touched.email && !emailValid ? "is-invalid" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((c) => ({ ...c, email: e.target.value }))
                  }
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, email: true }))
                  }
                  aria-invalid={touched.email && !emailValid}
                  required
                />
                {touched.email && !emailValid && (
                  <div className="invalid-feedback d-block">
                    {t("register_error_email")}
                  </div>
                )}
              </div>

              {/* ============ PASSWORD ============ */}
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold mb-0"
                  >
                    {t("password")}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="small text-decoration-none"
                  >
                    {t("login_forgot_password")}
                  </Link>
                </div>

                {/* ✅ input-group بدل position-relative + absolute */}
                <div className="input-group input-group-lg">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={t("login_password_placeholder")}
                    className="form-control"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((c) => ({ ...c, password: e.target.value }))
                    }
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword
                        ? t("register_password_hide")
                        : t("register_password_show")
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* ============ SUBMIT ============ */}
              <div className="mt-4 d-grid gap-3">
                <button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                  disabled={!canSubmit}
                >
                  {saving && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {saving ? t("saving") : t("login_button")}
                </button>

                <div className="d-flex align-items-center gap-3 text-secondary small">
                  <hr className="flex-grow-1 m-0" />
                  <span>{t("register_or_divider")}</span>
                  <hr className="flex-grow-1 m-0" />
                </div>

                <div className="text-center text-secondary">
                  {t("no_account")}{" "}
                  <Link
                    to="/users/new"
                    className="fw-semibold text-decoration-none"
                  >
                    {t("create_account_link")}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}