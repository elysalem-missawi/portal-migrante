import { useI18n } from "../../i18n";
import { fundingApplications } from "../../services/office.service";
import { OfficeCard, OfficePageHeader, StatusBadge, officeText } from "../../components/office/OfficeUi";

export default function OfficeFunding() {
  const { locale } = useI18n();

  return (
    <section>
      <OfficePageHeader
        eyebrow={officeText(locale, "Sostenibilidad", "الاستدامة")}
        title={officeText(locale, "Financiación y subvenciones", "التمويل والمنح")}
        description={officeText(
          locale,
          "Control inicial de solicitudes, programas, importes y fechas límite importantes.",
          "متابعة أولية للطلبات والبرامج والمبالغ والمواعيد النهائية المهمة."
        )}
      />

      <div className="grid gap-4">
        {fundingApplications.map((funding) => (
          <OfficeCard key={funding.id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h3 className="m-0 text-2xl font-black">{funding.title}</h3>
                <p className="m-0 mt-2 text-base font-semibold text-slate-500">{funding.program}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={funding.status === "approved" ? "green" : "orange"}>{funding.status}</StatusBadge>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                  {funding.deadline}
                </span>
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-emerald-700">
              {funding.amount.toLocaleString("es-ES")} €
            </p>
          </OfficeCard>
        ))}
      </div>
    </section>
  );
}
