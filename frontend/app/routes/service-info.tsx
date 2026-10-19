import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import ServicePagesNav from "../components/ServicePagesNav";

type Locale = "eu" | "es" | "en" | "ar";
type ServiceId = "salud" | "vivienda" | "empleo" | "educacion" | "legal";

type ResourceLink = {
  label: string;
  href: string;
  note: string;
  type: "oficial" | "privado" | "interno";
};

type ServiceInfo = {
  title: string;
  eyebrow: string;
  intro: string;
  icon: string;
  quickTitle: string;
  quick: string[];
  sections: {
    title: string;
    items: string[];
  }[];
  resourcesTitle: string;
  resourcesIntro: string;
  resources: ResourceLink[];
  cautionTitle: string;
  cautions: string[];
  nextTitle: string;
  next: string[];
};

type UiText = {
  backToServices: string;
  openResource: string;
  pageNotFound: string;
  serviceNavTitle: string;
  communityTitle: string;
  communityText: string;
  askMigrants: string;
  createAccount: string;
  resourceType: Record<ResourceLink["type"], string>;
};

const uiText: Record<Locale, UiText> = {
  es: {
    backToServices: "Volver a servicios",
    openResource: "Abrir recurso",
    pageNotFound: "No se encontró esta página de servicio.",
    serviceNavTitle: "Otras páginas",
    communityTitle: "Pregunta a personas que ya pasaron por esto",
    communityText:
      "Además de la información oficial, puedes consultar experiencias de otras personas migrantes y compartir tus dudas en el foro.",
    askMigrants: "Preguntar en el foro",
    createAccount: "Crear cuenta",
    resourceType: {
      oficial: "Oficial",
      privado: "Privado",
      interno: "Portal",
    },
  },
  ar: {
    backToServices: "العودة إلى الخدمات",
    openResource: "فتح المورد",
    pageNotFound: "لم يتم العثور على صفحة الخدمة هذه.",
    serviceNavTitle: "صفحات أخرى",
    communityTitle: "اسأل مهاجرين مرّوا بهذه التجربة قبلك",
    communityText:
      "إلى جانب المعلومات الرسمية، يمكنك الاستفادة من تجارب أشخاص مهاجرين وطرح أسئلتك داخل المنتدى.",
    askMigrants: "اسأل في المنتدى",
    createAccount: "إنشاء حساب",
    resourceType: {
      oficial: "رسمي",
      privado: "خاص",
      interno: "البوابة",
    },
  },
  en: {
    backToServices: "Back to services",
    openResource: "Open resource",
    pageNotFound: "This service page was not found.",
    serviceNavTitle: "Other pages",
    communityTitle: "Ask people who have already gone through this",
    communityText:
      "Alongside official information, you can learn from other migrants' experiences and ask your questions in the forum.",
    askMigrants: "Ask in the forum",
    createAccount: "Create account",
    resourceType: {
      oficial: "Official",
      privado: "Private",
      interno: "Portal",
    },
  },
  eu: {
    backToServices: "Itzuli zerbitzuetara",
    openResource: "Ireki baliabidea",
    pageNotFound: "Zerbitzu orri hau ez da aurkitu.",
    serviceNavTitle: "Beste orriak",
    communityTitle: "Galdetu bide hau egin duten pertsonei",
    communityText:
      "Informazio ofizialaz gain, beste migratzaile batzuen esperientziak ezagutu eta zure galderak foroan parteka ditzakezu.",
    askMigrants: "Galdetu foroan",
    createAccount: "Sortu kontua",
    resourceType: {
      oficial: "Ofiziala",
      privado: "Pribatua",
      interno: "Ataria",
    },
  },
};

const commonResources = {
  osakidetzaSearch:
    "https://www.osakidetza.euskadi.eus/buscador-de-centros-sanitarios-y-hospitales/webosk00-cercon/es/",
  osakidetza: "https://www.osakidetza.euskadi.eus/",
  etxebide: "https://www.etxebide.euskadi.eus/alquiler",
  alokabide: "https://www.alokabide.euskadi.eus/",
  idealista: "https://www.idealista.com/geo/alquiler-viviendas/pais-vasco/",
  fotocasa: "https://www.fotocasa.es/",
  pisos: "https://www.pisos.com/",
  lanbideInfo:
    "https://www.lanbide.euskadi.eus/informacion/informacion-general-de-lanbide/weblan00-empleo/es/",
  lanbideTraining:
    "https://www.lanbide.euskadi.eus/informacion/formacion-ofrecida-por-lanbide/weblan00-content/es/",
  epa:
    "https://www.euskadi.eus/gobierno-vasco/contenidos/informacion/educacion_ed_adultos/es_1702/index.shtml",
  homologacion:
    "https://www.euskadi.eus/gobierno-vasco/-/homologacion-o-convalidacion-de-titulos-o-estudios-extranjeros-no-universitarios/",
  upv: "https://www.ehu.eus/",
  deusto: "https://www.deusto.es/",
  mondragon: "https://www.mondragon.edu/",
  aholku:
    "https://www.euskadi.eus/web01-a2migra/es/contenidos/informacion/aholkusareaintro_2/es_def/index.shtml",
  sede: "https://sede.administracionespublicas.gob.es/",
};

