import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import type { OfficePermission } from "../../services/office.service";
import type { User } from "../../services/users.service";
import { usersService } from "../../services/users.service";
import { getOfficePermissions, getOfficeRole } from "../../routes/guards/ProtectedOfficeRoute";
import { officeText } from "./OfficeUi";

type OfficeMenuItem = {
  to: string;
  es: string;
  ar: string;
  icon: IconName;
  permission: OfficePermission;
};

type IconName =
  | "dashboard"
  | "calendar"
  | "tasks"
  | "chart"
  | "euro"
  | "users"
  | "folder"
  | "mail"
  | "star"
  | "pie"
  | "settings"
  | "logout"
  | "home"
  | "bell"
  | "globe"
  | "grid"
  | "menu"
  | "close";

const menuItems: OfficeMenuItem[] = [
  { to: "/office/dashboard", es: "Panel de mando", ar: "لوحة القيادة", icon: "home", permission: "view_dashboard" },
  { to: "/office/meetings", es: "Reuniones y actas", ar: "الاجتماعات والمحاضر", icon: "calendar", permission: "view_meetings" },
  { to: "/office/tasks", es: "Tareas", ar: "المهام", icon: "tasks", permission: "view_tasks" },
  { to: "/office/projects", es: "Proyectos y financiación", ar: "المشاريع والتمويلات", icon: "chart", permission: "view_projects" },
  { to: "/office/funding", es: "Cuentas y finanzas", ar: "الحسابات والمالية", icon: "euro", permission: "manage_funding" },
  { to: "/office/volunteers", es: "Miembros y voluntariado", ar: "الأعضاء والمتطوعون", icon: "users", permission: "view_members" },
  { to: "/office/documents", es: "Documentos y archivos", ar: "الوثائق والملفات", icon: "folder", permission: "view_documents" },
  { to: "/office/contacts", es: "Mensajes y contactos", ar: "المراسلات والجهات", icon: "mail", permission: "manage_contacts" },
  { to: "/office/activities", es: "Actividades y programas", ar: "الأنشطة والبرامج", icon: "star", permission: "publish_activities" },
  { to: "/office/reports", es: "Informes y estadísticas", ar: "التقارير والإحصائيات", icon: "pie", permission: "view_reports" },
  { to: "/office/settings", es: "Configuración", ar: "الإعدادات", icon: "settings", permission: "manage_settings" },
];

