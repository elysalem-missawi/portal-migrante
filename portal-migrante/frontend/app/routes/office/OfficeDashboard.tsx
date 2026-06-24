import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useI18n } from "../../i18n";
import {
  fundingApplications,
  officeMeetings,
  officeProjects,
  officeTasks,
} from "../../services/office.service";
import { OfficeCard, ProgressBar, StatusBadge, officeText } from "../../components/office/OfficeUi";

type MiniIcon = "folder" | "check" | "calendar" | "users" | "team" | "clock" | "heart" | "chart";

function MiniIconBox({ name, tone }: { name: MiniIcon; tone: string }) {
  const colors: Record<string, string> = {
    violet: "bg-violet-50 text-violet-700",
    green: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
    pink: "bg-pink-50 text-pink-700",
  };

  const icons: Record<MiniIcon, ReactNode> = {
    folder: (
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <path d="M17 11a3 3 0 1 0 0-6" />
        <path d="M20 20a5 5 0 0 0-4-5" />
      </>
    ),
    team: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M3 20a5 5 0 0 1 10 0" />
        <path d="M11 20a5 5 0 0 1 10 0" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-4" />
        <path d="M12 16V8" />
        <path d="M16 16v-6" />
      </>
    ),
  };

  return (
    <span className={`grid h-14 w-14 place-items-center rounded-2xl ${colors[tone] ?? colors.blue}`}>
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {icons[name]}
      </svg>
    </span>
  );
}

function taskPriority(locale: string, priority: string) {
  if (priority === "high") return officeText(locale, "Alta", "عالية");
  if (priority === "low") return officeText(locale, "Baja", "منخفضة");
  return officeText(locale, "Media", "متوسطة");
}

