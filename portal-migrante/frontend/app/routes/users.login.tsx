import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useI18n } from "../i18n";
import { usersService } from "../services/users.service";

export default function LoginUserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (usersService.getCurrentUser()) {
      setSuccess(t("login_success"));
    }
  }, [t]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await usersService.login({
        email: formData.email.trim(),
        password: formData.password,
      });
      setSuccess(t("login_success"));
      const from = (location.state as { from?: string } | null)?.from || "/foro";
      setTimeout(() => navigate(from), 700);
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
        background:
          "radial-gradient(circle at 15% 20%, rgba(34,197,94,0.12), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #eef6f1 100%)",
      }}
    >
      <div className="container py-lg-4">
        <div className="row g-4 align-items-stretch justify-content-center">
          <aside className="col-12 col-lg-5">
            <div
              className="h-100 overflow-hidden rounded-3 border shadow-sm text-white"
              style={{
                minHeight: 480,
                backgroundImage:
                  "linear-gradient(180deg, rgba(2,44,23,0.18), rgba(2,44,23,0.9)), url('/images/registration-migrant-travel-hero.png')",
                backgroundPosition: "center top",
                backgroundSize: "cover",
              }}
            >
              <div className="d-flex h-100 flex-column justify-content-end p-4 p-lg-5">
                <span className="mb-3 d-inline-flex align-items-center gap-2 rounded-pill bg-white bg-opacity-25 px-3 py-2 text-sm fw-semibold">
                  {t("nav_forum")}
                </span>
                <h1 className="display-6 fw-bold mb-3">{t("login_title")}</h1>
                <p className="lead mb-0 text-white-50">{t("login_subtitle")}</p>
              </div>
            </div>
          </aside>

          <div className="col-12 col-lg-6">
            <form
              onSubmit={submit}
              className="h-100 rounded-3 border bg-white p-4 p-lg-5 shadow-sm"
            >
              <h2 className="h3 fw-bold mb-2">{t("login_title")}</h2>
              <p className="text-secondary mb-4">{t("login_subtitle")}</p>

              <div className="mb-3">
                <label className="form-label fw-semibold">{t("email")}</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">{t("password")}</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="d-grid gap-3">
                <button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill fw-semibold"
                  disabled={saving || !formData.email.trim() || !formData.password}
                >
                  {saving ? t("saving") : t("login_button")}
                </button>
                <div className="text-center text-secondary">
                  {t("no_account")}{" "}
                  <Link to="/users/new" className="fw-semibold">
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
