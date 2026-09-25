import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";
import {
  forumService,
  type ForumMessage,
  type ForumPost,
  type ForumPostType,
} from "../services/forum.service";
import { usersService } from "../services/users.service";

type Locale = "eu" | "es" | "en" | "ar";

type ForumText = {
  eyebrow: string;
  title: string;
  intro: string;
  profileTitle: string;
  profileIntro: string;
  nameLabel: string;
  cityLabel: string;
  saveProfile: string;
  profileSaved: string;
  loginTitle: string;
  loginIntro: string;
  passwordLabel: string;
  login: string;
  logout: string;
  registerLink: string;
  signedInAs: string;
  phoneNotVerified: string;
  phoneCodeLabel: string;
  phoneCodeSent: string;
  verifyPhone: string;
  resendCode: string;
  phoneVerified: string;
  composerTitle: string;
  typeLabel: string;
  announcement: string;
  question: string;
  postTitleLabel: string;
  categoryLabel: string;
  bodyLabel: string;
  publish: string;
  allPosts: string;
  mySpace: string;
  filterAll: string;
  searchPlaceholder: string;
  comments: string;
  addComment: string;
  commentPlaceholder: string;
  send: string;
  chatTitle: string;
  chatIntro: string;
  chatPlaceholder: string;
  emptyPosts: string;
  emptyMine: string;
  emptyChat: string;
  completeProfile: string;
  loadError: string;
  postCreated: string;
  commentCreated: string;
  messageCreated: string;
  communityRulesTitle: string;
  communityRules: string[];
  otherPages: string;
};