const servicePages: Record<Locale, Record<ServiceId, ServiceInfo>> = {
  es: {
    salud: {
      title: "Salud y atención sanitaria",
      eyebrow: "Osakidetza, centros de salud y urgencias",
      intro:
        "Una guía rápida para saber dónde empezar si necesitas atención sanitaria en Euskadi.",
      icon: "💗",
      quickTitle: "Qué hacer primero",
      quick: [
        "Busca tu centro de salud por municipio o dirección.",
        "Pregunta por la tarjeta sanitaria y la cita previa si ya resides en Euskadi.",
        "En una urgencia vital llama al 112.",
      ],
      sections: [
        {
          title: "Centros y atención",
          items: [
            "Centros de salud y consultorios de atención primaria.",
            "Hospitales públicos de Araba/Álava, Bizkaia y Gipuzkoa.",
            "Puntos de Atención Continuada para urgencias no vitales fuera de horario.",
          ],
        },
        {
          title: "Documentos útiles",
          items: [
            "Documento de identidad o pasaporte.",
            "Empadronamiento si te lo solicitan.",
            "Tarjeta sanitaria si ya la tienes.",
          ],
        },
      ],
      resourcesTitle: "Recursos importantes",
      resourcesIntro: "Enlaces oficiales para buscar centros y ampliar información.",
      resources: [
        {
          label: "Buscador de centros sanitarios y hospitales",
          href: commonResources.osakidetzaSearch,
          note: "Permite buscar por centro, municipio, dirección, tipo de centro y territorio.",
          type: "oficial",
        },
        {
          label: "Osakidetza",
          href: commonResources.osakidetza,
          note: "Portal del Servicio Vasco de Salud.",
          type: "oficial",
        },
        {
          label: "Ayuntamientos",
          href: "/ayuntamientos",
          note: "Información municipal para trámites de cercanía y orientación local.",
          type: "interno",
        },
      ],
      cautionTitle: "Ten en cuenta",
      cautions: [
        "La atención y la documentación pueden variar según tu situación administrativa.",
        "Para emergencias no uses formularios: llama al 112.",
      ],
      nextTitle: "Mejoras previstas",
      next: [
        "Buscador interno por municipio.",
        "Fichas de centros con mapa, teléfono y horarios.",
        "Guías sencillas sobre tarjeta sanitaria y cita previa.",
      ],
    },
    vivienda: {
      title: "Vivienda y alquiler",
      eyebrow: "Alquiler público, ayudas y búsqueda privada",
      intro:
        "Recursos para iniciar la búsqueda de vivienda, entender ayudas públicas y evitar riesgos en anuncios privados.",
      icon: "🏠",
      quickTitle: "Qué revisar primero",
      quick: [
        "Consulta Etxebide si buscas vivienda protegida o alquiler público.",
        "Compara contrato, fianza, gastos y posibilidad de empadronamiento.",
        "No pagues por adelantado sin contrato, visita o identificación clara.",
      ],
      sections: [
        {
          title: "Recursos públicos",
          items: [
            "Inscripción como demandante de vivienda en Etxebide.",
            "Programas de alquiler social o asequible mediante Alokabide.",
            "Ayudas al alquiler como Gaztelagun cuando se cumplen requisitos.",
          ],
        },
        {
          title: "Búsqueda privada",
          items: [
            "Viviendas completas, habitaciones y alquiler compartido.",
            "Portales de anuncios para comparar precios y zonas.",
            "Guardar mensajes, justificantes y condiciones pactadas.",
          ],
        },
      ],
      resourcesTitle: "Dónde buscar",
      resourcesIntro: "Portales oficiales y sitios privados para empezar con orden.",
      resources: [
        {
          label: "Etxebide - alquiler",
          href: commonResources.etxebide,
          note: "Información oficial sobre vivienda protegida, inscripción y solicitudes.",
          type: "oficial",
        },
        {
          label: "Alokabide",
          href: commonResources.alokabide,
          note: "Gestión de programas públicos de alquiler social y asequible.",
          type: "oficial",
        },
        {
          label: "idealista - País Vasco",
          href: commonResources.idealista,
          note: "Anuncios privados de viviendas y habitaciones.",
          type: "privado",
        },
        {
          label: "Fotocasa",
          href: commonResources.fotocasa,
          note: "Búsqueda privada de alquiler y comparación de zonas.",
          type: "privado",
        },
        {
          label: "pisos.com",
          href: commonResources.pisos,
          note: "Portal privado para consultar anuncios de vivienda.",
          type: "privado",
        },
      ],
      cautionTitle: "Antes de firmar o pagar",
      cautions: [
        "Si el precio parece demasiado bajo o te piden dinero antes de ver la vivienda, puede ser una estafa.",
        "Pregunta siempre si el empadronamiento es posible antes de firmar.",
      ],
      nextTitle: "Mejoras previstas",
      next: [
        "Checklist de documentos para alquilar.",
        "Guía contra estafas frecuentes.",
        "Recursos por municipio y provincia.",
      ],
    },
    empleo: {
      title: "Trabajo, orientación y formación",
      eyebrow: "Lanbide, búsqueda de empleo y capacitación",
      intro:
        "Una página para organizar la búsqueda de empleo: inscripción, orientación, formación y preparación básica.",
      icon: "💼",
      quickTitle: "Primeros pasos",
      quick: [
        "Inscríbete o actualiza tu demanda en Lanbide si puedes trabajar.",
        "Prepara un CV sencillo y una lista de experiencia, idiomas y disponibilidad.",
        "Combina búsqueda de empleo con formación e idiomas.",
      ],
      sections: [
        {
          title: "Dónde empezar",
          items: [
            "Lanbide ofrece información, formación, orientación e intermediación laboral.",
            "Puedes revisar ofertas, cursos y servicios de atención.",
            "Los ayuntamientos y asociaciones pueden orientar sobre recursos locales.",
          ],
        },
        {
          title: "Preparación básica",
          items: [
            "CV actualizado y adaptado al tipo de trabajo.",
            "Documentación de identidad y permiso de trabajo si corresponde.",
            "Disponibilidad horaria, idiomas y formación acreditable.",
          ],
        },
      ],
      resourcesTitle: "Recursos para empleo",
      resourcesIntro: "Puntos de partida para buscar orientación y formación.",
      resources: [
        {
          label: "Lanbide - información general",
          href: commonResources.lanbideInfo,
          note: "Servicio Vasco de Empleo: orientación, formación, ofertas y ayudas.",
          type: "oficial",
        },
        {
          label: "Lanbide - formación",
          href: commonResources.lanbideTraining,
          note: "Buscador de especialidades formativas y cursos.",
          type: "oficial",
        },
        {
          label: "Asociaciones de apoyo",
          href: "/servicios/asociaciones",
          note: "Entidades que pueden orientar sobre empleo, derechos y formación.",
          type: "interno",
        },
      ],
      cautionTitle: "Antes de aceptar un trabajo",
      cautions: [
        "Pide condiciones claras: horario, salario, contrato y tareas.",
        "Si dudas sobre tus derechos laborales, busca orientación antes de firmar.",
      ],
      nextTitle: "Mejoras previstas",
      next: [
        "Modelo de CV simple.",
        "Guía de derechos laborales básicos.",
        "Listado de recursos por provincia.",
      ],
    },
    educacion: {
      title: "Educación, idiomas y universidades",
      eyebrow: "EPA, formación profesional, homologación y estudios superiores",
      intro:
        "Recursos para personas que quieren aprender idioma, terminar estudios, homologar títulos o acceder a universidad.",
      icon: "🎓",
      quickTitle: "Qué camino elegir",
      quick: [
        "EPA puede ayudar con alfabetización, castellano, euskera y graduado en secundaria.",
        "Si buscas empleo, revisa formación profesional y cursos de Lanbide.",
        "Si tienes estudios extranjeros, consulta homologación o convalidación.",
      ],
      sections: [
        {
          title: "Formación para adultos",
          items: [
            "Educación básica desde alfabetización hasta Graduado en Secundaria.",
            "Programas no reglados como castellano o euskera para personas extranjeras.",
            "Preparación para pruebas de acceso y mejora de cualificación.",
          ],
        },
        {
          title: "Universidad y títulos",
          items: [
            "UPV/EHU es la universidad pública del País Vasco.",
            "Deusto y Mondragon Unibertsitatea ofrecen estudios superiores y formación continua.",
            "La homologación depende del tipo de estudios y del trámite correspondiente.",
          ],
        },
      ],
      resourcesTitle: "Recursos educativos",
      resourcesIntro: "Enlaces útiles para estudiar opciones y trámites.",
      resources: [
        {
          label: "Educación de Personas Adultas",
          href: commonResources.epa,
          note: "Información oficial sobre EPA, modalidades y formación básica.",
          type: "oficial",
        },
        {
          label: "Homologación de estudios extranjeros no universitarios",
          href: commonResources.homologacion,
          note: "Información general, documentación y preguntas frecuentes.",
          type: "oficial",
        },
        {
          label: "UPV/EHU",
          href: commonResources.upv,
          note: "Universidad pública del País Vasco.",
          type: "oficial",
        },
        {
          label: "Universidad de Deusto",
          href: commonResources.deusto,
          note: "Universidad con campus en Bilbao y Donostia-San Sebastián.",
          type: "privado",
        },
        {
          label: "Mondragon Unibertsitatea",
          href: commonResources.mondragon,
          note: "Universidad cooperativa con grados, másteres y formación continua.",
          type: "privado",
        },
      ],
      cautionTitle: "Consejo",
      cautions: [
        "Guarda certificados, notas y documentos originales de tus estudios.",
        "Pregunta por plazos de matrícula: pueden cambiar según curso y centro.",
      ],
      nextTitle: "Mejoras previstas",
      next: [
        "Mapa de centros EPA.",
        "Guía de homologación por tipo de estudios.",
        "Recursos de idiomas por municipio.",
      ],
    },
    legal: {
      title: "Orientación legal y extranjería",
      eyebrow: "Información básica y recursos de asesoramiento",
      intro:
        "Una guía cuidadosa para saber por dónde empezar con residencia, arraigo, permisos, citas y orientación jurídica.",
      icon: "⚖️",
      quickTitle: "Antes de iniciar un trámite",
      quick: [
        "Identifica tu situación: residencia, asilo, arraigo, familia, trabajo o renovación.",
        "Reúne documentos básicos antes de pedir cita.",
        "Si hay plazos, denegación o urgencia, busca asesoramiento profesional.",
      ],
      sections: [
        {
          title: "Temas frecuentes",
          items: [
            "Empadronamiento, residencia, arraigo y autorizaciones de trabajo.",
            "Reagrupación familiar, renovaciones y documentación.",
            "Derechos básicos y acceso a servicios públicos.",
          ],
        },
        {
          title: "Documentos habituales",
          items: [
            "Pasaporte o documento de identidad.",
            "Empadronamiento y documentación familiar si corresponde.",
            "Contratos, informes, resoluciones o justificantes según el caso.",
          ],
        },
      ],
      resourcesTitle: "Recursos jurídicos",
      resourcesIntro: "Enlaces oficiales y recursos de orientación.",
      resources: [
        {
          label: "Aholku-Sarea",
          href: commonResources.aholku,
          note: "Red Vasca de Atención Jurídica en materia de extranjería.",
          type: "oficial",
        },
        {
          label: "Sede electrónica de Administraciones Públicas",
          href: commonResources.sede,
          note: "Trámites de extranjería, consulta de expedientes y servicios estatales.",
          type: "oficial",
        },
        {
          label: "Asociaciones de apoyo",
          href: "/servicios/asociaciones",
          note: "Entidades sociales que pueden orientar o derivar a recursos adecuados.",
          type: "interno",
        },
      ],
      cautionTitle: "Importante",
      cautions: [
        "La información de esta página no sustituye asesoramiento jurídico profesional.",
        "Cada expediente depende de fechas, documentos y situación personal.",
      ],
      nextTitle: "Mejoras previstas",
      next: [
        "Guías por trámite y documentos.",
        "Listado de entidades por territorio.",
        "Avisos sobre cuándo pedir asesoramiento profesional.",
      ],
    },
  },
  ar: {
    salud: {
      title: "الصحة والرعاية الطبية",
      eyebrow: "أوساكيديتزا، المراكز الصحية والطوارئ",
      intro: "دليل سريع لمعرفة أين تبدأ إذا احتجت إلى رعاية صحية في إقليم الباسك.",
      icon: "💗",
      quickTitle: "ماذا تفعل أولاً",
      quick: [
        "ابحث عن المركز الصحي حسب البلدية أو العنوان.",
        "اسأل عن البطاقة الصحية وحجز الموعد إذا كنت مقيماً في الإقليم.",
        "في حالة طوارئ خطيرة اتصل بالرقم 112.",
      ],
      sections: [
        {
          title: "المراكز والرعاية",
          items: [
            "مراكز الصحة وعيادات الرعاية الأولية.",
            "المستشفيات العمومية في ألافا وبيزكايا وغيبوثكوا.",
            "نقاط الرعاية المستمرة للحالات غير الخطيرة خارج أوقات العمل.",
          ],
        },
        {
          title: "وثائق مفيدة",
          items: [
            "وثيقة الهوية أو جواز السفر.",
            "شهادة السكن إذا طُلبت منك.",
            "البطاقة الصحية إذا كانت لديك.",
          ],
        },
      ],
      resourcesTitle: "موارد مهمة",
      resourcesIntro: "روابط رسمية للبحث عن المراكز والحصول على معلومات أكثر.",
      resources: [
        {
          label: "باحث المراكز الصحية والمستشفيات",
          href: commonResources.osakidetzaSearch,
          note: "بحث حسب المركز أو البلدية أو العنوان أو نوع المركز أو الإقليم.",
          type: "oficial",
        },
        {
          label: "Osakidetza",
          href: commonResources.osakidetza,
          note: "بوابة خدمة الصحة في إقليم الباسك.",
          type: "oficial",
        },
        {
          label: "البلديات",
          href: "/ayuntamientos",
          note: "معلومات محلية للمعاملات القريبة والتوجيه.",
          type: "interno",
        },
      ],
      cautionTitle: "انتبه",
      cautions: [
        "قد تختلف الوثائق المطلوبة حسب وضعك الإداري.",
        "في الطوارئ لا تستعمل النماذج، اتصل مباشرة بالرقم 112.",
      ],
      nextTitle: "تحسينات قادمة",
      next: [
        "بحث داخلي حسب البلدية.",
        "بطاقات للمراكز مع الخريطة والهاتف والساعات.",
        "دلائل بسيطة حول البطاقة الصحية وحجز الموعد.",
      ],
    },
    vivienda: {
      title: "السكن والإيجار",
      eyebrow: "الإيجار العمومي، المساعدات والبحث الخاص",
      intro:
        "موارد لبدء البحث عن السكن وفهم المساعدات العمومية وتجنب مخاطر الإعلانات الخاصة.",
      icon: "🏠",
      quickTitle: "ما الذي تراجعه أولاً",
      quick: [
        "راجع Etxebide إذا كنت تبحث عن سكن محمي أو إيجار عمومي.",
        "قارن العقد والضمان والمصاريف وإمكانية التسجيل في البلدية.",
        "لا تدفع مسبقاً دون عقد أو زيارة أو تعريف واضح بالمالك.",
      ],
      sections: [
        {
          title: "موارد عمومية",
          items: [
            "التسجيل كطالب سكن في Etxebide.",
            "برامج الإيجار الاجتماعي أو الميسر عبر Alokabide.",
            "مساعدات الإيجار مثل Gaztelagun عند توفر الشروط.",
          ],
        },
        {
          title: "البحث الخاص",
          items: [
            "منازل كاملة، غرف، وسكن مشترك.",
            "مواقع إعلانات لمقارنة الأسعار والمناطق.",
            "احتفظ بالرسائل والإيصالات والشروط المتفق عليها.",
          ],
        },
      ],
      resourcesTitle: "أين تبحث",
      resourcesIntro: "بوابات رسمية ومواقع خاصة للبدء بطريقة منظمة.",
      resources: [
        {
          label: "Etxebide - الإيجار",
          href: commonResources.etxebide,
          note: "معلومات رسمية حول السكن المحمي والتسجيل والطلبات.",
          type: "oficial",
        },
        {
          label: "Alokabide",
          href: commonResources.alokabide,
          note: "إدارة برامج الإيجار الاجتماعي والميسر.",
          type: "oficial",
        },
        {
          label: "idealista - إقليم الباسك",
          href: commonResources.idealista,
          note: "إعلانات خاصة للمنازل والغرف.",
          type: "privado",
        },
        {
          label: "Fotocasa",
          href: commonResources.fotocasa,
          note: "بحث خاص عن الإيجار ومقارنة المناطق.",
          type: "privado",
        },
        {
          label: "pisos.com",
          href: commonResources.pisos,
          note: "موقع خاص للاطلاع على إعلانات السكن.",
          type: "privado",
        },
      ],
      cautionTitle: "قبل التوقيع أو الدفع",
      cautions: [
        "إذا كان السعر منخفضاً جداً أو طُلب منك دفع المال قبل رؤية السكن، فقد يكون الإعلان غير موثوق أو احتيالياً.",
        "قبل توقيع العقد، اسأل بوضوح هل يمكنك التسجيل في البلدية بهذا العنوان.",
      ],
      nextTitle: "تحسينات قادمة",
      next: [
        "قائمة وثائق الإيجار.",
        "دليل ضد عمليات الاحتيال الشائعة.",
        "موارد حسب البلدية والمحافظة.",
      ],
    },
    empleo: {
      title: "العمل، التوجيه والتكوين",
      eyebrow: "Lanbide، البحث عن العمل والتدريب",
      intro:
        "صفحة لتنظيم البحث عن العمل: التسجيل، التوجيه، التكوين والتحضير الأساسي.",
      icon: "💼",
      quickTitle: "الخطوات الأولى",
      quick: [
        "سجّل أو حدّث طلب العمل في Lanbide إذا كان بإمكانك العمل.",
        "حضّر سيرة ذاتية بسيطة وتجربتك ولغاتك وتوفرك.",
        "اجمع بين البحث عن العمل والتكوين وتعلم اللغة.",
      ],
      sections: [
        {
          title: "أين تبدأ",
          items: [
            "Lanbide يقدم معلومات وتكويناً وتوجيهاً ووساطة في العمل.",
            "يمكن مراجعة العروض والدورات وخدمات الاستقبال.",
            "البلديات والجمعيات يمكن أن توجهك إلى موارد محلية.",
          ],
        },
        {
          title: "تحضير أساسي",
          items: [
            "سيرة ذاتية محدثة ومناسبة لنوع العمل.",
            "وثائق الهوية وتصريح العمل إذا كان مطلوباً.",
            "التوفر الزمني واللغات والتكوين المثبت.",
          ],
        },
      ],
      resourcesTitle: "موارد العمل",
      resourcesIntro: "نقاط بداية للبحث عن التوجيه والتكوين.",
      resources: [
        {
          label: "Lanbide - معلومات عامة",
          href: commonResources.lanbideInfo,
          note: "خدمة التوظيف الباسكية: توجيه، تكوين، عروض ومساعدات.",
          type: "oficial",
        },
        {
          label: "Lanbide - التكوين",
          href: commonResources.lanbideTraining,
          note: "باحث التخصصات والدورات التكوينية.",
          type: "oficial",
        },
        {
          label: "جمعيات الدعم",
          href: "/servicios/asociaciones",
          note: "جهات يمكن أن توجه في العمل والحقوق والتكوين.",
          type: "interno",
        },
      ],
      cautionTitle: "قبل قبول عمل",
      cautions: [
        "اطلب شروطاً واضحة: الساعات، الأجر، العقد والمهام.",
        "إذا شككت في حقوقك العمالية، اطلب توجيهاً قبل التوقيع.",
      ],
      nextTitle: "تحسينات قادمة",
      next: [
        "نموذج سيرة ذاتية بسيط.",
        "دليل الحقوق العمالية الأساسية.",
        "موارد حسب المحافظة.",
      ],
    },
    educacion: {
      title: "التعليم، اللغات والجامعات",
      eyebrow: "تعليم الكبار، التكوين المهني، معادلة الشهادات والدراسات العليا",
      intro:
        "موارد لمن يريد تعلم اللغة أو إكمال الدراسة أو معادلة الشهادات أو دخول الجامعة.",
      icon: "🎓",
      quickTitle: "أي طريق تختار",
      quick: [
        "تعليم الكبار EPA يساعد في القراءة والكتابة، الإسبانية، الباسكية والثانوي.",
        "إذا كنت تبحث عن عمل، راجع التكوين المهني ودورات Lanbide.",
        "إذا لديك شهادات أجنبية، راجع homologación أو convalidación.",
      ],
      sections: [
        {
          title: "تعليم الكبار",
          items: [
            "تعليم أساسي من محو الأمية حتى شهادة الثانوي.",
            "برامج غير رسمية مثل الإسبانية أو الباسكية للأجانب.",
            "تحضير لاختبارات الولوج وتحسين المؤهلات.",
          ],
        },
        {
          title: "الجامعة والشهادات",
          items: [
            "UPV/EHU هي الجامعة العمومية في إقليم الباسك.",
            "Deusto و Mondragon Unibertsitatea توفران دراسات عليا وتكويناً مستمراً.",
            "معادلة الشهادات تعتمد على نوع الدراسة والإجراء المناسب.",
          ],
        },
      ],
      resourcesTitle: "موارد تعليمية",
      resourcesIntro: "روابط مفيدة لدراسة الخيارات والإجراءات.",
      resources: [
        {
          label: "تعليم الأشخاص البالغين EPA",
          href: commonResources.epa,
          note: "معلومات رسمية عن EPA والأنماط والتكوين الأساسي.",
          type: "oficial",
        },
        {
          label: "معادلة الدراسات الأجنبية غير الجامعية",
          href: commonResources.homologacion,
          note: "معلومات عامة، الوثائق والأسئلة المتكررة.",
          type: "oficial",
        },
        {
          label: "UPV/EHU",
          href: commonResources.upv,
          note: "الجامعة العمومية في إقليم الباسك.",
          type: "oficial",
        },
        {
          label: "Universidad de Deusto",
          href: commonResources.deusto,
          note: "جامعة لها فروع في بلباو ودونوستيا.",
          type: "privado",
        },
        {
          label: "Mondragon Unibertsitatea",
          href: commonResources.mondragon,
          note: "جامعة تعاونية بدرجات وماستر وتكوين مستمر.",
          type: "privado",
        },
      ],
      cautionTitle: "نصيحة",
      cautions: [
        "احتفظ بالشهادات وكشوف النقط والوثائق الأصلية.",
        "اسأل عن آجال التسجيل لأنها تتغير حسب السنة والمركز.",
      ],
      nextTitle: "تحسينات قادمة",
      next: [
        "خريطة مراكز EPA.",
        "دليل معادلة الشهادات حسب النوع.",
        "موارد تعلم اللغة حسب البلدية.",
      ],
    },
    legal: {
      title: "التوجيه القانوني وشؤون الأجانب",
      eyebrow: "معلومات أساسية وموارد استشارة",
      intro:
        "دليل حذر لمعرفة من أين تبدأ في الإقامة، الجذور، التصاريح، المواعيد والاستشارة القانونية.",
      icon: "⚖️",
      quickTitle: "قبل بدء أي إجراء",
      quick: [
        "حدد وضعك: إقامة، لجوء، جذور، عائلة، عمل أو تجديد.",
        "اجمع الوثائق الأساسية قبل طلب الموعد.",
        "إذا توجد آجال أو رفض أو استعجال، اطلب استشارة مهنية.",
      ],
      sections: [
        {
          title: "مواضيع شائعة",
          items: [
            "التسجيل البلدي، الإقامة، الجذور وتصاريح العمل.",
            "لم الشمل، التجديدات والوثائق.",
            "الحقوق الأساسية والوصول إلى الخدمات العمومية.",
          ],
        },
        {
          title: "وثائق معتادة",
          items: [
            "جواز السفر أو وثيقة الهوية.",
            "التسجيل البلدي ووثائق الأسرة إذا لزم الأمر.",
            "عقود، تقارير، قرارات أو إثباتات حسب الحالة.",
          ],
        },
      ],
      resourcesTitle: "موارد قانونية",
      resourcesIntro: "روابط رسمية وموارد للتوجيه.",
      resources: [
        {
          label: "Aholku-Sarea",
          href: commonResources.aholku,
          note: "الشبكة الباسكية للاستشارة القانونية في شؤون الأجانب.",
          type: "oficial",
        },
        {
          label: "المقر الإلكتروني للإدارات العمومية",
          href: commonResources.sede,
          note: "إجراءات الأجانب، متابعة الملفات والخدمات الحكومية.",
          type: "oficial",
        },
        {
          label: "جمعيات الدعم",
          href: "/servicios/asociaciones",
          note: "جهات اجتماعية يمكنها التوجيه أو الإحالة إلى موارد مناسبة.",
          type: "interno",
        },
      ],
      cautionTitle: "مهم",
      cautions: [
        "المعلومات هنا لا تعوض الاستشارة القانونية المهنية.",
        "كل ملف يعتمد على التواريخ والوثائق والوضع الشخصي.",
      ],
      nextTitle: "تحسينات قادمة",
      next: [
        "دلائل حسب الإجراء والوثائق.",
        "قائمة الجهات حسب الإقليم.",
        "تنبيهات حول متى يجب طلب استشارة مهنية.",
      ],
    },
  },
  en: {
    salud: {
      title: "Health and medical care",
      eyebrow: "Osakidetza, health centres, and emergencies",
      intro: "A quick guide to know where to start when you need healthcare in Euskadi.",
      icon: "💗",
      quickTitle: "First steps",
      quick: [
        "Search for your health centre by municipality or address.",
        "Ask about the health card and appointments if you live in Euskadi.",
        "For a life-threatening emergency call 112.",
      ],
      sections: [
        {
          title: "Centres and care",
          items: [
            "Primary care health centres and clinics.",
            "Public hospitals in Araba/Álava, Bizkaia, and Gipuzkoa.",
            "Out-of-hours care points for non-life-threatening urgent care.",
          ],
        },
        {
          title: "Useful documents",
          items: ["ID or passport.", "Municipal registration if requested.", "Health card if you have one."],
        },
      ],
      resourcesTitle: "Important resources",
      resourcesIntro: "Official links to find centres and read more.",
      resources: [
        { label: "Health centres and hospitals search", href: commonResources.osakidetzaSearch, note: "Search by centre, town, address, type, and territory.", type: "oficial" },
        { label: "Osakidetza", href: commonResources.osakidetza, note: "Basque Health Service portal.", type: "oficial" },
        { label: "Municipalities", href: "/ayuntamientos", note: "Local information for nearby procedures and guidance.", type: "interno" },
      ],
      cautionTitle: "Keep in mind",
      cautions: ["Documents may vary depending on your administrative situation.", "For emergencies, call 112 directly."],
      nextTitle: "Planned improvements",
      next: ["Internal search by town.", "Centre cards with map, phone, and opening hours.", "Simple guides on health cards and appointments."],
    },
    vivienda: {
      title: "Housing and rent",
      eyebrow: "Public rent, support, and private search",
      intro: "Resources to start looking for housing, understand public support, and avoid risks in private ads.",
      icon: "🏠",
      quickTitle: "Check first",
      quick: ["Check Etxebide for protected or public rental housing.", "Compare contract, deposit, costs, and municipal registration.", "Do not pay in advance without a contract, visit, or clear identity."],
      sections: [
        { title: "Public resources", items: ["Register as a housing seeker with Etxebide.", "Social or affordable rent programs through Alokabide.", "Rental support such as Gaztelagun when requirements are met."] },
        { title: "Private search", items: ["Full flats, rooms, and shared housing.", "Ad portals to compare prices and areas.", "Keep messages, receipts, and agreed conditions."] },
      ],
      resourcesTitle: "Where to search",
      resourcesIntro: "Official portals and private sites to begin in an organized way.",
      resources: [
        { label: "Etxebide - rent", href: commonResources.etxebide, note: "Official housing information, registration, and requests.", type: "oficial" },
        { label: "Alokabide", href: commonResources.alokabide, note: "Public social and affordable rent programs.", type: "oficial" },
        { label: "idealista - Basque Country", href: commonResources.idealista, note: "Private flat and room ads.", type: "privado" },
        { label: "Fotocasa", href: commonResources.fotocasa, note: "Private rental search.", type: "privado" },
        { label: "pisos.com", href: commonResources.pisos, note: "Private housing ads.", type: "privado" },
      ],
      cautionTitle: "Before signing or paying",
      cautions: ["If the price is very low or you are asked to pay before seeing the home, the ad may be unreliable or a scam.", "Ask clearly whether municipal registration is possible at that address before signing."],
      nextTitle: "Planned improvements",
      next: ["Rental document checklist.", "Guide against common scams.", "Resources by municipality and province."],
    },
    empleo: {
      title: "Work, guidance, and training",
      eyebrow: "Lanbide, job search, and skills",
      intro: "A page to organize job search: registration, guidance, training, and basic preparation.",
      icon: "💼",
      quickTitle: "First steps",
      quick: ["Register or update your Lanbide job demand if you can work.", "Prepare a simple CV with experience, languages, and availability.", "Combine job search with training and language learning."],
      sections: [
        { title: "Where to start", items: ["Lanbide offers information, training, guidance, and job mediation.", "You can check offers, courses, and attention services.", "Municipalities and associations can guide you to local resources."] },
        { title: "Basic preparation", items: ["Updated CV adapted to the job type.", "ID and work permit if applicable.", "Availability, languages, and certifiable training."] },
      ],
      resourcesTitle: "Employment resources",
      resourcesIntro: "Starting points for guidance and training.",
      resources: [
        { label: "Lanbide - general information", href: commonResources.lanbideInfo, note: "Basque Employment Service: guidance, training, offers, and support.", type: "oficial" },
        { label: "Lanbide - training", href: commonResources.lanbideTraining, note: "Training specialities and courses search.", type: "oficial" },
        { label: "Support associations", href: "/servicios/asociaciones", note: "Organizations that can guide on work, rights, and training.", type: "interno" },
      ],
      cautionTitle: "Before accepting a job",
      cautions: ["Ask for clear conditions: schedule, salary, contract, and tasks.", "If you doubt your labour rights, seek guidance before signing."],
      nextTitle: "Planned improvements",
      next: ["Simple CV template.", "Basic labour rights guide.", "Resources by province."],
    },
    educacion: {
      title: "Education, languages, and universities",
      eyebrow: "Adult education, vocational training, recognition, and higher education",
      intro: "Resources for people who want to learn languages, complete studies, recognize degrees, or access university.",
      icon: "🎓",
      quickTitle: "Choose a path",
      quick: ["EPA can help with literacy, Spanish, Basque, and secondary education.", "For employment, check vocational training and Lanbide courses.", "If you studied abroad, check recognition or validation procedures."],
      sections: [
        { title: "Adult education", items: ["Basic education from literacy to secondary graduation.", "Non-formal programs such as Spanish or Basque for foreigners.", "Preparation for access tests and skills improvement."] },
        { title: "University and qualifications", items: ["UPV/EHU is the public university of the Basque Country.", "Deusto and Mondragon Unibertsitatea offer higher education and lifelong learning.", "Recognition depends on the type of studies and procedure."] },
      ],
      resourcesTitle: "Education resources",
      resourcesIntro: "Useful links for options and procedures.",
      resources: [
        { label: "Adult Education EPA", href: commonResources.epa, note: "Official information on EPA and basic education.", type: "oficial" },
        { label: "Foreign non-university studies recognition", href: commonResources.homologacion, note: "General information, documents, and FAQs.", type: "oficial" },
        { label: "UPV/EHU", href: commonResources.upv, note: "Public university of the Basque Country.", type: "oficial" },
        { label: "University of Deusto", href: commonResources.deusto, note: "University with campuses in Bilbao and Donostia-San Sebastián.", type: "privado" },
        { label: "Mondragon Unibertsitatea", href: commonResources.mondragon, note: "Cooperative university with degrees and masters.", type: "privado" },
      ],
      cautionTitle: "Tip",
      cautions: ["Keep certificates, transcripts, and original documents.", "Ask about registration periods because they change by year and centre."],
      nextTitle: "Planned improvements",
      next: ["EPA centre map.", "Recognition guide by study type.", "Language resources by town."],
    },
    legal: {
      title: "Legal guidance and immigration",
      eyebrow: "Basic information and advice resources",
      intro: "A careful guide to know where to start with residence, arraigo, permits, appointments, and legal guidance.",
      icon: "⚖️",
      quickTitle: "Before starting a procedure",
      quick: ["Identify your situation: residence, asylum, arraigo, family, work, or renewal.", "Collect basic documents before booking an appointment.", "If there are deadlines, refusal, or urgency, seek professional advice."],
      sections: [
        { title: "Common topics", items: ["Municipal registration, residence, arraigo, and work permits.", "Family reunification, renewals, and documents.", "Basic rights and access to public services."] },
        { title: "Usual documents", items: ["Passport or ID.", "Municipal registration and family documents if relevant.", "Contracts, reports, decisions, or proof depending on the case."] },
      ],
      resourcesTitle: "Legal resources",
      resourcesIntro: "Official links and guidance resources.",
      resources: [
        { label: "Aholku-Sarea", href: commonResources.aholku, note: "Basque Legal Advice Network for immigration matters.", type: "oficial" },
        { label: "Public Administration e-office", href: commonResources.sede, note: "Immigration procedures, file status, and state services.", type: "oficial" },
        { label: "Support associations", href: "/servicios/asociaciones", note: "Organizations that can guide or refer you to suitable resources.", type: "interno" },
      ],
      cautionTitle: "Important",
      cautions: ["This information does not replace professional legal advice.", "Each case depends on dates, documents, and personal circumstances."],
      nextTitle: "Planned improvements",
      next: ["Guides by procedure and documents.", "Organizations by territory.", "Alerts on when to seek professional advice."],
    },
  },
  eu: {
    salud: {
      title: "Osasuna eta arreta sanitarioa",
      eyebrow: "Osakidetza, osasun zentroak eta larrialdiak",
      intro: "Euskadin osasun arreta behar duzunean nondik hasi jakiteko gida azkarra.",
      icon: "💗",
      quickTitle: "Lehen urratsak",
      quick: ["Bilatu zure osasun zentroa udalerriaren edo helbidearen arabera.", "Galdetu osasun txartelaz eta hitzorduaz Euskadin bizi bazara.", "Larrialdi larri batean deitu 112ra."],
      sections: [
        { title: "Zentroak eta arreta", items: ["Lehen arretako osasun zentroak eta kontsultategiak.", "Araba/Álava, Bizkaia eta Gipuzkoako ospitale publikoak.", "Ordutegitik kanpoko larrialdi arinetarako arreta guneak."] },
        { title: "Dokumentu erabilgarriak", items: ["Nortasun agiria edo pasaportea.", "Errolda agiria eskatzen badizute.", "Osasun txartela badaukazu."] },
      ],
      resourcesTitle: "Baliabide garrantzitsuak",
      resourcesIntro: "Zentroak bilatzeko eta informazioa zabaltzeko esteka ofizialak.",
      resources: [
        { label: "Osasun zentro eta ospitaleen bilatzailea", href: commonResources.osakidetzaSearch, note: "Zentro, udalerri, helbide, mota eta lurraldearen arabera bilatzeko.", type: "oficial" },
        { label: "Osakidetza", href: commonResources.osakidetza, note: "Euskal Osasun Zerbitzuaren ataria.", type: "oficial" },
        { label: "Udalak", href: "/ayuntamientos", note: "Hurbileko izapide eta orientaziorako udal informazioa.", type: "interno" },
      ],
      cautionTitle: "Kontuan izan",
      cautions: ["Dokumentazioa zure egoera administratiboaren arabera alda daiteke.", "Larrialdietan deitu zuzenean 112ra."],
      nextTitle: "Aurreikusitako hobekuntzak",
      next: ["Udalerrikako barne bilatzailea.", "Zentroen fitxak mapa, telefono eta ordutegiekin.", "Osasun txartelari eta hitzorduari buruzko gida errazak."],
    },
    vivienda: {
      title: "Etxebizitza eta alokairua",
      eyebrow: "Alokairu publikoa, laguntzak eta bilaketa pribatua",
      intro: "Etxebizitza bilatzen hasteko, laguntza publikoak ulertzeko eta iragarki pribatuetako arriskuak saihesteko baliabideak.",
      icon: "🏠",
      quickTitle: "Lehenik egiaztatu",
      quick: ["Etxebide kontsultatu etxebizitza babestua edo alokairu publikoa bilatzen baduzu.", "Kontratua, fidantza, gastuak eta erroldatzeko aukera alderatu.", "Ez ordaindu aldez aurretik kontraturik, bisitarik edo identifikazio argirik gabe."],
      sections: [
        { title: "Baliabide publikoak", items: ["Etxebiden etxebizitza eskatzaile gisa izena ematea.", "Alokabideren bidezko alokairu sozial edo eskuragarriko programak.", "Gaztelagun bezalako laguntzak baldintzak betez gero."] },
        { title: "Bilaketa pribatua", items: ["Etxebizitza osoak, gelak eta partekatutako alokairua.", "Prezioak eta guneak alderatzeko iragarki atariak.", "Mezuak, ordainagiriak eta adostutako baldintzak gordetzea."] },
      ],
      resourcesTitle: "Non bilatu",
      resourcesIntro: "Modu antolatuan hasteko atari ofizialak eta web pribatuak.",
      resources: [
        { label: "Etxebide - alokairua", href: commonResources.etxebide, note: "Etxebizitza babestuari, izen-emateari eta eskaerei buruzko informazio ofiziala.", type: "oficial" },
        { label: "Alokabide", href: commonResources.alokabide, note: "Alokairu sozial eta eskuragarriko programa publikoak.", type: "oficial" },
        { label: "idealista - Euskadi", href: commonResources.idealista, note: "Etxebizitza eta gelen iragarki pribatuak.", type: "privado" },
        { label: "Fotocasa", href: commonResources.fotocasa, note: "Alokairu bilaketa pribatua.", type: "privado" },
        { label: "pisos.com", href: commonResources.pisos, note: "Etxebizitza iragarki pribatuak.", type: "privado" },
      ],
      cautionTitle: "Sinatu edo ordaindu aurretik",
      cautions: ["Prezioa oso baxua bada edo etxebizitza ikusi aurretik dirua eskatzen badizute, iragarkia ez fidagarria edo iruzurra izan daiteke.", "Sinatu aurretik galdetu argi helbide horretan erroldatzea posible den."],
      nextTitle: "Aurreikusitako hobekuntzak",
      next: ["Alokatzeko dokumentuen zerrenda.", "Iruzur arrunten aurkako gida.", "Baliabideak udalerri eta lurraldeka."],
    },
    empleo: {
      title: "Lana, orientazioa eta prestakuntza",
      eyebrow: "Lanbide, lan bilaketa eta gaitasunak",
      intro: "Lan bilaketa antolatzeko orria: izen-ematea, orientazioa, prestakuntza eta oinarrizko prestaketa.",
      icon: "💼",
      quickTitle: "Lehen urratsak",
      quick: ["Lan egin badezakezu, eman izena edo eguneratu eskaera Lanbiden.", "Prestatu CV sinple bat esperientzia, hizkuntzak eta erabilgarritasunarekin.", "Lan bilaketa prestakuntzarekin eta hizkuntzekin uztartu."],
      sections: [
        { title: "Non hasi", items: ["Lanbidek informazioa, prestakuntza, orientazioa eta lan bitartekaritza eskaintzen ditu.", "Eskaintzak, ikastaroak eta arreta zerbitzuak kontsulta daitezke.", "Udalek eta elkarteek tokiko baliabideetara bidera zaitzakete."] },
        { title: "Oinarrizko prestaketa", items: ["CV eguneratua eta lan motara egokitua.", "Nortasun agiria eta lan baimena dagokionean.", "Ordutegi erabilgarritasuna, hizkuntzak eta egiaztatutako prestakuntza."] },
      ],
      resourcesTitle: "Lan baliabideak",
      resourcesIntro: "Orientazioa eta prestakuntza bilatzeko abiapuntuak.",
      resources: [
        { label: "Lanbide - informazio orokorra", href: commonResources.lanbideInfo, note: "Euskal Enplegu Zerbitzua: orientazioa, prestakuntza, eskaintzak eta laguntzak.", type: "oficial" },
        { label: "Lanbide - prestakuntza", href: commonResources.lanbideTraining, note: "Prestakuntza espezialitate eta ikastaroen bilatzailea.", type: "oficial" },
        { label: "Laguntza elkarteak", href: "/servicios/asociaciones", note: "Lan, eskubide eta prestakuntzan orientazioa eman dezaketen erakundeak.", type: "interno" },
      ],
      cautionTitle: "Lan bat onartu aurretik",
      cautions: ["Eskatu baldintza argiak: ordutegia, soldata, kontratua eta zereginak.", "Zure lan eskubideei buruz zalantza baduzu, eskatu orientazioa sinatu aurretik."],
      nextTitle: "Aurreikusitako hobekuntzak",
      next: ["CV txantiloi sinplea.", "Oinarrizko lan eskubideen gida.", "Baliabideak lurraldeka."],
    },
    educacion: {
      title: "Hezkuntza, hizkuntzak eta unibertsitateak",
      eyebrow: "Helduen hezkuntza, LH, homologazioa eta goi mailako ikasketak",
      intro: "Hizkuntzak ikasi, ikasketak amaitu, tituluak homologatu edo unibertsitatera sartu nahi dutenentzako baliabideak.",
      icon: "🎓",
      quickTitle: "Aukeratu bidea",
      quick: ["EPAk alfabetatzean, gaztelanian, euskaran eta DBHn lagun dezake.", "Lana bilatzen baduzu, begiratu Lanbideko prestakuntza eta ikastaroak.", "Atzerrian ikasi baduzu, kontsultatu homologazioa edo baliozkotzea."],
      sections: [
        { title: "Helduen hezkuntza", items: ["Alfabetatzetik Bigarren Hezkuntzako titulura arteko oinarrizko hezkuntza.", "Atzerritarrentzako gaztelania edo euskara bezalako programa ez arautuak.", "Sarbide probetarako prestaketa eta gaitasun hobekuntza."] },
        { title: "Unibertsitatea eta tituluak", items: ["UPV/EHU Euskal Herriko unibertsitate publikoa da.", "Deustuk eta Mondragon Unibertsitateak goi mailako ikasketak eta etengabeko prestakuntza eskaintzen dituzte.", "Homologazioa ikasketa motaren eta izapidearen araberakoa da."] },
      ],
      resourcesTitle: "Hezkuntza baliabideak",
      resourcesIntro: "Aukerak eta izapideak aztertzeko esteka erabilgarriak.",
      resources: [
        { label: "Helduen Hezkuntza EPA", href: commonResources.epa, note: "EPAri eta oinarrizko prestakuntzari buruzko informazio ofiziala.", type: "oficial" },
        { label: "Atzerriko ikasketa ez-unibertsitarioen homologazioa", href: commonResources.homologacion, note: "Informazio orokorra, dokumentuak eta galderak.", type: "oficial" },
        { label: "UPV/EHU", href: commonResources.upv, note: "Euskal Herriko unibertsitate publikoa.", type: "oficial" },
        { label: "Deustuko Unibertsitatea", href: commonResources.deusto, note: "Bilbon eta Donostian campusak dituen unibertsitatea.", type: "privado" },
        { label: "Mondragon Unibertsitatea", href: commonResources.mondragon, note: "Graduak, masterrak eta etengabeko prestakuntza eskaintzen dituen unibertsitate kooperatiboa.", type: "privado" },
      ],
      cautionTitle: "Aholkua",
      cautions: ["Gorde ziurtagiriak, notak eta jatorrizko dokumentuak.", "Galdetu matrikula epeei buruz, urtez eta zentroz alda daitezkeelako."],
      nextTitle: "Aurreikusitako hobekuntzak",
      next: ["EPA zentroen mapa.", "Ikasketa motaren araberako homologazio gida.", "Hizkuntza baliabideak udalerrika."],
    },
    legal: {
      title: "Lege orientazioa eta atzerritartasuna",
      eyebrow: "Oinarrizko informazioa eta aholkularitza baliabideak",
      intro: "Egoitza, errotzea, baimenak, hitzorduak eta lege orientazioarekin nondik hasi jakiteko gida zaindua.",
      icon: "⚖️",
      quickTitle: "Izapide bat hasi aurretik",
      quick: ["Identifikatu zure egoera: egoitza, asiloa, errotzea, familia, lana edo berritzea.", "Bildu oinarrizko dokumentuak hitzordua eskatu aurretik.", "Epeak, ukapena edo premia badaude, eskatu aholkularitza profesionala."],
      sections: [
        { title: "Ohiko gaiak", items: ["Errolda, egoitza, errotzea eta lan baimenak.", "Familia berriz elkartzea, berritzeak eta dokumentazioa.", "Oinarrizko eskubideak eta zerbitzu publikoetarako sarbidea."] },
        { title: "Ohiko dokumentuak", items: ["Pasaportea edo nortasun agiria.", "Errolda eta familia dokumentuak dagokionean.", "Kontratuak, txostenak, ebazpenak edo frogagiriak kasuaren arabera."] },
      ],
      resourcesTitle: "Lege baliabideak",
      resourcesIntro: "Esteka ofizialak eta orientazio baliabideak.",
      resources: [
        { label: "Aholku-Sarea", href: commonResources.aholku, note: "Atzerritartasun arloko Arreta Juridikorako Euskal Sarea.", type: "oficial" },
        { label: "Administrazio Publikoen egoitza elektronikoa", href: commonResources.sede, note: "Atzerritartasun izapideak, espedienteak eta estatuko zerbitzuak.", type: "oficial" },
        { label: "Laguntza elkarteak", href: "/servicios/asociaciones", note: "Orientazioa edo baliabide egokietara bideratzea eskain dezaketen erakundeak.", type: "interno" },
      ],
      cautionTitle: "Garrantzitsua",
      cautions: ["Informazio honek ez du ordezkatzen aholkularitza juridiko profesionala.", "Espediente bakoitza dataren, dokumentuen eta egoera pertsonalaren araberakoa da."],
      nextTitle: "Aurreikusitako hobekuntzak",
      next: ["Izapide eta dokumentuen araberako gidak.", "Erakundeak lurraldeka.", "Aholkularitza profesionala noiz eskatu jakiteko abisuak."],
    },
  },
};

