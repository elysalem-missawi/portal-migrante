import { useI18n } from "../../i18n";
import { officeDocuments } from "../../services/office.service";
import { OfficeCard, OfficePageHeader, StatusBadge, officeText } from "../../components/office/OfficeUi";

export default function OfficeDocuments() {
  const { locale } = useI18n();

  return (
    <section>
      <OfficePageHeader
        eyebrow={officeText(locale, "Archivo interno", "الأرشيف الداخلي")}
        title={officeText(locale, "Documentos", "الوثائق")}
        description={officeText(
          locale,
          "Primer espacio para ordenar propuestas, actas, presupuestos y documentos de trabajo.",
          "فضاء أولي لترتيب المقترحات والمحاضر والميزانيات ووثائق العمل."
        )}
        action={
          <button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800">
            {officeText(locale, "Subir documento", "رفع وثيقة")}
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {officeDocuments.map((document) => (
          <OfficeCard key={document.id}>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              □
            </div>
            <h3 className="m-0 text-xl font-black">{document.title}</h3>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              {document.category} · {document.owner}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge tone="slate">{document.access}</StatusBadge>
              <StatusBadge tone="green">{document.updatedAt}</StatusBadge>
            </div>
          </OfficeCard>
        ))}
      </div>
    </section>
  );
}