const text: Record<Locale, ForumText> = {
  es: {
    eyebrow: "Comunidad",
    title: "Un espacio para conectar, preguntar y compartir",
    intro:
      "Conecta con otras personas migrantes en Euskadi, comparte información útil, publica tus dudas y encuentra respuestas de la comunidad.",
    profileTitle: "Mi espacio",
    profileIntro:
      "Tu espacio comunitario para participar, publicar y conversar.",
    nameLabel: "Nombre visible",
    cityLabel: "Municipio o zona",
    saveProfile: "Guardar espacio",
    profileSaved: "Espacio guardado",
    loginTitle: "Bienvenido de nuevo",
    loginIntro:
      "Inicia sesión para publicar, comentar y participar en el chat.",
    passwordLabel: "Contraseña",
    login: "Entrar",
    logout: "Salir",
    registerLink: "Crear cuenta",
    signedInAs: "Sesión iniciada como",
    phoneNotVerified:
      "Verifica tu teléfono para publicar, comentar y utilizar el chat.",
    phoneCodeLabel: "Código SMS",
    phoneCodeSent: "Código enviado.",
    verifyPhone: "Verificar teléfono",
    resendCode: "Reenviar código",
    phoneVerified: "Teléfono verificado",
    composerTitle: "Crear publicación",
    typeLabel: "Tipo de publicación",
    announcement: "Anuncio",
    question: "Consulta",
    postTitleLabel: "Título",
    categoryLabel: "Tema",
    bodyLabel: "Contenido",
    publish: "Publicar",
    allPosts: "Todas",
    mySpace: "Mi espacio",
    filterAll: "Todos los tipos",
    searchPlaceholder: "Buscar en la comunidad...",
    comments: "comentarios",
    addComment: "Comentar",
    commentPlaceholder: "Escribe una respuesta útil...",
    send: "Enviar",
    chatTitle: "Chat comunitario",
    chatIntro:
      "Un espacio para saludar, pedir orientación rápida y conectar.",
    chatPlaceholder: "Escribe un mensaje...",
    emptyPosts: "Todavía no hay publicaciones con estos filtros.",
    emptyMine: "Cuando publiques algo, aparecerá aquí.",
    emptyChat: "Todavía no hay mensajes en el chat.",
    completeProfile:
      "Inicia sesión y verifica tu teléfono antes de participar.",
    loadError: "No se pudo cargar el foro.",
    postCreated: "Publicación creada.",
    commentCreated: "Comentario añadido.",
    messageCreated: "Mensaje enviado.",
    communityRulesTitle: "Una comunidad que cuidamos entre todos",
    communityRules: [
      "Comparte información útil y evita datos personales sensibles.",
      "Respeta las experiencias diferentes y responde con calma.",
      "Para asuntos legales urgentes, busca orientación profesional.",
    ],
    otherPages: "También puedes consultar",
  },

  ar: {
    eyebrow: "المجتمع",
    title: "مساحة للتواصل وطرح الأسئلة وتبادل الخبرات",
    intro:
      "تواصل مع المهاجرين في إقليم الباسك، شارك المعلومات المفيدة، اطرح أسئلتك واستفد من تجارب المجتمع.",
    profileTitle: "مساحتي",
    profileIntro:
      "مساحتك الخاصة للمشاركة والنشر والتواصل مع المجتمع.",
    nameLabel: "الاسم الظاهر",
    cityLabel: "البلدية أو المنطقة",
    saveProfile: "حفظ المساحة",
    profileSaved: "تم حفظ المساحة",
    loginTitle: "مرحباً بعودتك",
    loginIntro:
      "سجل الدخول للنشر والتعليق والمشاركة في الشات.",
    passwordLabel: "كلمة السر",
    login: "دخول",
    logout: "خروج",
    registerLink: "إنشاء حساب",
    signedInAs: "تم الدخول باسم",
    phoneNotVerified:
      "تحقق من هاتفك حتى تتمكن من النشر والتعليق واستعمال الشات.",
    phoneCodeLabel: "كود SMS",
    phoneCodeSent: "تم إرسال الكود.",
    verifyPhone: "تحقق من الهاتف",
    resendCode: "إعادة إرسال الكود",
    phoneVerified: "الهاتف موثق",
    composerTitle: "إنشاء منشور",
    typeLabel: "نوع المنشور",
    announcement: "إعلان",
    question: "استشكال",
    postTitleLabel: "العنوان",
    categoryLabel: "الموضوع",
    bodyLabel: "المحتوى",
    publish: "نشر",
    allPosts: "الكل",
    mySpace: "مساحتي",
    filterAll: "كل الأنواع",
    searchPlaceholder: "ابحث داخل المجتمع...",
    comments: "تعليقات",
    addComment: "تعليق",
    commentPlaceholder: "اكتب رداً مفيداً...",
    send: "إرسال",
    chatTitle: "الشات المجتمعي",
    chatIntro:
      "مساحة للتعارف وطلب التوجيه السريع والتواصل.",
    chatPlaceholder: "اكتب رسالة...",
    emptyPosts: "لا توجد منشورات بهذه الفلاتر بعد.",
    emptyMine: "عندما تنشر شيئاً سيظهر هنا.",
    emptyChat: "لا توجد رسائل في الشات بعد.",
    completeProfile:
      "سجل الدخول وتحقق من هاتفك قبل المشاركة.",
    loadError: "تعذر تحميل المنتدى.",
    postCreated: "تم إنشاء المنشور.",
    commentCreated: "تمت إضافة التعليق.",
    messageCreated: "تم إرسال الرسالة.",
    communityRulesTitle: "مجتمع نهتم به جميعاً",
    communityRules: [
      "شارك المعلومات المفيدة وتجنب البيانات الشخصية الحساسة.",
      "احترم اختلاف التجارب ورد بهدوء.",
      "في القضايا القانونية العاجلة، اطلب توجيهاً مهنياً.",
    ],
    otherPages: "يمكنك أيضاً الاطلاع على",
  },

  en: {
    eyebrow: "Community",
    title: "A space to connect, ask and share",
    intro:
      "Connect with other migrants in Euskadi, share useful information, ask questions and learn from the community.",
    profileTitle: "My space",
    profileIntro:
      "Your community space to participate, publish and connect.",
    nameLabel: "Display name",
    cityLabel: "Municipality or area",
    saveProfile: "Save space",
    profileSaved: "Space saved",
    loginTitle: "Welcome back",
    loginIntro:
      "Sign in to publish, comment and participate in the chat.",
    passwordLabel: "Password",
    login: "Sign in",
    logout: "Log out",
    registerLink: "Create account",
    signedInAs: "Signed in as",
    phoneNotVerified:
      "Verify your phone to publish, comment and use chat.",
    phoneCodeLabel: "SMS code",
    phoneCodeSent: "Code sent.",
    verifyPhone: "Verify phone",
    resendCode: "Resend code",
    phoneVerified: "Phone verified",
    composerTitle: "Create post",
    typeLabel: "Post type",
    announcement: "Announcement",
    question: "Question",
    postTitleLabel: "Title",
    categoryLabel: "Topic",
    bodyLabel: "Content",
    publish: "Publish",
    allPosts: "All",
    mySpace: "My space",
    filterAll: "All types",
    searchPlaceholder: "Search the community...",
    comments: "comments",
    addComment: "Comment",
    commentPlaceholder: "Write a helpful reply...",
    send: "Send",
    chatTitle: "Community chat",
    chatIntro:
      "Say hello, ask for quick guidance or connect with others.",
    chatPlaceholder: "Write a message...",
    emptyPosts: "There are no posts with these filters yet.",
    emptyMine: "When you publish something, it will appear here.",
    emptyChat: "There are no chat messages yet.",
    completeProfile:
      "Sign in and verify your phone before participating.",
    loadError: "The forum could not be loaded.",
    postCreated: "Post created.",
    commentCreated: "Comment added.",
    messageCreated: "Message sent.",
    communityRulesTitle: "A community we care for together",
    communityRules: [
      "Share useful information and avoid sensitive personal details.",
      "Respect different experiences and reply calmly.",
      "For urgent legal matters, seek professional guidance.",
    ],
    otherPages: "You may also explore",
  },

  eu: {
    eyebrow: "Komunitatea",
    title: "Konektatzeko, galdetzeko eta partekatzeko espazioa",
    intro:
      "Euskadiko beste migratzaileekin konektatu, informazio erabilgarria partekatu eta zure galderak komunitatearekin partekatu.",
    profileTitle: "Nire espazioa",
    profileIntro:
      "Zure komunitateko espazioa parte hartzeko, argitaratzeko eta konektatzeko.",
    nameLabel: "Bistaratzeko izena",
    cityLabel: "Udalerria edo eremua",
    saveProfile: "Gorde espazioa",
    profileSaved: "Espazioa gordeta",
    loginTitle: "Ongi etorri berriro",
    loginIntro:
      "Hasi saioa argitaratzeko, iruzkintzeko eta txatean parte hartzeko.",
    passwordLabel: "Pasahitza",
    login: "Sartu",
    logout: "Irten",
    registerLink: "Sortu kontua",
    signedInAs: "Saioa hasita",
    phoneNotVerified:
      "Egiaztatu telefonoa argitaratzeko, iruzkintzeko eta txata erabiltzeko.",
    phoneCodeLabel: "SMS kodea",
    phoneCodeSent: "Kodea bidali da.",
    verifyPhone: "Egiaztatu telefonoa",
    resendCode: "Birbidali kodea",
    phoneVerified: "Telefonoa egiaztatuta",
    composerTitle: "Argitalpena sortu",
    typeLabel: "Argitalpen mota",
    announcement: "Iragarkia",
    question: "Galdera",
    postTitleLabel: "Izenburua",
    categoryLabel: "Gaia",
    bodyLabel: "Edukia",
    publish: "Argitaratu",
    allPosts: "Guztiak",
    mySpace: "Nire espazioa",
    filterAll: "Mota guztiak",
    searchPlaceholder: "Bilatu komunitatean...",
    comments: "iruzkin",
    addComment: "Iruzkindu",
    commentPlaceholder: "Idatzi erantzun erabilgarria...",
    send: "Bidali",
    chatTitle: "Komunitateko txata",
    chatIntro:
      "Agurtzeko, orientazio azkarra eskatzeko edo konektatzeko.",
    chatPlaceholder: "Idatzi mezua...",
    emptyPosts: "Oraindik ez dago argitalpenik iragazki hauekin.",
    emptyMine: "Zerbait argitaratzen duzunean, hemen agertuko da.",
    emptyChat: "Oraindik ez dago txateko mezurik.",
    completeProfile:
      "Hasi saioa eta egiaztatu telefonoa parte hartu aurretik.",
    loadError: "Ezin izan da foroa kargatu.",
    postCreated: "Argitalpena sortu da.",
    commentCreated: "Iruzkina gehitu da.",
    messageCreated: "Mezua bidali da.",
    communityRulesTitle: "Elkar zaintzen dugun komunitatea",
    communityRules: [
      "Partekatu informazio erabilgarria eta saihestu datu pertsonal sentikorrak.",
      "Errespetatu esperientzia desberdinak eta erantzun lasai.",
      "Premiazko gai juridikoetarako, bilatu orientazio profesionala.",
    ],
    otherPages: "Beste orriak",
  },
};

