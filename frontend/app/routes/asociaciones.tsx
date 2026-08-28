import { useI18n } from "../i18n";
import ServicePagesNav from "../components/ServicePagesNav";

type Locale = "eu" | "es" | "en" | "ar";

const organizations = [
  { name: "Zehar-Errefuxiatuekin", territory: "Euskadi", href: "https://zehar.eus/" },
  { name: "CEAR Euskadi", territory: "Bizkaia / Euskadi", href: "https://www.cear-euskadi.org/" },
  { name: "Harresiak Apurtuz", territory: "Euskadi", href: "https://www.harresiakapurtuz.org/" },
  { name: "SOS Racismo Gipuzkoa", territory: "Gipuzkoa", href: "https://sosracismogipuzkoa.org/" },
  { name: "SOS Racismo Bizkaia", territory: "Bizkaia", href: "https://sosracismobizkaia.org/" },
];

const content: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  helpTitle: string;
  beforeTitle: string;
  directoryTitle: string;
  directoryIntro: string;
  visit: string;
  orgFocus: string[];
  helpItems: string[];
  beforeItems: string[];
}> = {
  es: {
    eyebrow: "Servicios comunitarios",
    title: "Asociaciones y entidades de apoyo en Euskadi",
    intro: "Una primera guía para encontrar organizaciones que acompañan a personas migrantes, refugiadas o en situación de vulnerabilidad en el País Vasco.",
    helpTitle: "Qué tipo de ayuda puedes buscar",
    beforeTitle: "Antes de contactar",
    directoryTitle: "Entidades de referencia",
    directoryIntro: "Lista inicial para construir un directorio más completo por territorio.",
    visit: "Visitar sitio web",
    orgFocus: [
      "Acogida, atención jurídica, inclusión social y defensa de derechos.",
      "Asilo, refugio, acompañamiento jurídico y apoyo a personas migrantes.",
      "Coordinadora de entidades de apoyo a personas inmigrantes.",
      "Denuncia, sensibilización y apoyo frente al racismo y la xenofobia.",
      "Oficina de información y denuncia, educación antirracista y participación.",
    ],
    helpItems: ["Orientación jurídica y extranjería.", "Acogida, acompañamiento social y derivación.", "Apoyo frente a discriminación, racismo o exclusión.", "Voluntariado, participación comunitaria y redes locales."],
    beforeItems: ["Resume tu situación y el tipo de ayuda que necesitas.", "Prepara documentos básicos si buscas orientación legal.", "Pregunta si atienden con cita previa y en qué idiomas.", "Si es urgente, pide derivación a servicios sociales o emergencias."],
  },
  ar: {
    eyebrow: "خدمات مجتمعية",
    title: "الجمعيات وجهات الدعم في إقليم الباسك",
    intro: "دليل أولي للعثور على منظمات ترافق الأشخاص المهاجرين أو اللاجئين أو في وضع هش في إقليم الباسك.",
    helpTitle: "ما نوع المساعدة التي يمكنك البحث عنها",
    beforeTitle: "قبل التواصل",
    directoryTitle: "جهات مرجعية",
    directoryIntro: "قائمة أولية لبناء دليل أكثر اكتمالًا حسب الإقليم.",
    visit: "زيارة الموقع",
    orgFocus: ["استقبال، استشارة قانونية، إدماج اجتماعي ودفاع عن الحقوق.", "لجوء وحماية ومرافقة قانونية ودعم للمهاجرين.", "تنسيقية جهات دعم للأشخاص المهاجرين.", "تبليغ وتوعية ودعم ضد العنصرية وكراهية الأجانب.", "مكتب معلومات وتبليغ، تعليم ضد العنصرية ومشاركة."],
    helpItems: ["إرشاد قانوني وشؤون الأجانب.", "استقبال ومرافقة اجتماعية وإحالة.", "دعم ضد التمييز أو العنصرية أو الإقصاء.", "تطوع ومشاركة مجتمعية وشبكات محلية."],
    beforeItems: ["لخّص وضعك ونوع المساعدة التي تحتاجها.", "حضّر الوثائق الأساسية إذا كنت تبحث عن إرشاد قانوني.", "اسأل إن كانت الخدمة بموعد مسبق وبأي لغات.", "إذا كان الأمر عاجلًا اطلب إحالة إلى الخدمات الاجتماعية أو الطوارئ."],
  },
  en: {
    eyebrow: "Community services",
    title: "Associations and support organizations in Euskadi",
    intro: "A first guide to organizations that support migrants, refugees, and people in vulnerable situations in the Basque Country.",
    helpTitle: "What kind of help you can look for",
    beforeTitle: "Before contacting",
    directoryTitle: "Reference organizations",
    directoryIntro: "An initial list to build a fuller directory by territory.",
    visit: "Visit website",
    orgFocus: ["Reception, legal attention, social inclusion, and rights defense.", "Asylum, refuge, legal accompaniment, and migrant support.", "Network of organizations supporting immigrants.", "Reporting, awareness, and support against racism and xenophobia.", "Information and complaint office, anti-racist education, and participation."],
    helpItems: ["Legal and immigration guidance.", "Reception, social accompaniment, and referral.", "Support against discrimination, racism, or exclusion.", "Volunteering, community participation, and local networks."],
    beforeItems: ["Summarize your situation and the help you need.", "Prepare basic documents if you need legal guidance.", "Ask whether they work by appointment and in which languages.", "If urgent, ask for referral to social services or emergencies."],
  },
  eu: {
    eyebrow: "Komunitate zerbitzuak",
    title: "Euskadiko elkarteak eta laguntza erakundeak",
    intro: "Euskal Herrian migratzaileei, errefuxiatuei edo egoera zaurgarrian daudenei laguntzen dieten erakundeak aurkitzeko lehen gida.",
    helpTitle: "Zer laguntza bila dezakezu",
    beforeTitle: "Harremanetan jarri aurretik",
    directoryTitle: "Erreferentziazko erakundeak",
    directoryIntro: "Lurraldeka direktorio osoagoa eraikitzeko hasierako zerrenda.",
    visit: "Webgunea bisitatu",
    orgFocus: ["Harrera, arreta juridikoa, gizarte inklusioa eta eskubideen defentsa.", "Asiloa, babesa, laguntza juridikoa eta migratzaileentzako babesa.", "Etorkinei laguntzen dieten erakundeen koordinadora.", "Arrazakeriaren eta xenofobiaren aurkako salaketa, sentsibilizazioa eta laguntza.", "Informazio eta salaketa bulegoa, hezkuntza antirrazista eta parte hartzea."],
    helpItems: ["Aholkularitza juridikoa eta atzerritartasuna.", "Harrera, gizarte laguntza eta bideratzea.", "Diskriminazioaren, arrazakeriaren edo bazterketaren aurkako laguntza.", "Boluntariotza, komunitate parte hartzea eta tokiko sareak."],
    beforeItems: ["Laburtu zure egoera eta behar duzun laguntza mota.", "Prestatu oinarrizko dokumentuak aholkularitza juridikoa behar baduzu.", "Galdetu hitzorduarekin lan egiten duten eta zein hizkuntzatan.", "Premiazkoa bada, eskatu gizarte zerbitzuetara edo larrialdietara bideratzea."],
  },
};

