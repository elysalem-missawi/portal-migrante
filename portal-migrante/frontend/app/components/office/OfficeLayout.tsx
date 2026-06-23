import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import type { OfficePermission } from "../../services/office.service";
import type { User } from "../../services/users.service";
import { usersService } from "../../services/users.service";
import { getOfficePermissions, getOfficeRole } from "../../routes/guards/ProtectedOfficeRoute";

type OfficeMenuItem = {
  to: string;
  es: string;
  ar: string;
  icon: string;
  permission: OfficePermission;
};

const menuItems: OfficeMenuItem[] = [
  { to: "/office/dashboard", es: "Panel", ar: "لوحة التحكم", icon: "▦", permission: "view_dashboard" },
  { to: "/office/tasks", es: "Tareas", ar: "المهام", icon: "✓", permission: "view_tasks" },
  { to: "/office/meetings", es: "Reuniones", ar: "الاجتماعات", icon: "◷", permission: "view_meetings" },
  { to: "/office/projects", es: "Proyectos", ar: "المشاريع", icon: "◇", permission: "view_projects" },
  { to: "/office/funding", es: "Financiación", ar: "التمويل", icon: "€", permission: "manage_funding" },
  { to: "/office/documents", es: "Documentos", ar: "الوثائق", icon: "□", permission: "view_documents" },
  { to: "/office/members", es: "Miembros", ar: "الأعضاء", icon: "◎", permission: "view_members" },
  { to: "/office/volunteers", es: "Voluntariado", ar: "المتطوعون", icon: "+", permission: "manage_volunteers" },
  { to: "/office/finance", es: "Finanzas", ar: "المالية", icon: "₿", permission: "view_finance" },
  { to: "/office/contacts", es: "Contactos", ar: "الاتصالات", icon: "@", permission: "manage_contacts" },
  { to: "/office/activities", es: "Actividades", ar: "الأنشطة", icon: "✦", permission: "publish_activities" },
  { to: "/office/reports", es: "Informes", ar: "التقارير", icon: "∑", permission: "view_reports" },
  { to: "/office/settings", es: "Ajustes", ar: "الإعدادات", icon: "⚙", permission: "manage_settings" },
];

function officeText(locale: string, es: string, ar: string) {
  return locale === "ar" ? ar : es;
}

function OfficeBrand() {
  return (
    <Link to="/office/dashboard" className="flex items-center gap-3 text-slate-950 no-underline">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#009739,#07120d)] text-xl font-black text-white shadow-lg shadow-emerald-900/20">
        Z
      </span>
      <span>
        <span className="block text-xl font-black leading-none">Oficina Zubia</span>
        <span className="block text-sm font-semibold text-slate-500">Social Euskadi</span>
      </span>
    </Link>
  );
}

export default function OfficeLayout() {
  const { locale, locales, setLocale } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isRtl = locale === "ar";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => usersService.getCurrentUser());

  useEffect(() => {
    return usersService.onCurrentUserChange(() => setCurrentUser(usersService.getCurrentUser()));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const permissions = useMemo(() => getOfficePermissions(currentUser), [currentUser]);
  const visibleItems = menuItems.filter((item) => permissions.includes(item.permission));
  const activeItem = menuItems.find((item) => location.pathname.startsWith(item.to));
  const userRole = currentUser ? getOfficeRole(currentUser) : "visitor";

  const logout = () => {
    usersService.logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
        <aside
          className={`hidden border-slate-200 bg-white shadow-sm lg:flex lg:flex-col ${
            isRtl ? "lg:order-2 lg:border-r" : "lg:order-1 lg:border-r"
          }`}
        >
          <div className="border-b border-slate-200 p-5">
            <OfficeBrand />
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black no-underline transition",
                    isActive
                      ? "bg-emerald-50 text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")
                }
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-base shadow-sm ring-1 ring-slate-200">
                  {item.icon}
                </span>
                <span>{officeText(locale, item.es, item.ar)}</span>
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-slate-200 p-4">
            <Link
              to="/"
              className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 no-underline transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {officeText(locale, "Volver al portal público", "العودة إلى البوابة العامة")}
            </Link>
          </div>
        </aside>

        <div className={`${isRtl ? "lg:order-1" : "lg:order-2"} min-w-0`}>
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-xl font-black text-slate-900 shadow-sm lg:hidden"
                  aria-label={officeText(locale, "Abrir menú", "فتح القائمة")}
                >
                  ☰
                </button>
                <div>
                  <p className="m-0 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                    {officeText(locale, "Espacio interno", "فضاء داخلي")}
                  </p>
                  <h1 className="m-0 text-xl font-black sm:text-2xl">
                    {officeText(locale, activeItem?.es ?? "Panel", activeItem?.ar ?? "لوحة التحكم")}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as typeof locale)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
                  aria-label={officeText(locale, "Idioma", "اللغة")}
                >
                  {locales.map((item) => (
                    <option key={item} value={item}>
                      {item.toUpperCase()}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="hidden h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 sm:inline-flex sm:items-center"
                >
                  {officeText(locale, "Notificaciones", "الإشعارات")}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="h-11 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-red-700"
                >
                  {officeText(locale, "Salir", "خروج")}
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 text-sm font-bold text-slate-500">
                  {officeText(locale, "Usuario conectado", "المستخدم المتصل")}
                </p>
                <p className="m-0 text-lg font-black">
                  {currentUser?.displayName || currentUser?.fullName || currentUser?.email}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">
                  {userRole}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-black text-slate-700">
                  {visibleItems.length} {officeText(locale, "módulos", "وحدات")}
                </span>
              </div>
            </div>
            <Outlet />
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/55 lg:hidden">
          <div
            className={`absolute top-0 h-full w-[86vw] max-w-sm overflow-y-auto bg-white shadow-2xl ${
              isRtl ? "right-0" : "left-0"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <OfficeBrand />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-700 text-2xl font-black text-white"
                aria-label={officeText(locale, "Cerrar menú", "إغلاق القائمة")}
              >
                ×
              </button>
            </div>
            <nav className="space-y-2 p-4">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-4 py-4 text-base font-black no-underline transition",
                      isActive ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-700",
                    ].join(" ")
                  }
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/90 text-slate-900">
                    {item.icon}
                  </span>
                  <span>{officeText(locale, item.es, item.ar)}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
