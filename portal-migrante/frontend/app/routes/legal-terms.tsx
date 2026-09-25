import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

type LegalSection = {
  number: string;
  title: string;
  body: string;
  items?: string[];
};

export default function LegalTermsPage() {
  const { t } = useI18n();

  const sections: LegalSection[] = [
    {
      number: "01",
      title: t("legal_section_controller_title"),
      body: t("legal_section_controller_body"),
    },
    {
      number: "02",
      title: t("legal_section_data_title"),
      body: t("legal_section_data_body"),
      items: [
        t("legal_data_required"),
        t("legal_data_optional"),
        t("legal_data_automatic"),
      ],
    },
    {
      number: "03",
      title: t("legal_section_purpose_title"),
      body: t("legal_section_purpose_body"),
      items: [
        t("legal_purpose_account"),
        t("legal_purpose_community"),
        t("legal_purpose_security"),
      ],
    },
    {
      number: "04",
      title: t("legal_section_orgs_title"),
      body: t("legal_section_orgs_body"),
    },
    {
      number: "05",
      title: t("legal_section_rights_title"),
      body: t("legal_section_rights_body"),
    },
    {
      number: "06",
      title: t("legal_section_rules_title"),
      body: t("legal_section_rules_body"),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link
            to="/users/new"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
          >
            <span aria-hidden="true">←</span>
            {t("legal_terms_back")}
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t("portal_brand")}
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {t("legal_terms_title")}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              {t("legal_terms_subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 lg:sticky lg:top-24">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              {t("legal_summary_title")}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {t("legal_terms_intro")}
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
                <p className="text-xs font-black text-slate-900">
                  {t("legal_required_label")}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {t("legal_required_summary")}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
                <p className="text-xs font-black text-slate-900">
                  {t("legal_optional_label")}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {t("legal_optional_summary")}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              {t("legal_non_official_note")}
            </p>
          </aside>

          <div className="space-y-5">
            {sections.map((section) => (
              <article
                key={section.number}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-black tracking-[0.18em] text-emerald-600">
                    {section.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-black text-slate-950">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {section.body}
                    </p>

                    {section.items && (
                      <ul className="mt-4 space-y-2">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-7 text-slate-700"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}

            <div className="rounded-3xl border border-slate-900 bg-slate-950 p-6 text-white sm:p-7">
              <h2 className="text-xl font-black">{t("legal_contact_title")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                {t("legal_contact_body")}
              </p>
              <Link
                to="/contacto"
                className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400"
              >
                {t("legal_contact_cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
