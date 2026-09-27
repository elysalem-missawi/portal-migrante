import { NavLink } from "react-router-dom";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";

type Locale = "es" | "ar" | "eu" | "en";

const labels: Record<Locale, { account: string; community: string; signedIn: string }> = {
  es: { account: "Mi cuenta", community: "Comunidad", signedIn: "Tu espacio" },
  ar: { account: "حسابي", community: "المجتمع", signedIn: "مساحتك" },
  eu: { account: "Nire kontua", community: "Komunitatea", signedIn: "Zure espazioa" },
  en: { account: "My account", community: "Community", signedIn: "Your space" },
};

export default function CommunityAccountNav() {
  const { currentUser } = useAuth();
  const { locale } = useI18n();
  const c = labels[(locale as Locale) in labels ? (locale as Locale) : "es"];
  const name =
    currentUser?.displayName || currentUser?.fullName || currentUser?.email || "";
  const initial = (name || "U").charAt(0).toUpperCase();

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3 px-2 py-1">
        {currentUser?.profileImage ? (
          <img
            src={currentUser.profileImage}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-emerald-50"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
            {initial}
          </div>
        )}
        <div className="min-w-0">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">
            {c.signedIn}
          </p>
          <p className="m-0 mt-0.5 truncate text-sm font-bold text-slate-800">
            {name}
          </p>
        </div>
      </div>

      <nav className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 sm:w-auto">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `rounded-lg px-4 py-2.5 text-center text-sm font-bold no-underline transition ${
              isActive
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
            }`
          }
        >
          {c.account}
        </NavLink>
        <NavLink
          to="/foro"
          className={({ isActive }) =>
            `rounded-lg px-4 py-2.5 text-center text-sm font-bold no-underline transition ${
              isActive
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
            }`
          }
        >
          {c.community}
        </NavLink>
      </nav>
    </div>
  );
}