const roleLabels: Record<string, { es: string; ar: string }> = {
  admin: { es: "Administrador", ar: "رئيس الجمعية" },
  super_admin: { es: "Super administrador", ar: "مدير عام" },
  partner_manager: { es: "Entidad colaboradora", ar: "مسؤول جهة" },
  user: { es: "Usuario", ar: "مستخدم" },
  visitor: { es: "Visitante", ar: "زائر" },
};

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  const paths: Record<IconName, ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    tasks: (
      <>
        <path d="M9 11l2 2 4-5" />
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
      </>
    ),
    euro: (
      <>
        <path d="M17 5a7 7 0 1 0 0 14" />
        <path d="M4 10h9M4 14h8" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <path d="M16 11a3 3 0 1 0 0-6" />
        <path d="M19 20a5 5 0 0 0-4-4.9" />
      </>
    ),
    folder: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
    star: (
      <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />
    ),
    pie: (
      <>
        <path d="M12 3v9h9" />
        <path d="M21 12a9 9 0 1 1-9-9" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 4v16" />
      </>
    ),
    home: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v11h14V10" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6L6 18" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function initials(user: User | null) {
  const text = user?.displayName || user?.fullName || user?.email || "Z";
  return text.trim().slice(0, 1).toUpperCase();
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
  const roleLabel = roleLabels[userRole] ?? roleLabels.user;

  const logout = () => {
    usersService.logout();
    navigate("/");
  };

  const sidebar = (
    <aside className="flex h-full flex-col bg-[#101d31] text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/30">
          <span className="grid h-7 w-7 place-items-center rounded-xl bg-white/20">
            <Icon name="dashboard" className="h-5 w-5" />
          </span>
        </div>
        <div>
          <p className="m-0 text-lg font-black">{officeText(locale, "Oficina interna", "المكتب الداخلي")}</p>
          <p className="m-0 text-xs font-semibold text-slate-300">
            {officeText(locale, "Gestión de la asociación", "الإدارة التنفيذية للجمعية")}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "group flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-bold no-underline transition",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            <span className="text-white/85">
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <span>{officeText(locale, item.es, item.ar)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          to="/"
          className="mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 no-underline transition hover:bg-white/10 hover:text-white"
        >
          <Icon name="home" />
          <span>{officeText(locale, "Portal público", "البوابة العامة")}</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-red-300/40 hover:bg-red-500/10 hover:text-white"
        >
          <Icon name="logout" />
          <span>{officeText(locale, "Cerrar sesión", "تسجيل الخروج")}</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#14213d]">
      <div className={`lg:flex lg:min-h-screen ${isRtl ? "lg:flex-row-reverse" : ""}`}>
        <div className="hidden lg:block lg:w-[310px] lg:shrink-0">{sidebar}</div>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-[88px] items-center justify-between gap-4 px-5 lg:px-8">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-900">
                  <span className="text-lg font-black">{initials(currentUser)}</span>
                </div>
                <div>
                  <p className="m-0 text-sm font-bold text-slate-500">
                    {officeText(locale, "Hola,", "مرحبا،")} {currentUser?.displayName || currentUser?.fullName || "Ahmed"}
                  </p>
                  <p className="m-0 text-xs font-semibold text-slate-500">
                    {officeText(locale, roleLabel.es, roleLabel.ar)}
                  </p>
                </div>
                <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700">
                  <Icon name="bell" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-[10px] font-black text-white">
                    5
                  </span>
                </button>
                <button className="hidden h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 sm:grid">
                  <Icon name="mail" />
                </button>
                <label className="hidden items-center gap-2 border-slate-200 px-4 sm:flex sm:border-l sm:border-r">
                  <Icon name="globe" className="h-5 w-5 text-slate-600" />
                  <select
                    value={locale}
                    onChange={(event) => setLocale(event.target.value as typeof locale)}
                    className="h-10 border-0 bg-transparent text-sm font-black text-slate-800 outline-none"
                  >
                    {locales.map((item) => (
                      <option key={item} value={item}>
                        {item.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden text-end md:block">
                  <p className="m-0 text-xl font-black tracking-wide text-[#14213d]">ZUBIA SOCIAL EUSKADI</p>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Asociacion sociocultural de apoyo a las personas migrantes
                  </p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#009739,#07120d)] text-xl font-black text-white shadow-lg shadow-emerald-900/20">
                  Z
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="grid h-12 w-12 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm lg:hidden"
                >
                  <Icon name="menu" />
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="m-0 text-3xl font-black leading-tight text-[#14213d] md:text-4xl">
                  {officeText(locale, activeItem?.es ?? "Panel de mando", activeItem?.ar ?? "لوحة القيادة")}
                </h1>
                <p className="m-0 mt-2 text-base font-semibold text-slate-500">
                  {officeText(locale, "Vista interna de trabajo y seguimiento", "نظرة داخلية على العمل والمتابعة")}
                </p>
              </div>
              <button className="grid h-14 w-14 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700">
                <Icon name="grid" className="h-7 w-7" />
              </button>
            </div>
            <Outlet />
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 lg:hidden">
          <div className={`absolute top-0 h-full w-[88vw] max-w-sm ${isRtl ? "right-0" : "left-0"}`}>
            <div className="h-full overflow-y-auto shadow-2xl">
              {sidebar}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 grid h-11 w-11 place-items-center rounded-xl bg-white text-slate-900 shadow-lg"
                style={isRtl ? { left: 16 } : { right: 16 }}
              >
                <Icon name="close" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
