import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

type Locale = "eu" | "es" | "en" | "ar";

const festivalImages = {
  tamborrada: "https://www.sansebastian.com/wp-content/uploads/2017/06/tamborrada-2.jpg",
  virgenBlanca:
    "https://fiestasvitoria.com/wp-content/uploads/2018/07/celedon-vitoria-fiestas-1024x585.jpg",
  asteNagusia: "https://www.euskoguide.com/images/aste-nagusia-marijaia-on-balcony.jpg",
};

const links = {
  tourism: "https://turismo.euskadi.eus/es/blog-turista-maitea/",
  map: "https://www.openstreetmap.org/relation/349042",
  basqueLanguage: "https://www.euskadi.eus/euskera/",
  agenda: "https://www.euskadi.eus/agenda/",
};

const content: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    mapTitle: string;
    mapIntro: string;
    flagTitle: string;
    flagIntro: string;
    territoryTitle: string;
    cultureTitle: string;
    festivalsTitle: string;
    festivalsIntro: string;
    linksTitle: string;
    open: string;
    backServices: string;
    territories: { name: string; capital: string; note: string }[];
    culture: { title: string; body: string }[];
    festivals: { title: string; date: string; place: string; body: string; image: string }[];
    usefulLinks: { label: string; href: string; note: string }[];
  }
