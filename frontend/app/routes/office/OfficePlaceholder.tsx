import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { OfficeCard, officeText } from "../../components/office/OfficeUi";

export default function OfficePlaceholder({
  titleEs,
  titleAr,
}: {
  titleEs: string;
  titleAr: string;
}) {
  const { locale } = useI18n();

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <OfficeCard className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-700 p-8 text-white">
          <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">
            {officeText(locale, "Módulo preparado", "وحدة مبرمجة")}
          </p>
          <h2 className="m-0 text-4xl font-black leading-tight">{officeText(locale, titleEs, titleAr)}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            {officeText(
              locale,
              "Esta sección ya forma parte del espacio interno y se desarrollará con datos reales, permisos y formularios propios.",
              "هذه الصفحة أصبحت جزءا من الفضاء الداخلي، وسيتم تطويرها لاحقا بالبيانات الحقيقية والصلاحيات والاستمارات الخاصة بها."
            )}
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          {[
            [officeText(locale, "Permisos", "الصلاحيات"), officeText(locale, "Acceso controlado por rol.", "دخول مضبوط حسب الدور.")],
            [officeText(locale, "Datos", "البيانات"), officeText(locale, "Lista para conectar al backend.", "جاهزة للربط بالباكند.")],
            [officeText(locale, "Formularios", "الاستمارات"), officeText(locale, "Se añadirán en la siguiente fase.", "ستضاف في المرحلة القادمة.")],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl bg-slate-50 p-5">
              <p className="m-0 text-lg font-black text-[#14213d]">{title}</p>
              <p className="m-0 mt-2 text-sm font-semibold leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </OfficeCard>

      <OfficeCard>
        <h3 className="m-0 text-2xl font-black text-[#14213d]">
          {officeText(locale, "Siguiente paso", "الخطوة التالية")}
        </h3>
        <p className="mt-4 text-lg font-semibold leading-relaxed text-slate-600">
          {officeText(
            locale,
            "Para completar este módulo necesitamos definir los campos, las acciones permitidas y el flujo de revisión.",
            "لإكمال هذه الوحدة نحتاج إلى تحديد الحقول، والأفعال المسموح بها، ومسار المراجعة."
          )}
        </p>
        <Link
          to="/office/dashboard"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white no-underline transition hover:bg-blue-700"
        >
          {officeText(locale, "Volver al panel", "العودة إلى لوحة القيادة")}
        </Link>
      </OfficeCard>
    </section>
  );
}
