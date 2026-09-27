import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";

type Locale = "es" | "ar" | "eu" | "en";

const copy = {
  es: {
    eyebrow: "Mi cuenta",
    title: "Tu perfil en Portal Migrante",
    intro: "Consulta tu información principal y accede rápidamente a los espacios que forman parte de tu experiencia en la plataforma.",
    account: "Información de la cuenta",
    community: "Comunidad",
    communityDesc: "Publica preguntas, comparte información útil y participa en las conversaciones.",
    services: "Servicios",
    servicesDesc: "Explora recursos y orientación organizados según tus necesidades.",
    editSoon: "La edición completa del perfil estará disponible en una siguiente fase.",
    name: "Nombre",
    email: "Correo electrónico",
    municipality: "Municipio",
    origin: "País de origen",
    language: "Idioma preferido",
    role: "Tipo de cuenta",
    goForum: "Ir a la comunidad",
    goServices: "Explorar servicios",
  },
  ar: {
    eyebrow: "حسابي",
    title: "ملفك الشخصي في Portal Migrante",
    intro: "اطّلع على معلومات حسابك الأساسية وانتقل بسرعة إلى أهم مساحات المنصة.",
    account: "معلومات الحساب",
    community: "المجتمع",
    communityDesc: "اطرح الأسئلة وشارك المعلومات المفيدة وشارك في النقاشات.",
    services: "الخدمات",
    servicesDesc: "استكشف الموارد والتوجيهات المنظمة حسب احتياجاتك.",
    editSoon: "سيصبح التعديل الكامل للملف الشخصي متاحًا في مرحلة لاحقة.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    municipality: "البلدية",
    origin: "بلد الأصل",
    language: "اللغة المفضلة",
    role: "نوع الحساب",
    goForum: "الذهاب إلى المجتمع",
    goServices: "استكشاف الخدمات",
  },
  eu: {
    eyebrow: "Nire kontua",
    title: "Zure profila Portal Migranten",
    intro: "Ikusi zure kontuko informazio nagusia eta sartu plataformako espazio garrantzitsuenetara.",
    account: "Kontuaren informazioa",
    community: "Komunitatea",
    communityDesc: "Egin galderak, partekatu informazio erabilgarria eta parte hartu elkarrizketetan.",
    services: "Zerbitzuak",
    servicesDesc: "Arakatu zure beharretara antolatutako baliabideak eta orientazioa.",
    editSoon: "Profila osorik editatzeko aukera hurrengo fase batean egongo da.",
    name: "Izena",
    email: "Posta elektronikoa",
    municipality: "Udalerria",
    origin: "Jatorrizko herrialdea",
    language: "Hobetsitako hizkuntza",
    role: "Kontu mota",
    goForum: "Joan komunitatera",
    goServices: "Arakatu zerbitzuak",
  },
  en: {
    eyebrow: "My account",
    title: "Your Portal Migrante profile",
    intro: "Review your main account information and quickly access the spaces that are part of your experience on the platform.",
    account: "Account information",
    community: "Community",
    communityDesc: "Ask questions, share useful information and join conversations.",
    services: "Services",
    servicesDesc: "Explore resources and guidance organised around your needs.",
    editSoon: "Full profile editing will be available in a later phase.",
    name: "Name",
    email: "Email",
    municipality: "Municipality",
    origin: "Country of origin",
    language: "Preferred language",
    role: "Account type",
    goForum: "Go to community",
    goServices: "Explore services",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function UserProfilePage() {
  const { currentUser } = useAuth();
  const { locale } = useI18n();
  const c = copy[(locale as Locale) in copy ? (locale as Locale) : "es"];

  if (!currentUser) return null;

  const displayName =
    currentUser.displayName || currentUser.fullName || currentUser.email;
  const initial = displayName.charAt(0).toUpperCase();

  const details = [
    [c.name, displayName],
    [c.email, currentUser.email],
    [c.municipality, currentUser.municipality || "—"],
    [c.origin, currentUser.originCountry || "—"],
    [c.language, currentUser.preferredLanguage || locale || "—"],
    [c.role, currentUser.accountType || currentUser.role || "—"],
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-slate-950 text-3xl font-black text-white shadow-lg shadow-slate-900/10">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="m-0 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                  {c.eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {c.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {c.intro}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="m-0 text-xl font-black text-slate-950">
                  {c.account}
                </h2>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                {details.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {label}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-bold text-slate-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                {c.editSoon}
              </div>
            </section>

            <aside className="space-y-4">
              <Link
                to="/foro"
                className="block rounded-2xl border border-slate-200 bg-white p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
                  ◌
                </div>
                <h2 className="mt-4 text-lg font-black text-slate-950">
                  {c.community}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {c.communityDesc}
                </p>
                <span className="mt-4 inline-flex font-bold text-emerald-700">
                  {c.goForum} →
                </span>
              </Link>

              <Link
                to="/servicios"
                className="block rounded-2xl border border-slate-200 bg-white p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl text-sky-700">
                  +
                </div>
                <h2 className="mt-4 text-lg font-black text-slate-950">
                  {c.services}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {c.servicesDesc}
                </p>
                <span className="mt-4 inline-flex font-bold text-sky-700">
                  {c.goServices} →
                </span>
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