> = {
  es: {
    eyebrow: "Euskadi",
    title: "Conoce el País Vasco y su cultura",
    intro:
      "Una guía visual y sencilla para entender el territorio, el euskera, la convivencia y algunas fiestas importantes de Euskadi.",
    mapTitle: "Mapa básico de Euskadi",
    mapIntro: "Euskadi está formada por tres territorios históricos: Araba/Álava, Bizkaia y Gipuzkoa.",
    flagTitle: "Ikurriña",
    flagIntro:
      "La bandera vasca combina verde, blanco y rojo. Es una señal visual muy reconocible de la identidad vasca.",
    territoryTitle: "Territorios y capitales",
    cultureTitle: "Claves para integrarte",
    festivalsTitle: "Fiestas y fechas para recordar",
    festivalsIntro:
      "Las fiestas locales son una forma natural de conocer personas, ciudades y costumbres.",
    linksTitle: "Enlaces útiles",
    open: "Abrir enlace",
    backServices: "Ver servicios",
    territories: [
      { name: "Araba/Álava", capital: "Vitoria-Gasteiz", note: "Capital administrativa de Euskadi." },
      { name: "Bizkaia", capital: "Bilbao", note: "Área urbana, puerto, cultura y actividad económica." },
      { name: "Gipuzkoa", capital: "Donostia-San Sebastián", note: "Costa, gastronomía, cultura y vida comunitaria." },
    ],
    culture: [
      { title: "Lenguas", body: "El euskera y el castellano conviven. Aprender saludos y palabras básicas ayuda mucho." },
      { title: "Vida local", body: "Participar en asociaciones, barrio, deporte o actividades culturales facilita el contacto." },
      { title: "Convivencia", body: "La sociedad vasca valora el respeto, la puntualidad, el compromiso y la vida comunitaria." },
      { title: "Servicios públicos", body: "Ayuntamientos, centros de salud, escuelas y asociaciones son puertas de entrada importantes." },
    ],
    festivals: [
      {
        title: "Tamborrada",
        date: "20 de enero",
        place: "Donostia-San Sebastián",
        body: "La ciudad celebra el día de San Sebastián con tambores, compañías y ambiente popular.",
        image: festivalImages.tamborrada,
      },
      {
        title: "Fiestas de la Virgen Blanca",
        date: "4 al 9 de agosto",
        place: "Vitoria-Gasteiz",
        body: "Comienzan con la bajada de Celedón y reúnen música, cuadrillas y actividades en la ciudad.",
        image: festivalImages.virgenBlanca,
      },
      {
        title: "Aste Nagusia",
        date: "Agosto",
        place: "Bilbao",
        body: "Semana Grande de Bilbao, con Marijaia como símbolo y actividades culturales en la ciudad.",
        image: festivalImages.asteNagusia,
      },
    ],
    usefulLinks: [
      { label: "Turista Maitea - Turismo Euskadi", href: links.tourism, note: "Página oficial para descubrir destinos, puntos de interés y momentos de Euskadi." },
      { label: "Mapa de Euskadi", href: links.map, note: "Mapa abierto para ubicar ciudades y territorios." },
      { label: "Euskera", href: links.basqueLanguage, note: "Información institucional sobre la lengua vasca." },
      { label: "Agenda Euskadi", href: links.agenda, note: "Actividades y eventos publicados por Euskadi.eus." },
    ],
  },
  ar: {
    eyebrow: "إقليم الباسك",
    title: "تعرّف على إقليم الباسك وثقافته",
    intro:
      "دليل بصري وبسيط لفهم الإقليم، اللغة الباسكية، التعايش وبعض الأعياد المهمة في Euskadi.",
    mapTitle: "خريطة مبسطة لإقليم الباسك",
    mapIntro: "يتكوّن Euskadi من ثلاثة أقاليم تاريخية: ألابا، بيزكايا وغيبوثكوا.",
    flagTitle: "علم الباسك Ikurriña",
    flagIntro:
      "يجمع العلم الباسكي بين الأخضر والأبيض والأحمر، وهو رمز بصري معروف للهوية الباسكية.",
    territoryTitle: "الأقاليم والعواصم",
    cultureTitle: "مفاتيح تساعدك على الاندماج",
    festivalsTitle: "أعياد وتواريخ مهمة",
    festivalsIntro:
      "الأعياد المحلية طريقة طبيعية للتعرف على الناس والمدن والعادات.",
    linksTitle: "روابط مفيدة",
    open: "فتح الرابط",
    backServices: "مشاهدة الخدمات",
    territories: [
      { name: "أرابا/ألافا", capital: "Vitoria-Gasteiz", note: "العاصمة الإدارية لإقليم الباسك." },
      { name: "بيزكايا", capital: "Bilbao", note: "منطقة حضرية وميناء وثقافة ونشاط اقتصادي." },
      { name: "غيبوثكوا", capital: "Donostia-San Sebastián", note: "ساحل، مطبخ، ثقافة وحياة مجتمعية." },
    ],
    culture: [
      { title: "اللغات", body: "تتعايش الباسكية والإسبانية. تعلم التحية وبعض الكلمات الأساسية يساعد كثيراً." },
      { title: "الحياة المحلية", body: "المشاركة في الجمعيات أو الحي أو الرياضة أو الأنشطة الثقافية تسهّل التواصل." },
      { title: "التعايش", body: "المجتمع الباسكي يقدّر الاحترام، الالتزام، احترام الوقت والحياة الجماعية." },
      { title: "الخدمات العمومية", body: "البلديات والمراكز الصحية والمدارس والجمعيات أبواب مهمة للبداية." },
    ],
    festivals: [
      {
        title: "Tamborrada",
        date: "20 يناير",
        place: "Donostia-San Sebastián",
        body: "تحتفل المدينة بيوم سان سباستيان بالطبول والفرق والأجواء الشعبية.",
        image: festivalImages.tamborrada,
      },
      {
        title: "Fiestas de la Virgen Blanca",
        date: "من 4 إلى 9 أغسطس",
        place: "Vitoria-Gasteiz",
        body: "تبدأ بنزول Celedón وتجمع الموسيقى والمجموعات والأنشطة في المدينة.",
        image: festivalImages.virgenBlanca,
      },
      {
        title: "Aste Nagusia",
        date: "أغسطس",
        place: "Bilbao",
        body: "الأسبوع الكبير في بلباو، ورمزها Marijaia، مع أنشطة ثقافية وشعبية.",
        image: festivalImages.asteNagusia,
      },
    ],
    usefulLinks: [
      { label: "Turista Maitea - Turismo Euskadi", href: links.tourism, note: "صفحة رسمية لاكتشاف الوجهات، نقاط الاهتمام واللحظات المهمة في Euskadi." },
      { label: "خريطة Euskadi", href: links.map, note: "خريطة مفتوحة لمعرفة المدن والأقاليم." },
      { label: "اللغة الباسكية", href: links.basqueLanguage, note: "معلومات مؤسساتية حول اللغة الباسكية." },
      { label: "Agenda Euskadi", href: links.agenda, note: "أنشطة وفعاليات منشورة في Euskadi.eus." },
    ],
  },
  en: {
    eyebrow: "Euskadi",
    title: "Discover the Basque Country and its culture",
    intro:
      "A visual and simple guide to the territory, Basque language, coexistence, and important local festivals.",
    mapTitle: "Basic map of Euskadi",
    mapIntro: "Euskadi is made up of three historical territories: Araba/Álava, Bizkaia, and Gipuzkoa.",
    flagTitle: "Ikurriña",
    flagIntro:
      "The Basque flag combines green, white, and red. It is a widely recognized visual sign of Basque identity.",
    territoryTitle: "Territories and capitals",
    cultureTitle: "Keys for integration",
    festivalsTitle: "Festivals and dates to remember",
    festivalsIntro: "Local festivals are a natural way to meet people, cities, and customs.",
    linksTitle: "Useful links",
    open: "Open link",
    backServices: "See services",
    territories: [
      { name: "Araba/Álava", capital: "Vitoria-Gasteiz", note: "Administrative capital of Euskadi." },
      { name: "Bizkaia", capital: "Bilbao", note: "Urban area, port, culture, and economic activity." },
      { name: "Gipuzkoa", capital: "Donostia-San Sebastián", note: "Coast, gastronomy, culture, and community life." },
    ],
    culture: [
      { title: "Languages", body: "Basque and Spanish coexist. Learning greetings and basic words helps a lot." },
      { title: "Local life", body: "Joining associations, neighbourhood activities, sport, or culture makes contact easier." },
      { title: "Coexistence", body: "Basque society values respect, punctuality, commitment, and community life." },
      { title: "Public services", body: "Municipalities, health centres, schools, and associations are important entry points." },
    ],
    festivals: [
      { title: "Tamborrada", date: "January 20", place: "Donostia-San Sebastián", body: "The city celebrates Saint Sebastian's day with drums, groups, and a popular atmosphere.", image: festivalImages.tamborrada },
      { title: "Virgen Blanca festivities", date: "August 4 to 9", place: "Vitoria-Gasteiz", body: "They begin with Celedón's descent and bring music, groups, and activities to the city.", image: festivalImages.virgenBlanca },
      { title: "Aste Nagusia", date: "August", place: "Bilbao", body: "Bilbao's Big Week, with Marijaia as its symbol and many cultural activities.", image: festivalImages.asteNagusia },
    ],
    usefulLinks: [
      { label: "Turista Maitea - Turismo Euskadi", href: links.tourism, note: "Official page to discover destinations, points of interest, and moments in Euskadi." },
      { label: "Map of Euskadi", href: links.map, note: "Open map to locate cities and territories." },
      { label: "Basque language", href: links.basqueLanguage, note: "Institutional information about Basque." },
      { label: "Agenda Euskadi", href: links.agenda, note: "Events and activities published by Euskadi.eus." },
    ],
  },
  eu: {
    eyebrow: "Euskadi",
    title: "Ezagutu Euskal Herria eta bere kultura",
    intro:
      "Euskadiko lurraldea, euskara, bizikidetza eta jai garrantzitsu batzuk ulertzeko gida bisual eta erraza.",
    mapTitle: "Euskadiko oinarrizko mapa",
    mapIntro: "Euskadi hiru lurralde historikok osatzen dute: Araba, Bizkaia eta Gipuzkoa.",
    flagTitle: "Ikurriña",
    flagIntro:
      "Euskal banderak berdea, zuria eta gorria uztartzen ditu, eta euskal identitatearen ikur ezaguna da.",
    territoryTitle: "Lurraldeak eta hiriburuak",
    cultureTitle: "Integratzeko gakoak",
    festivalsTitle: "Gogoan izateko jaiak eta datak",
    festivalsIntro: "Tokiko jaiak pertsonak, hiriak eta ohiturak ezagutzeko bide naturala dira.",
    linksTitle: "Esteka erabilgarriak",
    open: "Ireki esteka",
    backServices: "Ikusi zerbitzuak",
    territories: [
      { name: "Araba", capital: "Vitoria-Gasteiz", note: "Euskadiko hiriburu administratiboa." },
      { name: "Bizkaia", capital: "Bilbo", note: "Hiri eremua, portua, kultura eta jarduera ekonomikoa." },
      { name: "Gipuzkoa", capital: "Donostia", note: "Kosta, gastronomia, kultura eta komunitate bizitza." },
    ],
    culture: [
      { title: "Hizkuntzak", body: "Euskara eta gaztelania elkarrekin bizi dira. Agurrak eta oinarrizko hitzak ikasteak asko laguntzen du." },
      { title: "Tokiko bizitza", body: "Elkarteetan, auzoan, kirolean edo kulturan parte hartzeak harremanak errazten ditu." },
      { title: "Bizikidetza", body: "Euskal gizarteak errespetua, puntualtasuna, konpromisoa eta komunitate bizitza baloratzen ditu." },
      { title: "Zerbitzu publikoak", body: "Udalak, osasun zentroak, eskolak eta elkarteak sarrera puntu garrantzitsuak dira." },
    ],
    festivals: [
      { title: "Danborrada", date: "Urtarrilak 20", place: "Donostia", body: "Hiriak San Sebastian eguna ospatzen du danborrekin, konpainiekin eta giro herrikoiarekin.", image: festivalImages.tamborrada },
      { title: "Andre Maria Zuriaren jaiak", date: "Abuztuaren 4tik 9ra", place: "Vitoria-Gasteiz", body: "Celedonen jaitsierarekin hasten dira, musikaz, kuadrillez eta jarduerez beteta.", image: festivalImages.virgenBlanca },
      { title: "Aste Nagusia", date: "Abuztua", place: "Bilbo", body: "Bilboko Aste Nagusia, Marijaia ikur gisa eta jarduera kultural askorekin.", image: festivalImages.asteNagusia },
    ],
    usefulLinks: [
      { label: "Turista Maitea - Turismo Euskadi", href: links.tourism, note: "Euskadiko helmugak, interesguneak eta uneak ezagutzeko orri ofiziala." },
      { label: "Euskadiko mapa", href: links.map, note: "Hiriak eta lurraldeak kokatzeko mapa irekia." },
      { label: "Euskara", href: links.basqueLanguage, note: "Euskarari buruzko informazio instituzionala." },
      { label: "Agenda Euskadi", href: links.agenda, note: "Euskadi.eus-en argitaratutako jarduerak eta ekitaldiak." },
    ],
  },
};

