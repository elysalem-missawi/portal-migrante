import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../i18n";
import { useAuth } from "../auth";

export default function Header() {
  const { t, locale } = useI18n();

  const {
    currentUser,
    status: authStatus,
    signOut,
    refreshSession,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /* =========================================================
     Scroll
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     Close menus when language changes
  ========================================================= */

  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [locale]);

  /* =========================================================
     Navigation
  ========================================================= */

  const navItems = [
    {
      to: "/",
      label: t("nav_home"),
    },
    {
      to: "/servicios",
      label: t("nav_services"),
    },
    {
      to: "/organizations",
      label: t("nav_entities"),
    },
    {
      to: "/sobre",
      label: t("nav_about"),
    },
    {
      to: "/foro",
      label: t("nav_forum"),
    },
  ];

  /* =========================================================
     Create account label
  ========================================================= */

  const createAccountLabel =
    locale === "es"
      ? "Crear cuenta"
      : locale === "eu"
        ? "Kontua sortu"
        : locale === "en"
          ? "Create account"
          : "إنشاء حساب";

  /* =========================================================
     User roles
  ========================================================= */

  const userRole = currentUser?.role;
  const platformRole = currentUser?.platformRole;

  const isAdmin =
    platformRole === "admin" ||
    platformRole === "super_admin" ||
    userRole === "admin" ||
    userRole === "super_admin";

  const isModerator =
    isAdmin || platformRole === "moderator";

  /* =========================================================
     User information
  ========================================================= */

  const displayName =
    currentUser?.fullName ||
    currentUser?.displayName ||
    currentUser?.email ||
    "";

  const avatarLetter = (
    displayName || "U"
  )
    .charAt(0)
    .toUpperCase();

  /* =========================================================
     Close menus
  ========================================================= */

  const closeMenus = () => {
    setOpen(false);
    setUserMenuOpen(false);
  };

  /* =========================================================
     Logout
  ========================================================= */

  const handleLogout = async () => {
    try {
      await signOut();
      await refreshSession();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      closeMenus();
    }
  };

  return (
    <header
      className={`
        sticky top-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-b border-slate-100 bg-white"
        }
      `}
    >
      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <nav
        className="
          mx-auto
          flex
          h-[72px]
          max-w-7xl
          min-w-0
          items-center
          justify-between
          gap-3
          px-4
          sm:px-6
          lg:gap-5
          lg:px-8
        "
      >
        {/* ===================================================
            LOGO
        =================================================== */}

        <Link
          to="/"
          onClick={closeMenus}
          className="
            flex
            min-w-0
            shrink-0
            items-center
            gap-2.5
            rounded-xl
            outline-none
            transition
            focus-visible:ring-2
            focus-visible:ring-emerald-500
            focus-visible:ring-offset-2
          "
        >
          {/* Logo icon */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-emerald-500
              to-emerald-700
              text-white
              shadow-sm
              shadow-emerald-200
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s7-4.4 7-10.2V5.6L12 3 5 5.6v5.2C5 16.6 12 21 12 21Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.2 11 14l4-4"
              />
            </svg>
          </div>

          {/* Brand */}

          <div className="hidden min-w-0 leading-tight sm:block">
            <div
              className="
                whitespace-nowrap
                text-[14px]
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              {t("portal_brand")}
            </div>

            <div
              className="
                mt-0.5
                whitespace-nowrap
                text-[10px]
                font-medium
                text-slate-500
              "
            >
              {t("portal_region")}
            </div>
          </div>
        </Link>

        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <div
          className="
            hidden
            min-w-0
            flex-1
            items-center
            justify-center
            xl:flex
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1
              rounded-2xl
              bg-slate-50/80
              p-1
            "
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `
                    whitespace-nowrap
                    rounded-xl
                    px-3
                    py-2
                    text-[13px]
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:bg-white/70 hover:text-emerald-700"
                    }
                  `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ===================================================
            DESKTOP ACTIONS
        =================================================== */}

        <div
          className="
            hidden
            shrink-0
            items-center
            gap-2
            xl:flex
          "
        >
          {/* Language */}

          <LanguageSwitcher />

          {/* =================================================
              LOGGED USER
          ================================================= */}

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setUserMenuOpen((value) => !value)
                }
                aria-expanded={userMenuOpen}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-2
                  py-1.5
                  text-sm
                  font-medium
                  text-slate-700
                  shadow-sm
                  transition
                  hover:border-emerald-200
                  hover:bg-emerald-50
                  hover:text-emerald-700
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-500
                "
              >
                {/* Avatar */}

                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-100
                    text-sm
                    font-semibold
                    text-emerald-700
                  "
                >
                  {avatarLetter}
                </span>

                {/* Name */}

                <span
                  className="
                    hidden
                    max-w-[120px]
                    truncate
                    2xl:block
                  "
                >
                  {displayName}
                </span>

                {/* Arrow */}

                <svg
                  viewBox="0 0 20 20"
                  className={`
                    h-4
                    w-4
                    transition-transform
                    ${
                      userMenuOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 7 5 5 5-5"
                  />
                </svg>
              </button>

              {/* =================================================
                  USER DROPDOWN
              ================================================= */}

              {userMenuOpen && (
                <div
                  className="
                    absolute
                    end-0
                    top-[calc(100%+10px)]
                    z-50
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-2
                    shadow-xl
                    shadow-slate-200/50
                  "
                >
                  {/* User information */}

                  <div
                    className="
                      mb-1
                      rounded-xl
                      bg-slate-50
                      px-3
                      py-3
                    "
                  >
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-900
                      "
                    >
                      {currentUser.fullName ||
                        currentUser.displayName ||
                        t("profile")}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        text-slate-500
                      "
                    >
                      {currentUser.email}
                    </p>
                  </div>

                  {/* Profile */}

                  <Link
                    to="/perfil"
                    onClick={closeMenus}
                    className="
                      flex
                      items-center
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      hover:text-emerald-700
                    "
                  >
                    {t("profile")}
                  </Link>

                  {/* Moderation */}

                  {isModerator && (
                    <Link
                      to="/moderacion"
                      onClick={closeMenus}
                      className="
                        flex
                        items-center
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        hover:text-emerald-700
                      "
                    >
                      {t("moderation")}
                    </Link>
                  )}

                  {/* Administration */}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenus}
                      className="
                        flex
                        items-center
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        hover:text-emerald-700
                      "
                    >
                      {t("administration")}
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={authStatus === "checking"}
                    className="
                      flex
                      w-full
                      items-center
                      rounded-xl
                      px-3
                      py-2.5
                      text-start
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Login */}

              <Link
                to="/login"
                className="
                  whitespace-nowrap
                  rounded-xl
                  px-3
                  py-2.5
                  text-[13px]
                  font-medium
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  hover:text-emerald-700
                "
              >
                {t("login")}
              </Link>

              {/* Create account */}

              <Link
                to="/users/new"
                className="
                  whitespace-nowrap
                  rounded-xl
                  bg-emerald-600
                  px-4
                  py-2.5
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-sm
                  shadow-emerald-200
                  transition
                  hover:bg-emerald-700
                  hover:shadow-md
                "
              >
                {createAccountLabel}
              </Link>
            </>
          )}
        </div>

        {/* ===================================================
            MOBILE / TABLET ACTIONS
        =================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            xl:hidden
          "
        >
          {/* Language */}

          <LanguageSwitcher />

          {/* Menu button */}

          <button
            type="button"
            onClick={() => {
              setOpen((value) => !value);
              setUserMenuOpen(false);
            }}
            aria-label={
              open
                ? t("close_menu")
                : t("open_menu")
            }
            aria-expanded={open}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-700
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
            "
          >
            {open ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  d="M6 6 18 18"
                />

                <path
                  strokeLinecap="round"
                  d="M18 6 6 18"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  d="M4 7h16"
                />

                <path
                  strokeLinecap="round"
                  d="M4 12h16"
                />

                <path
                  strokeLinecap="round"
                  d="M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* =====================================================
          MOBILE / TABLET DROPDOWN
      ===================================================== */}

      <div
        className={`
          overflow-hidden
          border-t
          border-slate-100
          bg-white
          shadow-lg
          shadow-slate-200/30
          transition-all
          duration-300
          xl:hidden
          ${
            open
              ? "max-h-[calc(100vh-4.5rem)] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            mx-auto
            max-w-7xl
            overflow-y-auto
            px-4
            py-4
            sm:px-6
            lg:px-8
          "
        >
          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="grid gap-1 sm:grid-cols-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={closeMenus}
                className={({ isActive }) =>
                  `
                    flex
                    min-h-11
                    items-center
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition
                    ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                    }
                  `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Separator */}

          <div className="my-4 border-t border-slate-100" />

          {/* =================================================
              LOGGED USER
          ================================================= */}

          {currentUser ? (
            <div className="space-y-1">
              {/* User card */}

              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-slate-50
                  p-3
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-100
                    text-base
                    font-semibold
                    text-emerald-700
                  "
                >
                  {avatarLetter}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    {currentUser.fullName ||
                      currentUser.displayName ||
                      t("profile")}
                  </p>

                  <p
                    className="
                      truncate
                      text-xs
                      text-slate-500
                    "
                  >
                    {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Profile */}

              <Link
                to="/perfil"
                onClick={closeMenus}
                className="
                  flex
                  min-h-11
                  items-center
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  hover:text-emerald-700
                "
              >
                {t("profile")}
              </Link>

              {/* Moderation */}

              {isModerator && (
                <Link
                  to="/moderacion"
                  onClick={closeMenus}
                  className="
                    flex
                    min-h-11
                    items-center
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    hover:text-emerald-700
                  "
                >
                  {t("moderation")}
                </Link>
              )}

              {/* Administration */}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMenus}
                  className="
                    flex
                    min-h-11
                    items-center
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    hover:text-emerald-700
                  "
                >
                  {t("administration")}
                </Link>
              )}

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                disabled={authStatus === "checking"}
                className="
                  flex
                  min-h-11
                  w-full
                  items-center
                  rounded-xl
                  px-3
                  py-2.5
                  text-start
                  text-sm
                  font-medium
                  text-red-600
                  transition
                  hover:bg-red-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            /* =================================================
               GUEST
            ================================================= */

            <div
              className="
                grid
                gap-2
                sm:grid-cols-2
              "
            >
              {/* Login */}

              <Link
                to="/login"
                onClick={closeMenus}
                className="
                  flex
                  min-h-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:border-emerald-200
                  hover:bg-emerald-50
                  hover:text-emerald-700
                "
              >
                {t("login")}
              </Link>

              {/* Create account */}

              <Link
                to="/users/new"
                onClick={closeMenus}
                className="
                  flex
                  min-h-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  shadow-emerald-200
                  transition
                  hover:bg-emerald-700
                  hover:shadow-md
                "
              >
                {createAccountLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}