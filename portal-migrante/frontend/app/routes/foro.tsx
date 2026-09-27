import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";
import CommunityAccountNav from "../components/CommunityAccountNav";
import {
  forumService,
  type ForumMessage,
  type ForumPost,
  type ForumPostType,
} from "../services/forum.service";

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
  modalEyebrow: string;
  modalIntro: string;
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
    completeProfile: "Inicia sesión antes de participar.",
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
    modalEyebrow: "Comunidad",
    modalIntro:
      "Comparte algo que pueda ser útil para otras personas.",
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
    chatIntro: "مساحة للتعارف وطلب التوجيه السريع والتواصل.",
    chatPlaceholder: "اكتب رسالة...",
    emptyPosts: "لا توجد منشورات بهذه الفلاتر بعد.",
    emptyMine: "عندما تنشر شيئاً سيظهر هنا.",
    emptyChat: "لا توجد رسائل في الشات بعد.",
    completeProfile: "سجل الدخول قبل المشاركة.",
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
    modalEyebrow: "المجتمع",
    modalIntro: "شارك شيئاً قد يكون مفيداً للآخرين.",
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
    completeProfile: "Sign in before participating.",
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
    modalEyebrow: "Community",
    modalIntro: "Share something that may be useful to others.",
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
    completeProfile: "Hasi saioa parte hartu aurretik.",
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
    modalEyebrow: "Komunitatea",
    modalIntro:
      "Partekatu beste batzuentzat erabilgarria izan daitekeen zerbait.",
  },
};


const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function ForoMigrantesPage() {
  const { locale, t } = useI18n();

  const { currentUser, signOut } = useAuth();

  const copy =
    text[(locale as Locale) in text ? (locale as Locale) : "es"];

  const isArabic = locale === "ar";

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
  const [showChat, setShowChat] = useState(false);

  const [postDraft, setPostDraft] = useState({
    type: "question" as ForumPostType,
    title: "",
    category: "",
    body: "",
  });

  const canParticipate = Boolean(currentUser);

  const canCreatePost = canParticipate;

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

  const logout = () => {
    void signOut();
    setActiveView("all");
  };

  const createPost = async (event: FormEvent) => {
    event.preventDefault();

    if (!currentUser) {
      setNotice(copy.completeProfile);
      return;
    }

    const created = await forumService.createPost({
      userId: currentUser._id,
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

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fafbfc] text-slate-950"
    >
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {copy.eyebrow}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {copy.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                {copy.intro}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowChat(true)}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:self-auto"
            >
              <span className="text-emerald-600">●</span>
              {copy.chatTitle}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div
        id="forum-content"
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
      >
        {currentUser && <CommunityAccountNav />}
        {notice && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                ✓
              </span>

              <span className="font-semibold">{notice}</span>
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

        <div className="mx-auto max-w-3xl">
          {/* =====================================================
              POSTS
          ===================================================== */}
          <section className="min-w-0">
            {currentUser && (
              <button
                type="button"
                onClick={() => setShowComposer(true)}
                className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-start shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-emerald-50"
                  />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700">
                    {(currentUser.displayName || currentUser.fullName || "U").charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                  {copy.modalIntro}
                </span>
                <span className="hidden rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white sm:inline">
                  + {copy.publish}
                </span>
              </button>
            )}
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {copy.allPosts}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {visiblePosts.length.toLocaleString(locale)} · {copy.eyebrow}
                    </p>
                  </div>


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
                    <option value="all">{copy.filterAll}</option>
                    <option value="question">{copy.question}</option>
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
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-emerald-200 hover:shadow-md sm:p-6"
                  >
                    <div className="flex gap-4">
                      <div className="hidden shrink-0 sm:flex">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black ${
                            post.type === "announcement"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {post.type === "announcement" ? "!" : "?"}
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
                            {formatDate(post.createdAt, locale)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="whitespace-pre-line text-[15px] leading-7 text-slate-600">
                        {post.body}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPostId((current) =>
                            current === post._id ? null : post._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <span>♡</span>
                        {post.comments.length.toLocaleString(locale)}{" "}
                        {copy.comments}
                      </button>

                      <span className="text-xs font-semibold text-slate-400">
                        {post.type === "announcement"
                          ? copy.announcement
                          : copy.question}
                      </span>
                    </div>

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
                            value={commentDrafts[post._id] || ""}
                            onChange={(event) =>
                              setCommentDrafts((current) => ({
                                ...current,
                                [post._id]: event.target.value,
                              }))
                            }
                            placeholder={copy.commentPlaceholder}
                            maxLength={1200}
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                          />

                          <button
                            type="button"
                            onClick={() => void addComment(post._id)}
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
                    {copy.modalEyebrow}
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {copy.composerTitle}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {copy.modalIntro}
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

              {!currentUser ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="font-bold text-amber-900">
                    {copy.completeProfile}
                  </p>

                  <Link
                    to="/login"
                    onClick={() => setShowComposer(false)}
                    className="mt-4 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white no-underline"
                  >
                    {copy.login}
                  </Link>
                </div>
              ) : (
                <form onSubmit={createPost} className="mt-6">

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
                      onClick={() => setShowComposer(false)}
                      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      ×
                    </button>

                    <button
                      type="submit"
                      disabled={!canCreatePost}
                      className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {copy.publish}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}