function BasqueFlag() {
  return (
    <svg viewBox="0 0 420 252" className="h-auto w-full rounded-lg shadow-inner" role="img">
      <title>Ikurrina</title>
      <rect width="420" height="252" fill="#d52b1e" />
      <path d="M0 0 420 252M420 0 0 252" stroke="#009739" strokeWidth="34" />
      <path d="M210 0v252M0 126h420" stroke="#fff" strokeWidth="34" />
    </svg>
  );
}

function EuskadiMap({ territories }: { territories: { name: string; capital: string }[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <svg viewBox="0 0 560 330" className="h-auto w-full" role="img">
        <title>Euskadi map</title>
        <rect x="42" y="82" width="170" height="126" rx="24" fill="#dcfce7" stroke="#059669" strokeWidth="4" />
        <rect x="230" y="56" width="286" height="136" rx="24" fill="#bbf7d0" stroke="#047857" strokeWidth="4" />
        <rect x="164" y="216" width="250" height="88" rx="24" fill="#fee2e2" stroke="#dc2626" strokeWidth="4" />
        <path d="M212 144h18M282 192l-36 24M374 192l-38 24" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 8" />
        {territories.map((territory, index) => {
          const positions = [
            { x: 127, y: 136 },
            { x: 373, y: 126 },
            { x: 289, y: 250 },
          ];
          return (
            <g key={territory.name}>
              <text x={positions[index].x} y={positions[index].y} textAnchor="middle" className="fill-slate-950 text-[20px] font-black">
                {territory.name}
              </text>
              <text x={positions[index].x} y={positions[index].y + 26} textAnchor="middle" className="fill-slate-600 text-[15px] font-bold">
                {territory.capital}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function CulturaVascaPage() {
  const { locale } = useI18n();
  const page = content[(locale as Locale) in content ? (locale as Locale) : "es"];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_78%,rgba(0,151,57,0.82)_0%,rgba(0,151,57,0.42)_24%,transparent_48%),linear-gradient(135deg,#2448ad_0%,#284fb8_46%,#173f89_100%)] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-8 inline-flex rounded-full border border-white/70 px-5 py-2 text-sm font-black text-white">
              {page.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              {page.title}
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-200 sm:text-2xl">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={links.tourism} target="_blank" rel="noreferrer" className="rounded-lg bg-vitoria-green px-7 py-4 text-center text-lg font-black text-white no-underline shadow-lg shadow-black/20">
                Turista Maitea
              </a>
              <Link to="/servicios" className="rounded-lg border border-white/70 px-7 py-4 text-center text-lg font-black text-white no-underline transition hover:bg-white hover:text-slate-950">
                {page.backServices}
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/70 bg-white/10 backdrop-blur">
            <img
              src={festivalImages.asteNagusia}
              alt=""
              className="h-72 w-full object-cover sm:h-80"
            />
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <div className="rounded-lg bg-white/15 p-5">
                <h2 className="text-xl font-black text-white">{page.mapTitle}</h2>
                <p className="mt-2 leading-relaxed text-slate-200">{page.mapIntro}</p>
              </div>
              <div className="rounded-lg bg-white/15 p-5">
                <h2 className="text-xl font-black text-white">{page.flagTitle}</h2>
                <p className="mt-2 leading-relaxed text-slate-200">{page.flagIntro}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-black text-slate-950">{page.territoryTitle}</h2>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">{page.mapIntro}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {page.territories.map((territory) => (
                <article key={territory.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-950">{territory.name}</h3>
                  <p className="mt-2 font-black text-emerald-700">{territory.capital}</p>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">{territory.note}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <EuskadiMap territories={page.territories} />
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <BasqueFlag />
              <h3 className="mt-5 text-2xl font-black text-slate-950">{page.flagTitle}</h3>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">{page.flagIntro}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-slate-950">{page.cultureTitle}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {page.culture.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-slate-950">{page.festivalsTitle}</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">{page.festivalsIntro}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {page.festivals.map((festival) => (
            <article key={festival.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img src={festival.image} alt="" className="h-52 w-full object-cover" />
              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800">{festival.date}</span>
                  <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">{festival.place}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-950">{festival.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{festival.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-slate-950">{page.linksTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {page.usefulLinks.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 bg-white p-5 no-underline shadow-sm transition hover:border-emerald-300">
              <h3 className="text-xl font-black text-slate-950">{item.label}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{item.note}</p>
              <span className="mt-4 inline-flex font-black text-emerald-700">{page.open}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
