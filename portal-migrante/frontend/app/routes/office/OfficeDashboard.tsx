import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import {
  fundingApplications,
  officeMeetings,
  officeProjects,
  officeStats,
  officeTasks,
} from "../../services/office.service";
import { OfficeCard, OfficePageHeader, ProgressBar, StatusBadge, officeText } from "../../components/office/OfficeUi";

const statTone: Record<string, string> = {
  red: "border-red-100 bg-red-50 text-red-800",
  green: "border-emerald-100 bg-emerald-50 text-emerald-800",
  blue: "border-blue-100 bg-blue-50 text-blue-800",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-800",
  orange: "border-orange-100 bg-orange-50 text-orange-800",
  slate: "border-slate-200 bg-slate-100 text-slate-800",
};

function statusLabel(locale: string, status: string) {
  const labels: Record<string, [string, string]> = {
    todo: ["Pendiente", "قيد الانتظار"],
    doing: ["En curso", "قيد الإنجاز"],
    done: ["Completada", "مكتملة"],
    late: ["Atrasada", "متأخرة"],
    scheduled: ["Programada", "مبرمجة"],
    draft_minutes: ["Acta pendiente", "محضر قيد الإعداد"],
    approved: ["Aprobada", "مصادق عليه"],
    study: ["En estudio", "قيد الدراسة"],
    active: ["Activo", "نشط"],
    waiting: ["En espera", "في الانتظار"],
    completed: ["Finalizado", "منته"],
    review: ["En revisión", "قيد المراجعة"],
    submitted: ["Presentada", "مقدمة"],
  };
  const label = labels[status] ?? [status, status];
  return officeText(locale, label[0], label[1]);
}

export default function OfficeDashboard() {
  const { locale } = useI18n();

  return (
    <section>
      <OfficePageHeader
        eyebrow={officeText(locale, "Oficina Zubia", "مكتب زوبيا")}
        title={officeText(locale, "Resumen de trabajo", "ملخص العمل الداخلي")}
        description={officeText(
          locale,
          "Una vista rápida de tareas, reuniones, proyectos y financiación para coordinar mejor la asociación.",
          "نظرة سريعة على المهام والاجتماعات والمشاريع والتمويل من أجل تنسيق عمل الجمعية بوضوح."
        )}
        action={
          <Link
            to="/office/tasks"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white no-underline shadow-sm transition hover:bg-emerald-800"
          >
            {officeText(locale, "Crear tarea", "إضافة مهمة")}
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {officeStats.map((stat) => (
          <OfficeCard key={stat.key}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="m-0 text-sm font-bold text-slate-500">
                  {locale === "ar" ? stat.labelAr : stat.labelEs}
                </p>
                <p className="m-0 mt-3 text-4xl font-black text-slate-950">{stat.value}</p>
              </div>
              <span className={`rounded-2xl border px-3 py-2 text-sm font-black ${statTone[stat.tone]}`}>
                {stat.key}
              </span>
            </div>
          </OfficeCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <OfficeCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="m-0 text-2xl font-black">
              {officeText(locale, "Tareas prioritarias", "المهام ذات الأولوية")}
            </h3>
            <Link to="/office/tasks" className="text-sm font-black text-emerald-700 no-underline hover:underline">
              {officeText(locale, "Ver todas", "عرض الكل")}
            </Link>
          </div>
          <div className="space-y-3">
            {officeTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="m-0 text-lg font-black text-slate-950">{task.title}</p>
                    <p className="m-0 mt-1 text-sm font-semibold text-slate-500">
                      {task.owner} · {task.dueDate}
                    </p>
                  </div>
                  <StatusBadge tone={task.status === "late" ? "red" : task.status === "done" ? "green" : "blue"}>
                    {statusLabel(locale, task.status)}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </OfficeCard>

        <OfficeCard>
          <h3 className="m-0 text-2xl font-black">{officeText(locale, "Próximas reuniones", "الاجتماعات القادمة")}</h3>
          <div className="mt-4 space-y-3">
            {officeMeetings.map((meeting) => (
              <div key={meeting.id} className="rounded-xl border border-slate-100 p-4">
                <p className="m-0 text-lg font-black">{meeting.title}</p>
                <p className="m-0 mt-2 text-sm font-semibold text-slate-500">
                  {meeting.date} · {meeting.time} · {meeting.place}
                </p>
                <div className="mt-3">
                  <StatusBadge tone="blue">{statusLabel(locale, meeting.status)}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </OfficeCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <OfficeCard>
          <h3 className="m-0 text-2xl font-black">{officeText(locale, "Proyectos activos", "المشاريع النشطة")}</h3>
          <div className="mt-4 space-y-4">
            {officeProjects.map((project) => (
              <div key={project.id} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="m-0 text-lg font-black">{project.name}</p>
                  <StatusBadge tone="green">{statusLabel(locale, project.status)}</StatusBadge>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-500">{project.owner}</p>
                <ProgressBar value={project.progress} />
              </div>
            ))}
          </div>
        </OfficeCard>

        <OfficeCard>
          <h3 className="m-0 text-2xl font-black">{officeText(locale, "Financiación y documentos", "التمويل والوثائق")}</h3>
          <div className="mt-4 space-y-3">
            {fundingApplications.map((funding) => (
              <div key={funding.id} className="rounded-xl border border-slate-100 p-4">
                <p className="m-0 text-lg font-black">{funding.title}</p>
                <p className="m-0 mt-1 text-sm font-semibold text-slate-500">
                  {funding.program} · {funding.amount.toLocaleString("es-ES")} €
                </p>
                <div className="mt-3">
                  <StatusBadge tone="orange">{statusLabel(locale, funding.status)}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </OfficeCard>
      </div>
    </section>
  );
}
