import { useI18n } from "../../i18n";
import { OfficeCard, OfficePageHeader, officeText } from "../../components/office/OfficeUi";

export default function OfficePlaceholder({
  titleEs,
  titleAr,
}: {
  titleEs: string;
  titleAr: string;
}) {
  const { locale } = useI18n();

  return (
    <section>
      <OfficePageHeader
        eyebrow={officeText(locale, "Módulo previsto", "وحدة مبرمجة")}
        title={officeText(locale, titleEs, titleAr)}
        description={officeText(
          locale,
          "Esta sección está preparada en la navegación y se desarrollará después de cerrar el primer MVP.",
          "هذه الصفحة جاهزة داخل التنقل وسيتم تطويرها بعد تثبيت النسخة الأولى."
        )}
      />
      <OfficeCard>
        <p className="m-0 text-xl font-bold leading-relaxed text-slate-700">
          {officeText(
            locale,
            "La estructura ya permite añadir permisos, datos reales y formularios específicos para este módulo.",
            "البنية الحالية تسمح لاحقا بإضافة الصلاحيات والبيانات الحقيقية والاستمارات الخاصة بهذه الوحدة."
          )}
        </p>
      </OfficeCard>
    </section>
  );
}