export default function AsociacionesPage() {
  const { locale } = useI18n();
  const page = content[(locale as Locale) in content ? (locale as Locale) : "es"];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-xl shadow-sm">
                  🤝
                </span>
                {page.eyebrow}
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                {page.title}
              </h1>
              <p className="mt-5 max-w-3xl text-xl leading-relaxed text-slate-600">
                {page.intro}
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
              <img
                src="/images/registration-migrant-travel-hero.png"
                alt=""
                className="h-56 w-full object-cover"
                style={{ objectPosition: "center 35%" }}
              />
            </div>
          </div>
          <ServicePagesNav activeId="asociaciones" />
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4 mb-5">
          {[{ title: page.helpTitle, items: page.helpItems }, { title: page.beforeTitle, items: page.beforeItems }].map((block) => (
            <div key={block.title} className="col-12 col-lg-6">
              <div className="bg-white border rounded p-4 h-100">
                <h2 className="h4 fw-bold mb-3">{block.title}</h2>
                <ul className="text-secondary mb-0 ps-3">
                  {block.items.map((item) => <li key={item} className="mb-2">{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <h2 className="h4 fw-bold text-vitoria-black mb-1">{page.directoryTitle}</h2>
        <p className="text-secondary mb-3">{page.directoryIntro}</p>

        <div className="row g-3">
          {organizations.map((org, index) => (
            <div key={org.name} className="col-12 col-md-6 col-xl-4">
              <a href={org.href} target="_blank" rel="noreferrer" className="bg-white border rounded p-4 h-100 d-flex flex-column text-decoration-none">
                <span className="small fw-semibold text-success mb-2">{org.territory}</span>
                <h3 className="h5 fw-bold text-vitoria-black mb-2">{org.name}</h3>
                <p className="text-secondary small mb-3">{page.orgFocus[index]}</p>
                <span className="mt-auto text-primary fw-semibold small">{page.visit}</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
