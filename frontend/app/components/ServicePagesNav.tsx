import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

type ServiceNavId =
  | "salud"
  | "vivienda"
  | "empleo"
  | "educacion"
  | "legal"
  | "ayuntamientos"
  | "asociaciones";

const serviceNavItems: {
  id: ServiceNavId;
  to: string;
  icon: string;
  labelKey: string;
}[] = [
  { id: "salud", to: "/servicios/salud", icon: "💗", labelKey: "f_health" },
  { id: "vivienda", to: "/servicios/vivienda", icon: "🏠", labelKey: "f_housing" },
  { id: "empleo", to: "/servicios/empleo", icon: "💼", labelKey: "f_work" },
  { id: "educacion", to: "/servicios/educacion", icon: "🎓", labelKey: "f_education" },
  { id: "legal", to: "/servicios/legal", icon: "⚖️", labelKey: "f_legal" },
  { id: "ayuntamientos", to: "/ayuntamientos", icon: "🏛️", labelKey: "f_municipalities" },
  { id: "asociaciones", to: "/servicios/asociaciones", icon: "🤝", labelKey: "f_charities" },
];

export default function ServicePagesNav({ activeId }: { activeId?: ServiceNavId }) {
  const { t } = useI18n();

  return (
    <nav
      className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
      aria-label={t("nav_services")}
    >
      <div className="flex min-w-max gap-3">
        {serviceNavItems.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className={`group flex items-center gap-3 rounded-lg border px-5 py-3 text-sm font-black no-underline shadow-sm transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
              item.id === activeId
                ? "border-emerald-700 bg-emerald-700 text-white shadow-md"
                : "border-slate-200 bg-slate-50 text-slate-800 hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-md active:translate-y-0 active:bg-emerald-800"
            }`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-lg text-lg transition ${
                item.id === activeId
                  ? "bg-white/20"
                  : "bg-white text-slate-700 group-hover:bg-white/20 group-hover:text-white"
              }`}
            >
              {item.icon}
            </span>
            <span>{t(item.labelKey)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
