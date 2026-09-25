import { Link, useLocation, useNavigate } from "react-router-dom";
import type { AccountType } from "../services/users.service";
import { useI18n } from "../i18n";

type RegistrationState = {
  email?: string;
  accountType?: AccountType;
};

export default function RegistrationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const state = (location.state as RegistrationState | null) ?? null;
  const email = state?.email?.trim() || "";
  const isOrganization = state?.accountType === "organization_account";
  const hasRegistrationState = Boolean(email || state?.accountType);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto flex max-w-xl items-center justify-center">
        <section
          className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 sm:p-10"
          aria-labelledby="registration-success-title"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-600">
            {t(hasRegistrationState ? "registration_success_label" : "registration_success_missing_label")}
          </p>
          <h1 id="registration-success-title" className="text-3xl font-bold tracking-tight text-slate-900">
            {t(hasRegistrationState ? "registration_success_title" : "registration_success_missing_title")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
            {hasRegistrationState
              ? isOrganization
                ? t("register_success_org_desc")
                : t("registration_success_description")
              : t("registration_success_missing_description")}
          </p>

          {email ? (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-start">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("email")}
              </p>
              <p className="mt-1 break-all font-semibold text-slate-900">{email}</p>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-start text-sm leading-6 text-amber-900" role="status">
              {t("registration_success_no_email")}
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/users/login", { state: email ? { email } : undefined })}
              className="rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              {t("registration_success_login")}
            </button>
            <Link
              to="/"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              {t("registration_success_home")}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
