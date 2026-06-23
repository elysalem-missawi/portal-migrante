import { useI18n } from "../../i18n";
import { officeMeetings } from "../../services/office.service";
import { OfficeCard, OfficePageHeader, StatusBadge, officeText } from "../../components/office/OfficeUi";

export default function OfficeMeetings() {
  const { locale } = useI18n();

  return (
    <section>
      <OfficePageHeader
        eyebrow={officeText(locale, "Coordinación", "التنسيق")}
        title={officeText(locale, "Reuniones y actas", "الاجتماعات والمحاضر")}
        description={officeText(
          locale,
          "Agenda inicial para organizar reuniones, preparar puntos del día y hacer seguimiento de las actas.",
          "أجندة أولية لتنظيم الاجتماعات وتحضير جدول الأعمال وتتبع المحاضر."
        )}
        action={
          <button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800">
            {officeText(locale, "Nueva reunión", "اجتماع جديد")}
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {officeMeetings.map((meeting) => (
          <OfficeCard key={meeting.id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="m-0 text-2xl font-black">{meeting.title}</h3>
                <p className="mt-3 text-base font-semibold text-slate-600">
                  {meeting.date} · {meeting.time}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-500">
                  {officeText(locale, "Lugar", "المكان")}: {meeting.place}
                </p>
              </div>
              <StatusBadge tone="blue">
                {meeting.status === "draft_minutes"
                  ? officeText(locale, "Acta pendiente", "محضر قيد الإعداد")
                  : officeText(locale, "Programada", "مبرمجة")}
              </StatusBadge>
            </div>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-semibold leading-relaxed text-slate-600">
              {officeText(
                locale,
                "Siguiente mejora: registrar asistentes, acuerdos, responsables y documentos vinculados.",
                "التحسين القادم: تسجيل الحاضرين والقرارات والمسؤولين والوثائق المرتبطة."
              )}
            </div>
          </OfficeCard>
        ))}
      </div>
    </section>
  );
}