const quickLinks = [
  {
    labelKey: "f_health",
    to: "/servicios/salud",
    icon: "♥",
  },
  {
    labelKey: "f_housing",
    to: "/servicios/vivienda",
    icon: "⌂",
  },
  {
    labelKey: "f_municipalities",
    to: "/ayuntamientos",
    icon: "▦",
  },
  {
    labelKey: "f_charities",
    to: "/servicios/asociaciones",
    icon: "♡",
  },
];

const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function ForoMigrantesPage() {
  const { locale, t } = useI18n();

  const {
    currentUser,
    signIn,
    signOut,
    refreshSession,
  } = useAuth();

  const copy =
    text[(locale as Locale) in text ? (locale as Locale) : "es"];

  const isArabic = locale === "ar";

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [phoneCode, setPhoneCode] = useState("");

  const [activeView, setActiveView] = useState<"all" | "mine">("all");

  const [typeFilter, setTypeFilter] =
    useState<ForumPostType | "all">("all");

  const [search, setSearch] = useState("");

  const [expandedPostId, setExpandedPostId] =
    useState<string | null>(null);

  const [commentDrafts, setCommentDrafts] =
    useState<Record<string, string>>({});

  const [chatDraft, setChatDraft] = useState("");

  const [showComposer, setShowComposer] = useState(false);

  const [postDraft, setPostDraft] = useState({
    type: "question" as ForumPostType,
    title: "",
    category: "",
    body: "",
  });

  const canParticipate = Boolean(
    currentUser &&
      (currentUser.phoneVerified || currentUser.isVerified)
  );

  const loadForum = async () => {
    setError("");

    try {
      const [postsData, messagesData] = await Promise.all([
        forumService.listPosts({
          type: typeFilter,
          q: search.trim() || undefined,
        }),
        forumService.listMessages(),
      ]);

      setPosts(Array.isArray(postsData) ? postsData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (err: any) {
      setError(String(err?.message || copy.loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadForum();
  }, [typeFilter, search]);

  const visiblePosts = useMemo(() => {
    if (activeView === "mine") {
      return posts.filter(
        (post) => post.authorUserId === currentUser?._id
      );
    }

    return posts;
  }, [activeView, currentUser?._id, posts]);

  const login = async (event: FormEvent) => {
    event.preventDefault();

    await signIn(loginData);

    setLoginData({
      email: "",
      password: "",
    });

    setNotice(copy.profileSaved);
  };

  const logout = () => {
    void signOut();
    setActiveView("all");
  };

  const createPost = async (event: FormEvent) => {
    event.preventDefault();

    if (!canParticipate) {
      setNotice(copy.completeProfile);
      return;
    }

    const created = await forumService.createPost({
      userId: currentUser!._id,
      type: postDraft.type,
      title: postDraft.title,
      category: postDraft.category,
      body: postDraft.body,
    });

    setPosts((current) => [created, ...current]);

    setPostDraft({
      type: "question",
      title: "",
      category: "",
      body: "",
    });

    setActiveView("mine");
    setShowComposer(false);
    setNotice(copy.postCreated);
  };

  const addComment = async (postId: string) => {
    if (!canParticipate) {
      setNotice(copy.completeProfile);
      return;
    }

    const body = commentDrafts[postId]?.trim();

    if (!body) return;

    const updated = await forumService.addComment(postId, {
      userId: currentUser!._id,
      body,
    });

    setPosts((current) =>
      current.map((post) =>
        post._id === updated._id ? updated : post
      )
    );

    setCommentDrafts((current) => ({
      ...current,
      [postId]: "",
    }));

    setNotice(copy.commentCreated);
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();

    if (!canParticipate) {
      setNotice(copy.completeProfile);
      return;
    }

    const body = chatDraft.trim();

    if (!body) return;

    const created = await forumService.createMessage({
      userId: currentUser!._id,
      body,
    });

    setMessages((current) =>
      [...current, created].slice(-80)
    );

    setChatDraft("");
    setNotice(copy.messageCreated);
  };

  const verifyForumPhone = async () => {
    if (!currentUser) return;

    await usersService.verifyPhone(
      currentUser._id,
      phoneCode
    );

    await refreshSession();

    setPhoneCode("");
    setNotice(copy.phoneVerified);
  };

  const resendForumCode = async () => {
    if (!currentUser) return;

    await usersService.sendPhoneCode(currentUser._id);

    setNotice(copy.phoneCodeSent);
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fafbfc] text-slate-950"
    >
     {/* =========================================================
    HERO — Balanced Wix Style
========================================================= */}
<section className="relative overflow-hidden border-b border-slate-200/70 bg-white">
  {/* Background decoration */}
  <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
  <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">

      {/* =====================================================
          LEFT — TEXT
      ===================================================== */}
      <div className="flex flex-col justify-center lg:pe-4">

        {/* Eyebrow */}
        <div className="mb-5 w-fit inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>{copy.eyebrow}</span>
        </div>

        {/* Title */}
        <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
          {copy.title}
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {copy.intro}
        </p>

        {/* Buttons */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              if (currentUser) {
                setShowComposer(true);

                setTimeout(() => {
                  document
                    .getElementById("forum-content")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }, 50);
              } else {
                window.location.href = "/users/new";
              }
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3.5 font-bold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            {currentUser
              ? copy.composerTitle
              : copy.registerLink}

            <span className="ms-2 text-lg">
              →
            </span>
          </button>

          {!currentUser && (
            <Link
              to="/users/login"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-800 no-underline shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50"
            >
              {copy.login}
            </Link>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-7 flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 no-underline shadow-sm transition duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span className="text-emerald-600">
                {link.icon}
              </span>

              <span>
                {t(link.labelKey)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* =====================================================
          RIGHT — IMAGE / COMMUNITY CARD
      ===================================================== */}
      <div className="relative lg:ps-2">

        {/* Small decorative shape */}
        <div className="pointer-events-none absolute -right-3 -top-3 z-0 h-20 w-20 rounded-3xl bg-emerald-100/70" />

        <div className="relative z-10 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.30)]">

          {/* Image */}
          <div className="relative h-64 overflow-hidden sm:h-72">
            <img
              src="/images/registration-migrant-travel-hero.png"
              alt=""
              className="h-full w-full object-cover"
              style={{
                objectPosition: "center 35%",
              }}
            />

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />

            {/* Floating badge */}
            <div className="absolute bottom-4 start-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 font-black text-emerald-600">
                  ✓
                </div>

                <div>
                  <p className="m-0 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">
                    Zubia
                  </p>

                  <p className="m-0 mt-0.5 text-sm font-bold text-slate-900">
                    {copy.communityRulesTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community rules */}
          <div className="p-5 sm:p-6">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  Zubia
                </p>

                <h2 className="m-0 mt-1 text-lg font-black text-slate-950">
                  {copy.communityRulesTitle}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-black text-emerald-600">
                ✓
              </div>
            </div>

            <div className="grid gap-2">
              {copy.communityRules.map((rule, index) => (
                <div
                  key={rule}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-black text-emerald-600 shadow-sm">
                    0{index + 1}
                  </span>

                  <p className="m-0 text-xs font-medium leading-5 text-slate-600">
                    {rule}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div
        id="forum-content"
        className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        {/* Notices */}
        {notice && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                ✓
              </span>

              <span className="font-semibold">
                {notice}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="rounded-lg px-2 py-1 text-xl text-emerald-700 transition hover:bg-emerald-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {copy.loadError}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* =====================================================
              POSTS
          ===================================================== */}
          <section className="min-w-0">
            {/* Toolbar */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {copy.allPosts}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {copy.intro}
                    </p>
                  </div>

                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => setShowComposer(true)}
                      className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                    >
                      + {copy.composerTitle}
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-[auto_180px_1fr]">
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setActiveView("all")}
                      className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                        activeView === "all"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {copy.allPosts}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveView("mine")}
                      className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                        activeView === "mine"
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {copy.mySpace}
                    </button>
                  </div>

                  <select
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(
                        event.target.value as
                          | ForumPostType
                          | "all"
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="all">
                      {copy.filterAll}
                    </option>

                    <option value="question">
                      {copy.question}
                    </option>

                    <option value="announcement">
                      {copy.announcement}
                    </option>
                  </select>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-slate-400">
                      ⌕
                    </span>

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder={copy.searchPlaceholder}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-10 pe-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  {t("loading")}
                </p>
              </div>
            ) : visiblePosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  ✦
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  {activeView === "mine"
                    ? copy.emptyMine
                    : copy.emptyPosts}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {copy.intro}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visiblePosts.map((post) => (
                  <article
                    key={post._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 sm:p-6"
                  >
                    {/* Post header */}
                    <div className="flex gap-4">
                      <div className="hidden shrink-0 sm:flex">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black ${
                            post.type === "announcement"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {post.type === "announcement"
                            ? "!"
                            : "?"}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              post.type === "announcement"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {post.type === "announcement"
                              ? copy.announcement
                              : copy.question}
                          </span>

                          {post.category && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                              {post.category}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-black leading-snug text-slate-950 transition group-hover:text-emerald-700 sm:text-2xl">
                          {post.title}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-400">
                          <span className="font-bold text-slate-600">
                            {post.authorName}
                          </span>

                          {post.authorCity && (
                            <>
                              <span>·</span>
                              <span>{post.authorCity}</span>
                            </>
                          )}

                          <span>·</span>

                          <span>
                            {formatDate(
                              post.createdAt,
                              locale
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="mt-5">
                      <p className="whitespace-pre-line text-[15px] leading-7 text-slate-600">
                        {post.body}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPostId((current) =>
                            current === post._id
                              ? null
                              : post._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <span>♡</span>
                        {post.comments.length.toLocaleString(
                          locale
                        )}{" "}
                        {copy.comments}
                      </button>

                      <span className="text-xs font-semibold text-slate-400">
                        {post.type === "announcement"
                          ? copy.announcement
                          : copy.question}
                      </span>
                    </div>

                    {/* Comments */}
                    {expandedPostId === post._id && (
                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 sm:p-5">
                        <div className="space-y-3">
                          {post.comments.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              {copy.commentPlaceholder}
                            </p>
                          ) : (
                            post.comments.map((comment) => (
                              <div
                                key={
                                  comment._id ||
                                  `${comment.authorName}-${comment.createdAt}`
                                }
                                className="rounded-xl border border-slate-200 bg-white p-4"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="m-0 text-sm font-bold text-slate-800">
                                      {comment.authorName}
                                      {comment.authorCity
                                        ? ` · ${comment.authorCity}`
                                        : ""}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                      {formatDate(
                                        comment.createdAt,
                                        locale
                                      )}
                                    </p>
                                  </div>

                                  <span className="text-emerald-500">
                                    ●
                                  </span>
                                </div>

                                <p className="mb-0 mt-3 text-sm leading-6 text-slate-600">
                                  {comment.body}
                                </p>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <input
                            value={
                              commentDrafts[post._id] || ""
                            }
                            onChange={(event) =>
                              setCommentDrafts(
                                (current) => ({
                                  ...current,
                                  [post._id]:
                                    event.target.value,
                                })
                              )
                            }
                            placeholder={
                              copy.commentPlaceholder
                            }
                            maxLength={1200}
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              void addComment(post._id)
                            }
                            disabled={!canParticipate}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {copy.addComment}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* =====================================================
              SIDEBAR
          ===================================================== */}
          <aside className="space-y-5">
            {/* Account */}
            {currentUser ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {copy.profileTitle}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-950">
                      {currentUser.displayName ||
                        currentUser.fullName}
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 font-black text-white">
                    {(currentUser.displayName ||
                      currentUser.fullName ||
                      "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {currentUser.email}
                </p>

                {currentUser.municipality && (
                  <p className="mt-1 text-sm text-slate-500">
                    {currentUser.municipality}
                  </p>
                )}

                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                      canParticipate
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        canParticipate
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }`}
                    />

                    {canParticipate
                      ? copy.phoneVerified
                      : currentUser.status}
                  </span>
                </div>

                {!canParticipate && (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm leading-6 text-amber-800">
                      {copy.phoneNotVerified}
                    </p>

                    <label className="mt-3 block text-xs font-bold text-amber-900">
                      {copy.phoneCodeLabel}
                    </label>

                    <input
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={phoneCode}
                      onChange={(event) =>
                        setPhoneCode(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          void verifyForumPhone()
                        }
                        className="rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                      >
                        {copy.verifyPhone}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void resendForumCode()
                        }
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        {copy.resendCode}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={logout}
                  className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  {copy.logout}
                </button>
              </div>
            ) : (
              <form
                onSubmit={login}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Zubia
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    {copy.loginTitle}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {copy.loginIntro}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {t("email")}
                    </label>

                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(event) =>
                        setLoginData((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {copy.passwordLabel}
                    </label>

                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(event) =>
                        setLoginData((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-slate-800"
                >
                  {copy.login}
                </button>

                <Link
                  to="/users/new"
                  className="mt-2 block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 no-underline transition hover:bg-slate-50"
                >
                  {copy.registerLink}
                </Link>
              </form>
            )}

            {/* Chat */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  ●
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    {copy.chatTitle}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {copy.chatIntro}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex max-h-80 flex-col gap-2 overflow-auto rounded-xl bg-slate-50 p-3">
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">
                    {copy.emptyChat}
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className="rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {message.authorName}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {formatDate(
                            message.createdAt,
                            locale
                          )}
                        </span>
                      </div>

                      {message.authorCity && (
                        <div className="mt-1 text-[10px] text-slate-400">
                          {message.authorCity}
                        </div>
                      )}

                      <p className="mb-0 mt-2 text-sm leading-6 text-slate-600">
                        {message.body}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={sendMessage}
                className="mt-3 flex gap-2"
              >
                <input
                  value={chatDraft}
                  onChange={(event) =>
                    setChatDraft(event.target.value)
                  }
                  placeholder={copy.chatPlaceholder}
                  maxLength={1000}
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />

                <button
                  type="submit"
                  disabled={!canParticipate}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copy.send}
                </button>
              </form>
            </div>
          </aside>
        </div>

        {/* =======================================================
            CREATE POST MODAL
        ======================================================= */}
        {showComposer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowComposer(false);
              }
            }}
          >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Comunidad
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {copy.composerTitle}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Comparte algo que pueda ser útil para otras personas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {!canParticipate ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="font-bold text-amber-900">
                    {copy.completeProfile}
                  </p>

                  {!currentUser && (
                    <Link
                      to="/users/login"
                      onClick={() => setShowComposer(false)}
                      className="mt-4 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white no-underline"
                    >
                      {copy.login}
                    </Link>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={createPost}
                  className="mt-6"
                >
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {copy.typeLabel}
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPostDraft((current) => ({
                            ...current,
                            type: "question",
                          }))
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                          postDraft.type === "question"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        ? {copy.question}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPostDraft((current) => ({
                            ...current,
                            type: "announcement",
                          }))
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                          postDraft.type === "announcement"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        ! {copy.announcement}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {copy.postTitleLabel}
                    </label>

                    <input
                      value={postDraft.title}
                      onChange={(event) =>
                        setPostDraft((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      maxLength={160}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {copy.categoryLabel}
                    </label>

                    <input
                      value={postDraft.category}
                      onChange={(event) =>
                        setPostDraft((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      maxLength={80}
                      placeholder={t("nav_services")}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      {copy.bodyLabel}
                    </label>

                    <textarea
                      rows={6}
                      value={postDraft.body}
                      onChange={(event) =>
                        setPostDraft((current) => ({
                          ...current,
                          body: event.target.value,
                        }))
                      }
                      maxLength={4000}
                      required
                      className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setShowComposer(false)
                      }
                      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      ×
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      {copy.publish}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* =======================================================
            COMMUNITY CARE
        ======================================================= */}
        <section className="mt-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Zubia · Comunidad
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                {copy.communityRulesTitle}
              </h2>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {copy.communityRules.map((rule, index) => (
                <div
                  key={rule}
                  className="rounded-2xl bg-slate-50 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-emerald-600 shadow-sm">
                    0{index + 1}
                  </div>

                  <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =======================================================
            QUICK LINKS
        ======================================================= */}
        <section className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group rounded-2xl border border-slate-200 bg-white p-4 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                    {link.icon}
                  </div>

                  <div>
                    <p className="m-0 text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                      {t(link.labelKey)}
                    </p>

                    <p className="m-0 mt-1 text-xs text-slate-400">
                      {copy.otherPages}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}