function isInternal(href: string) {
  return href.startsWith("/");
}

export default function ServiceInfoPage({ serviceId }: { serviceId: string }) {
  const { locale, t } = useI18n();
  const activeLocale = (servicePages[locale as Locale] ? locale : "es") as Locale;
  const ui = uiText[activeLocale];
  const page = servicePages[activeLocale][serviceId as ServiceId];

  if (!page) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="mb-6 text-lg font-semibold text-amber-900">{ui.pageNotFound}</p>
          <Link to="/servicios" className="inline-flex rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-800">
            {ui.backToServices}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold">
            <Link to="/servicios" className="text-emerald-700 hover:underline">
              {ui.backToServices}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">{page.eyebrow}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-xl shadow-sm">
                  {page.icon}
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

          <ServicePagesNav activeId={serviceId as ServiceId} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-5 text-2xl font-black text-slate-950">{page.quickTitle}</h2>
          <div className="grid gap-4 md:grid-cols-3">
          {page.quick.map((item, index) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-sm font-black text-emerald-700">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="m-0 text-lg font-semibold leading-relaxed text-slate-700">
                {item}
              </p>
            </div>
          ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">{section.title}</h2>
              <ul className="mt-5 space-y-3 p-0">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-lg leading-relaxed text-slate-700">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex rounded-md bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-800">
                {t("nav_forum")}
              </div>
              <h2 className="text-2xl font-black text-slate-950">{ui.communityTitle}</h2>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
                {ui.communityText}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/foro"
                className="rounded-lg bg-emerald-700 px-5 py-3 text-center font-black text-white no-underline transition hover:bg-emerald-800"
              >
                {ui.askMigrants}
              </Link>
              <Link
                to="/users/new"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center font-black text-slate-800 no-underline transition hover:border-emerald-300 hover:text-emerald-800"
              >
                {ui.createAccount}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <div className="text-sm font-black uppercase tracking-wide text-emerald-700">
              {page.resourcesTitle}
            </div>
            <h2 className="mt-2 max-w-4xl text-3xl font-black text-slate-950">
              {page.resourcesIntro}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {page.resources.map((resource) => {
              const className =
                "group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 text-decoration-none shadow-sm transition hover:border-emerald-300 hover:shadow-md";
              const body = (
                <>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-600">
                      {ui.resourceType[resource.type]}
                    </span>
                    <span className="text-sm font-black text-emerald-700">{ui.openResource}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950">{resource.label}</h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">
                    {resource.note}
                  </p>
                </>
              );

              return isInternal(resource.href) ? (
                <Link key={resource.href} to={resource.href} className={className}>
                  {body}
                </Link>
              ) : (
                <a
                  key={resource.href}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                >
                  {body}
                </a>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-lg border border-amber-200 bg-amber-50 p-7">
            <h2 className="text-2xl font-black text-slate-950">{page.cautionTitle}</h2>
            <div className="mt-5 space-y-3">
              {page.cautions.map((item) => (
                <p key={item} className="rounded-lg bg-white p-4 text-lg leading-relaxed text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-7">
            <h2 className="text-2xl font-black text-slate-950">{page.nextTitle}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {page.next.map((item) => (
                <div key={item} className="rounded-lg bg-white p-5 text-base font-bold leading-relaxed text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
