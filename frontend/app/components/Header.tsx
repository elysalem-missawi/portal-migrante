import { NavLink, Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "../i18n";
import { useState, useEffect } from "react";
import { usersService, type User } from "../services/users.service";

export default function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    usersService.getCurrentUser()
  );

  const navItems = [
    { 
      to: "/", 
      label: t("nav_home"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      to: "/servicios", 
      label: t("nav_services"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      to: "/foro",
      label: t("nav_forum"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5M5 19l-2 2V5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5z" />
        </svg>
      )
    },
    {
      to: "/cultura-vasca",
      label: t("nav_basque_culture"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c4-4 7-7.5 7-11a7 7 0 10-14 0c0 3.5 3 7 7 11z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6M12 7v6" />
        </svg>
      )
    },
    { 
      to: "/sobre", 
      label: t("nav_about"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      to: "/contacto", 
      label: t("nav_contact"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return usersService.onCurrentUserChange(() => {
      setCurrentUser(usersService.getCurrentUser());
      setUserMenuOpen(false);
    });
  }, []);

  const logout = () => {
    usersService.logout();
    setCurrentUser(null);
    setUserMenuOpen(false);
    setOpen(false);
  };

  const userName = currentUser?.displayName || currentUser?.fullName || "";

  const userSummary = currentUser && (
    <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm shadow-lg">
      <div className="font-semibold text-vitoria-black">
        {t("welcome_user")}، {userName}
      </div>
      <div className="mt-2 space-y-1 text-vitoria-gray">
        <div>{currentUser.email}</div>
        {currentUser.phone && <div>{currentUser.phone}</div>}
        {currentUser.originCountry && <div>{currentUser.originCountry}</div>}
        {currentUser.nativeLanguage && <div>{currentUser.nativeLanguage}</div>}
      </div>
      {(currentUser.phoneVerified || currentUser.isVerified) && (
        <div className="mt-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {t("phone_verified_short")}
        </div>
      )}
      <button
        type="button"
        className="mt-3 w-full rounded-xl border border-gray-300 px-3 py-2 font-semibold text-vitoria-black transition hover:border-vitoria-green hover:text-vitoria-green"
        onClick={logout}
      >
        {t("logout")}
      </button>
    </div>
  );

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-white border-b border-gray-200'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            {/* Modern Logo Design */}
            <div className="relative">
              <div className="w-12 h-12 bg-vitoria-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-accent rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl text-vitoria-black group-hover:text-vitoria-green transition-colors duration-300">
                {t("portal_brand")}
              </div>
              <div className="text-xs text-vitoria-gray font-medium tracking-wide">
                {t("portal_region")}
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive 
                    ? "text-vitoria-green bg-vitoria-green/10 shadow-sm" 
                    : "text-vitoria-gray hover:text-vitoria-green hover:bg-vitoria-green/5"
                }`
              }
            >
              <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </span>
              {item.label}
              {/* Active indicator */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-vitoria-green rounded-full transition-all duration-300 group-data-[active]:w-8"></div>
            </NavLink>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-vitoria-black shadow-sm transition hover:border-vitoria-green"
                onClick={() => setUserMenuOpen((value) => !value)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-vitoria-green text-white">
                  {(userName || "?").slice(0, 1).toUpperCase()}
                </span>
                <span className="text-start">
                  <span className="block text-xs text-vitoria-gray">
                    {t("welcome_user")}
                  </span>
                  <span className="block max-w-36 truncate">{userName}</span>
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute end-0 mt-2 w-72">{userSummary}</div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/users/login"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-vitoria-black shadow-sm transition hover:border-vitoria-green hover:text-vitoria-green"
              >
                {t("login_button")}
              </Link>
              <Link 
                to="/users/new" 
                className="group relative inline-flex items-center gap-2 bg-vitoria-gradient text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t("users_new")}
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile actions */}
        <div className="lg:hidden flex items-center gap-3">
          <LanguageSwitcher />

          <button
            className={`relative p-2 rounded-xl transition-all duration-300 ${
              open 
                ? "bg-vitoria-green text-white shadow-lg" 
                : "bg-gray-100 text-vitoria-gray hover:bg-vitoria-green/10 hover:text-vitoria-green"
            }`}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`bg-current transition-all duration-300 ease-out h-0.5 w-6 rounded-full ${
                open ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
              }`}></span>
              <span className={`bg-current transition-all duration-300 ease-out h-0.5 w-6 rounded-full ${
                open ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`bg-current transition-all duration-300 ease-out h-0.5 w-6 rounded-full ${
                open ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
              }`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden border-t border-gray-200 bg-white shadow-xl transition-all duration-300 ease-in-out ${
          open ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="mb-5 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-vitoria-gradient text-white shadow-sm">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-black text-vitoria-black">{t("portal_brand")}</div>
                  <div className="text-xs font-bold text-vitoria-gray">{t("portal_region")}</div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-black text-vitoria-green shadow-sm"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="grid gap-2">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-lg border px-4 py-4 text-base font-black transition-all duration-200 ${
                      isActive 
                        ? "border-emerald-200 bg-emerald-50 text-vitoria-green shadow-sm" 
                        : "border-gray-200 bg-white text-vitoria-gray hover:border-emerald-200 hover:bg-emerald-50 hover:text-vitoria-green"
                    }`
                  }
                  onClick={() => setOpen(false)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: open ? 'slideInFromRight 0.3s ease-out forwards' : 'none'
                  }}
                >
                  <span>{item.label}</span>
                  <span className="text-vitoria-gray transition-colors group-hover:text-vitoria-green">
                    {item.icon}
                  </span>
                </NavLink>
              ))}
              
              <div className="mt-3 border-t border-gray-200 pt-4">
                {currentUser ? (
                  <div>{userSummary}</div>
                ) : (
                  <div className="grid gap-2">
                    <Link
                      to="/users/login"
                      className="flex items-center justify-center rounded-xl border border-gray-300 bg-white !px-4 !py-2 font-semibold text-vitoria-black shadow-sm transition hover:border-vitoria-green hover:text-vitoria-green"
                      onClick={() => setOpen(false)}
                    >
                      {t("login_button")}
                    </Link>
                    <Link
                      to="/users/new"
                      className="group flex items-center justify-center gap-2 bg-vitoria-gradient text-white !px-4 !py-2 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => setOpen(false)}
                    >
                      <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {t("users_new")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
