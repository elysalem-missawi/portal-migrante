import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../i18n";
import { useAuth } from "../auth";

export default function Header() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const {
    currentUser,
    status: authStatus,
    signOut,
    refreshSession,
  } = useAuth();

  const navItems = [
    { to: "/", label: t("nav_home") },
    { to: "/servicios", label: t("nav_services") },
    { to: "/organizations", label: t("nav_entities") },
    { to: "/sobre", label: t("nav_about") },
    { to: "/foro", label: t("nav_forum") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = async () => {
    await signOut();
    setUserMenuOpen(false);
    setOpen(false);
  };

  const userName =
    currentUser?.displayName ||
    currentUser?.fullName ||
    "";

  const currentPlatformRole =
    currentUser?.platformRole ||
    (currentUser?.role === "super_admin"
      ? "super_admin"
      : currentUser?.role === "admin"
        ? "admin"
        : "user");

  const canModerate = ["moderator", "admin", "super_admin"].includes(
    currentPlatformRole
  );

  const moderationLabel =
    (
      {
        es: "Revisión de contenidos",
        ar: "مراجعة المحتوى",
        en: "Content review",
        eu: "Edukien berrikuspena",
      } as Record<string, string>
    )[locale] || "Revisión de contenidos";

  const accountLabels =
    (
      {
        es: {
          organizations: "Mis organizaciones",
          announcements: "Anuncios",
        },
        ar: {
          organizations: "منظماتي",
          announcements: "الإعلانات",
        },
        en: {
          organizations: "My organizations",
          announcements: "Announcements",
        },
        eu: {
          organizations: "Nire erakundeak",
          announcements: "Iragarkiak",
        },
      } as Record<
        string,
        {
          organizations: string;
          announcements: string;
        }
      >
    )[locale] || {
      organizations: "Mis organizaciones",
      announcements: "Anuncios",
    };

  const closeMenus = () => {
    setUserMenuOpen(false);
    setOpen(false);
  };

  const userSummary = currentUser && (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-xl">
      <div className="font-semibold text-slate-900">
        {t("welcome_user")}, {userName}
      </div>

      <div className="mt-2 space-y-1 text-slate-500">
        <div>{currentUser.email}</div>

        {currentUser.phone && <div>{currentUser.phone}</div>}
        {currentUser.originCountry && <div>{currentUser.originCountry}</div>}
        {currentUser.nativeLanguage && <div>{currentUser.nativeLanguage}</div>}
      </div>

      {(currentUser.phoneVerified || currentUser.isVerified) && (
        <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {t("phone_verified_short")}
        </div>
      )}

      <div className="mt-4 grid gap-2">
        <Link
          to="/organizations"
          onClick={closeMenus}
          className="block w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center font-semibold text-emerald-800 transition hover:border-emerald-400"
        >
          {accountLabels.organizations}
        </Link>

        <Link
          to="/anuncios"
          onClick={closeMenus}
          className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
        >
          {accountLabels.announcements}
        </Link>
      </div>

      {canModerate && (
        <Link
          to="/admin/moderation"
          onClick={closeMenus}
          className="mt-3 block w-full rounded-xl bg-emerald-600 px-3 py-2 text-center font-semibold text-white transition hover:bg-emerald-700"
        >
          {moderationLabel}
        </Link>
      )}

      <button
        type="button"
        onClick={logout}
        className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
      >
        {t("logout")}
      </button>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
          : "border-b border-slate-100 bg-white"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-blue-700 shadow-sm">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div className="hidden leading-tight sm:block">
            <div className="whitespace-nowrap text-[15px] font-semibold text-slate-900">
              {t("portal_brand")}
            </div>

            <div className="mt-0.5 whitespace-nowrap text-[11px] font-medium text-slate-500">
              {t("portal_region")}
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguageSwitcher />

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-emerald-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
                  {(userName || "?").slice(0, 1).toUpperCase()}
                </span>

                <span className="max-w-32 truncate">{userName}</span>

                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-slate-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute end-0 mt-2 w-72">
                  {userSummary}
                </div>
              )}
            </div>
          ) : authStatus === "checking" ? (
            <span className="text-xs font-semibold text-slate-500">
              {t("session_checking")}
            </span>
          ) : authStatus === "unavailable" ? (
            <button
              type="button"
              onClick={() => void refreshSession()}
              className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900"
            >
              {t("retry")}
            </button>
          ) : (
            <>
              <Link
                to="/users/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
              >
                {t("login_button")}
              </Link>

              <Link
                to="/users/new"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {t("create_account_link")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((value) => !value)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
              open
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            <div className="relative h-5 w-5">
              <span
                className={`absolute left-0 top-1 h-0.5 w-5 rounded bg-current transition ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 rounded bg-current transition ${
                  open ? "opacity-0" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-4 h-0.5 w-5 rounded bg-current transition ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 lg:hidden ${
          open
            ? "max-h-[calc(100vh-4.5rem)] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-semibold transition ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              {currentUser ? (
                userSummary
              ) : authStatus === "checking" ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-sm font-semibold text-slate-500">
                  {t("session_checking")}
                </div>
              ) : authStatus === "unavailable" ? (
                <button
                  type="button"
                  onClick={() => void refreshSession()}
                  className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-900"
                >
                  {t("session_unavailable")} · {t("retry")}
                </button>
              ) : (
                <div className="grid gap-2">
                  <Link
                    to="/users/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700"
                  >
                    {t("login_button")}
                  </Link>

                  <Link
                    to="/users/new"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
                  >
                    {t("create_account_link")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
