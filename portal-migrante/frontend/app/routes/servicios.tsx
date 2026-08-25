import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n";

type ServiceCategory = {
  id: string;
  title: string;
  icon: string;
  path?: string;
  description: string;
  available: boolean;
};

export default function Servicios() {
  const { t, locale } = useI18n();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("c");

  const serviceDescriptions: Record<string, Record<string, string>> = {
    es: {
      salud: "Centros de salud, hospitales, tarjeta sanitaria y urgencias.",
      vivienda: "Alquiler público, ayudas, portales privados y consejos para evitar riesgos.",
      empleo: "Lanbide, orientación laboral, formación y pasos para buscar trabajo.",
      educacion: "EPA, idiomas, formación, homologación y universidades.",
      legal: "Residencia, extranjería, derechos básicos y asesoramiento jurídico.",
      ayuntamientos: "Padrón, servicios sociales municipales y orientación cercana.",
      asociaciones: "Entidades sociales que ofrecen apoyo, acompañamiento y derivación.",
    },
    ar: {
      salud: "المراكز الصحية، المستشفيات، البطاقة الصحية والطوارئ.",
      vivienda: "الإيجار العمومي، المساعدات، مواقع البحث ونصائح لتجنب المخاطر.",
      empleo: "Lanbide، التوجيه المهني، التكوين وخطوات البحث عن العمل.",
      educacion: "تعليم الكبار، اللغات، التكوين، معادلة الشهادات والجامعات.",
      legal: "الإقامة، شؤون الأجانب، الحقوق الأساسية والاستشارة القانونية.",
      ayuntamientos: "التسجيل البلدي، الخدمات الاجتماعية البلدية والتوجيه القريب.",
      asociaciones: "جمعيات تقدم الدعم والمرافقة والإحالة إلى الموارد المناسبة.",
    },
    en: {
      salud: "Health centres, hospitals, health card, and emergencies.",
      vivienda: "Public rent, support, private portals, and advice to avoid risks.",
      empleo: "Lanbide, job guidance, training, and steps to look for work.",
      educacion: "Adult education, languages, training, recognition, and universities.",
      legal: "Residence, immigration, basic rights, and legal guidance.",
      ayuntamientos: "Municipal registration, local social services, and nearby guidance.",
      asociaciones: "Social organizations offering support, accompaniment, and referrals.",
    },
    eu: {
      salud: "Osasun zentroak, ospitaleak, osasun txartela eta larrialdiak.",
      vivienda: "Alokairu publikoa, laguntzak, atari pribatuak eta arriskuak saihesteko aholkuak.",
      empleo: "Lanbide, lan orientazioa, prestakuntza eta lana bilatzeko urratsak.",
      educacion: "Helduen hezkuntza, hizkuntzak, prestakuntza, homologazioa eta unibertsitateak.",
      legal: "Egoitza, atzerritartasuna, oinarrizko eskubideak eta aholkularitza juridikoa.",
      ayuntamientos: "Errolda, udal gizarte zerbitzuak eta gertuko orientazioa.",
      asociaciones: "Laguntza, lagun egitea eta bideratzea eskaintzen duten elkarteak.",
    },
  };

  const descriptions = serviceDescriptions[locale] || serviceDescriptions.es;

  const categories: ServiceCategory[] = [
    {
      id: "salud",
      title: t("f_health"),
      icon: "\uD83D\uDC97",
      path: "/servicios/salud",
      description: descriptions.salud,
      available: true,
    },
    {
      id: "vivienda",
      title: t("f_housing"),
      icon: "\uD83C\uDFE0",
      path: "/servicios/vivienda",
      description: descriptions.vivienda,
      available: true,
    },
    {
      id: "empleo",
      title: t("f_work"),
      icon: "\uD83D\uDCBC",
      path: "/servicios/empleo",
      description: descriptions.empleo,
      available: true,
    },
    {
      id: "educacion",
      title: t("f_education"),
      icon: "\uD83C\uDF93",
      path: "/servicios/educacion",
      description: descriptions.educacion,
      available: true,
    },
    {
      id: "legal",
      title: t("f_legal"),
      icon: "\u2696\uFE0F",
      path: "/servicios/legal",
      description: descriptions.legal,
      available: true,
    },
    {
      id: "ayuntamientos",
      title: t("f_municipalities"),
      icon: "\uD83C\uDFDB\uFE0F",
      path: "/ayuntamientos",
      description: descriptions.ayuntamientos,
      available: true,
    },
    {
      id: "asociaciones",
      title: t("f_charities"),
      icon: "\uD83E\uDD1D",
      path: "/servicios/asociaciones",
      description: descriptions.asociaciones,
      available: true,
    },
  ];

  const visibleCategories = selectedCategory
    ? categories.filter((category) => category.id === selectedCategory)
    : categories;

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-wide text-emerald-700">
              {t("cta_services")}
            </p>
            <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              {t("services_title_1")} {t("services_title_2")}
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600">
              {t("services_intro")}
            </p>
          </div>

           
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">

        {selectedCategory && visibleCategories.length === 0 && (
          <div className="alert alert-warning" role="alert">
            {t("services_unknown_category")}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visibleCategories.map((category) => {
            const card = (
              <article className="h-full min-h-[220px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-200 group-hover:border-emerald-300 group-hover:shadow-md">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-3xl">
                  <span aria-hidden="true">{category.icon}</span>
                </div>

                <h2 className="text-2xl font-black text-slate-950 mb-4">
                  {category.title}
                </h2>

                <p className="text-base text-slate-600 mb-7 leading-relaxed">
                  {category.description}
                </p>

                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <span className="text-base font-black text-emerald-700">
                    {t("explore_services")}
                  </span>
                  <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                    {t("available").toLowerCase()}
                  </span>
                </div>
              </article>
            );

            return (
              <div key={category.id}>
                {category.available && category.path ? (
                  <Link to={category.path} className="group block h-full no-underline">
                    {card}
                  </Link>
                ) : (
                  <div className="h-full opacity-75">{card}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