export default function OfficeDashboard() {
  const { locale } = useI18n();

  const stats = [
    {
      label: officeText(locale, "Tareas atrasadas", "المهام المتأخرة"),
      value: "3",
      note: officeText(locale, "tareas", "مهام"),
      icon: "folder" as MiniIcon,
      tone: "violet",
      accent: "text-red-600",
    },
    {
      label: officeText(locale, "Tareas completadas", "المهام المكتملة"),
      value: "18",
      note: officeText(locale, "este mes", "هذا الشهر"),
      icon: "check" as MiniIcon,
      tone: "green",
      accent: "text-emerald-600",
    },
    {
      label: officeText(locale, "Próximas reuniones", "الاجتماعات القادمة"),
      value: "2",
      note: officeText(locale, "esta semana", "هذا الأسبوع"),
      icon: "calendar" as MiniIcon,
      tone: "orange",
      accent: "text-orange-600",
    },
    {
      label: officeText(locale, "Voluntariado activo", "المتطوعون النشطون"),
      value: "24",
      note: officeText(locale, "voluntarios", "متطوع"),
      icon: "users" as MiniIcon,
      tone: "blue",
      accent: "text-blue-600",
    },
    {
      label: officeText(locale, "Miembros", "الأعضاء"),
      value: "56",
      note: officeText(locale, "miembros", "عضو"),
      icon: "team" as MiniIcon,
      tone: "pink",
      accent: "text-pink-600",
    },
  ];

  const requests = [
    { title: "Zubia Social plataforma", subtitle: "Solicitud de financiación digital", status: "En estudio", progress: 66 },
    { title: "Local compartido", subtitle: "Solicitud de espacio compartido", status: "En espera", progress: 30 },
    { title: "Programa convivencia 2026", subtitle: "Actividades de convivencia", status: "Preparando", progress: 20 },
    { title: "Formación voluntariado", subtitle: "Programa de formación", status: "No presentado", progress: 0 },
  ];

  const activities = [
    ["20/06/2026", officeText(locale, "Taller de orientación administrativa", "ورشة التوجيه الإداري"), "bg-emerald-500"],
    ["18/06/2026", officeText(locale, "Encuentro de comunidades africanas", "لقاء الجاليات الإفريقية"), "bg-blue-500"],
    ["15/06/2026", officeText(locale, "Taller de derechos y servicios", "ورشة الحقوق والخدمات"), "bg-violet-500"],
    ["10/06/2026", officeText(locale, "Jornada abierta de voluntariado", "يوم مفتوح للتطوع"), "bg-orange-500"],
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/office/tasks"
          className="inline-flex w-fit items-center gap-3 rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white no-underline shadow-sm shadow-blue-900/20 transition hover:bg-blue-700"
        >
          <span>+</span>
          <span>{officeText(locale, "Nueva tarea", "مهمة جديدة")}</span>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <OfficeCard key={stat.label} className="min-h-[150px]">
            <div className="flex items-center justify-between gap-4">
              <MiniIconBox name={stat.icon} tone={stat.tone} />
              <div className="text-end">
                <p className="m-0 text-sm font-black text-slate-700">{stat.label}</p>
                <p className="m-0 mt-3 text-3xl font-black text-[#14213d]">{stat.value}</p>
                <p className={`m-0 mt-1 text-xs font-black ${stat.accent}`}>{stat.note}</p>
              </div>
            </div>
          </OfficeCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <OfficeCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-2xl font-black text-[#14213d]">{officeText(locale, "Últimas tareas", "آخر المهام")}</h2>
            <Link to="/office/tasks" className="text-sm font-black text-blue-700 no-underline hover:underline">
              {officeText(locale, "Ver todas", "عرض الكل")}
            </Link>
          </div>
          <div className="space-y-3">
            {officeTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-xl font-black text-slate-400">⋮</span>
                <StatusBadge tone={task.priority === "high" ? "red" : task.priority === "low" ? "green" : "orange"}>
                  {taskPriority(locale, task.priority)}
                </StatusBadge>
                <div className="min-w-0 flex-1 text-end">
                  <p className="m-0 truncate text-sm font-black text-[#14213d]">{task.title}</p>
                  <p className="m-0 mt-1 text-xs font-semibold text-slate-500">{task.owner}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/office/tasks" className="mt-5 inline-flex text-sm font-black text-blue-700 no-underline hover:underline">
            {officeText(locale, "Ver todas las tareas", "عرض كل المهام")}
          </Link>
        </OfficeCard>

        <OfficeCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-2xl font-black text-[#14213d]">
              {officeText(locale, "Estado de solicitudes", "حالة الطلبات والتمويلات")}
            </h2>
            <Link to="/office/funding" className="text-sm font-black text-blue-700 no-underline hover:underline">
              {officeText(locale, "Ver todo", "عرض الكل")}
            </Link>
          </div>
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.title} className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <StatusBadge tone={request.progress > 50 ? "orange" : "blue"}>{request.status}</StatusBadge>
                  <div className="text-end">
                    <p className="m-0 text-sm font-black text-[#14213d]">{request.title}</p>
                    <p className="m-0 text-xs font-semibold text-slate-500">{request.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 text-xs font-black text-slate-700">{request.progress}%</span>
                  <ProgressBar value={request.progress} />
                </div>
              </div>
            ))}
          </div>
          <Link to="/office/funding" className="mt-5 inline-flex text-sm font-black text-blue-700 no-underline hover:underline">
            {officeText(locale, "Ver todas las solicitudes", "عرض كل الطلبات")}
          </Link>
        </OfficeCard>

        <OfficeCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-2xl font-black text-[#14213d]">
              {officeText(locale, "Próximas reuniones", "الاجتماعات القادمة")}
            </h2>
            <Link to="/office/meetings" className="text-sm font-black text-blue-700 no-underline hover:underline">
              {officeText(locale, "Ver todo", "عرض الكل")}
            </Link>
          </div>
          <div className="space-y-4">
            {officeMeetings.map((meeting, index) => (
              <div key={meeting.id} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-slate-50 text-center">
                  <span className="block text-2xl font-black text-[#14213d]">{index === 0 ? "28" : "12"}</span>
                  <span className="block text-xs font-bold text-slate-500">{index === 0 ? "Junio" : "Julio"}</span>
                </div>
                <div className="min-w-0 flex-1 text-end">
                  <StatusBadge tone={index === 0 ? "green" : "blue"}>
                    {index === 0 ? officeText(locale, "Confirmada", "مؤكد") : officeText(locale, "Programada", "مقرر")}
                  </StatusBadge>
                  <p className="m-0 mt-2 text-sm font-black text-[#14213d]">{meeting.title}</p>
                  <p className="m-0 mt-1 text-xs font-semibold text-slate-500">
                    {meeting.time} · {meeting.place}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/office/meetings"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-black text-blue-700 no-underline transition hover:border-blue-300 hover:bg-blue-50"
          >
            {officeText(locale, "Calendario de reuniones", "تقويم الاجتماعات")}
          </Link>
        </OfficeCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <OfficeCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-xl font-black text-[#14213d]">
              {officeText(locale, "Resumen financiero", "ملخص مالي")}
            </h2>
            <Link to="/office/funding" className="text-sm font-black text-blue-700 no-underline hover:underline">
              {officeText(locale, "Detalles", "عرض التفاصيل")}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="m-0 text-sm font-semibold text-slate-500">{officeText(locale, "Saldo actual", "الرصيد الحالي")}</p>
              <p className="m-0 text-3xl font-black text-[#14213d]">4,215 €</p>
              <p className="m-0 mt-4 text-sm font-semibold text-slate-500">{officeText(locale, "Ingresos", "إجمالي المداخيل")}</p>
              <p className="m-0 text-lg font-black text-emerald-600">12,450 €</p>
              <p className="m-0 mt-3 text-sm font-semibold text-slate-500">{officeText(locale, "Gastos", "إجمالي المصاريف")}</p>
              <p className="m-0 text-lg font-black text-red-600">8,235 €</p>
            </div>
            <div className="flex items-end gap-2 rounded-xl bg-gradient-to-t from-emerald-50 to-white p-3">
              {[35, 50, 46, 60, 55, 74, 65, 88].map((height, index) => (
                <span key={index} className="flex-1 rounded-t bg-emerald-500/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </OfficeCard>

        <OfficeCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-xl font-black text-[#14213d]">
              {officeText(locale, "Últimas actividades", "الأنشطة الأخيرة")}
            </h2>
            <Link to="/office/activities" className="text-sm font-black text-blue-700 no-underline hover:underline">
              {officeText(locale, "Ver todo", "عرض الكل")}
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.map(([date, title, dot]) => (
              <div key={date} className="flex items-center justify-between gap-4 py-3">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                <p className="m-0 flex-1 text-end text-sm font-black text-[#14213d]">{title}</p>
                <span className="text-sm font-semibold text-slate-500">{date}</span>
              </div>
            ))}
          </div>
        </OfficeCard>

        <OfficeCard>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-xl font-black text-[#14213d]">
              {officeText(locale, "Indicadores rápidos", "إحصائيات سريعة")}
            </h2>
            <span className="text-sm font-black text-blue-700">{officeText(locale, "Este mes", "هذا الشهر")}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              [officeText(locale, "Beneficiarios", "عدد المستفيدين"), "156", "team", "green"],
              [officeText(locale, "Actividades", "عدد الأنشطة"), "8", "calendar", "violet"],
              [officeText(locale, "Horas voluntariado", "ساعات التطوع"), "324", "clock", "blue"],
              [officeText(locale, "Nuevas alianzas", "الشراكات الجديدة"), "3", "heart", "orange"],
            ].map(([label, value, icon, tone]) => (
              <div key={label} className="rounded-xl border border-slate-200 p-4">
                <MiniIconBox name={icon as MiniIcon} tone={tone} />
                <p className="m-0 mt-3 text-sm font-semibold text-slate-500">{label}</p>
                <p className="m-0 text-2xl font-black text-[#14213d]">{value}</p>
              </div>
            ))}
          </div>
        </OfficeCard>
      </div>

      <div className="flex flex-col gap-3 pt-2 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Zubia Social Euskadi</span>
        <span>AS/A/26945/2026</span>
      </div>
    </section>
  );
}
