import { useI18n } from "../../i18n";
import { officeProjects } from "../../services/office.service";
import { OfficeCard, OfficePageHeader, ProgressBar, StatusBadge, officeText } from "../../components/office/OfficeUi";

export default function OfficeProjects() {
  const { locale } = useI18n();

  return (
    <section>
      <OfficePageHeader
        eyebrow={officeText(locale, "Planificación", "التخطيط")}
        title={officeText(locale, "Proyectos de la asociación", "مشاريع الجمعية")}
        description={officeText(
          locale,
          "Seguimiento visual de proyectos, responsables, avances y relación con solicitudes de financiación.",
          "متابعة بصرية للمشاريع والمسؤولين ونسبة التقدم وعلاقتها بطلبات التمويل."
        )}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {officeProjects.map((project) => (
          <OfficeCard key={project.id}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="m-0 text-2xl font-black text-slate-950">{project.name}</h3>
                <p className="mt-2 text-sm font-bold text-slate-500">
                  {officeText(locale, "Responsable", "المسؤول")}: {project.owner}
                </p>
              </div>
              <StatusBadge tone={project.status === "waiting" ? "orange" : "green"}>{project.status}</StatusBadge>
            </div>
            <ProgressBar value={project.progress} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="m-0 text-sm font-bold text-slate-500">{officeText(locale, "Progreso", "التقدم")}</p>
                <p className="m-0 mt-1 text-2xl font-black">{project.progress}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="m-0 text-sm font-bold text-slate-500">{officeText(locale, "Actualizado", "آخر تحديث")}</p>
                <p className="m-0 mt-1 text-lg font-black">{project.updatedAt}</p>
              </div>
            </div>
            {project.funder && <p className="mt-4 text-sm font-semibold text-emerald-700">{project.funder}</p>}
          </OfficeCard>
        ))}
      </div>
    </section>
  );
}
