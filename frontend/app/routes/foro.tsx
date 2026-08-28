import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import {
  forumService,
  type ForumMessage,
  type ForumPost,
  type ForumPostType,
} from "../services/forum.service";
import { usersService, type User } from "../services/users.service";

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
    title: "Foro de migrantes",
    intro:
      "Un espacio para que cada persona tenga su perfil comunitario, publique anuncios o dudas, reciba comentarios y converse con otras personas migrantes en Euskadi.",
    profileTitle: "Mi espacio",
    profileIntro: "Guarda un nombre público para publicar y ver tus aportaciones.",
    nameLabel: "Nombre visible",
    cityLabel: "Municipio o zona",
    saveProfile: "Guardar espacio",
    profileSaved: "Espacio guardado",
    loginTitle: "Entrar al foro",
    loginIntro: "Para publicar, comentar o usar el chat necesitas una cuenta registrada.",
    passwordLabel: "Contraseña",
    login: "Entrar",
    logout: "Salir",
    registerLink: "Crear cuenta",
    signedInAs: "Sesión iniciada como",
    phoneNotVerified: "Verifica tu teléfono para publicar, comentar y usar el chat.",
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
    searchPlaceholder: "Buscar por tema, ciudad o contenido...",
    comments: "comentarios",
    addComment: "Comentar",
    commentPlaceholder: "Escribe una respuesta útil...",
    send: "Enviar",
    chatTitle: "Chat comunitario",
    chatIntro: "Mensajes breves para saludar, pedir orientación rápida o conectar.",
    chatPlaceholder: "Escribe un mensaje corto...",
    emptyPosts: "Todavía no hay publicaciones con estos filtros.",
    emptyMine: "Cuando publiques algo, aparecerá aquí.",
    emptyChat: "Todavía no hay mensajes en el chat.",
    completeProfile: "Inicia sesión y verifica tu teléfono antes de participar.",
    loadError: "No se pudo cargar el foro.",
    postCreated: "Publicación creada.",
    commentCreated: "Comentario añadido.",
    messageCreated: "Mensaje enviado.",
    communityRulesTitle: "Cuidado comunitario",
    communityRules: [
      "Comparte información útil y evita datos personales sensibles.",
      "Respeta experiencias distintas y responde con calma.",
      "Para temas legales urgentes, busca orientación profesional.",
    ],
    otherPages: "Otras páginas",
  },
  ar: {
    eyebrow: "المجتمع",
    title: "منتدى المهاجرين",
    intro:
      "مساحة لكل مستخدم ليكون له ركنه الشخصي، ينشر فيه الإعلانات أو الاستشكالات، ويتلقى تعليقات ويتحدث مع أشخاص آخرين في إقليم الباسك.",
    profileTitle: "مساحتي الشخصية",
    profileIntro: "احفظ اسماً ظاهراً لتستعمله في النشر ورؤية مشاركاتك.",
    nameLabel: "الاسم الظاهر",
    cityLabel: "البلدية أو المنطقة",
    saveProfile: "حفظ المساحة",
    profileSaved: "تم حفظ المساحة",
    loginTitle: "الدخول إلى المنتدى",
    loginIntro: "للنشر أو التعليق أو استعمال الشات يجب أن يكون لديك حساب مسجل.",
    passwordLabel: "كلمة السر",
    login: "دخول",
    logout: "خروج",
    registerLink: "إنشاء حساب",
    signedInAs: "تم الدخول باسم",
    phoneNotVerified: "تحقق من هاتفك حتى تتمكن من النشر والتعليق واستعمال الشات.",
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
    searchPlaceholder: "ابحث حسب الموضوع أو المدينة أو المحتوى...",
    comments: "تعليقات",
    addComment: "تعليق",
    commentPlaceholder: "اكتب رداً مفيداً...",
    send: "إرسال",
    chatTitle: "الشات المجتمعي",
    chatIntro: "رسائل قصيرة للتعارف، طلب توجيه سريع، أو التواصل.",
    chatPlaceholder: "اكتب رسالة قصيرة...",
    emptyPosts: "لا توجد منشورات بهذه الفلاتر بعد.",
    emptyMine: "عندما تنشر شيئاً سيظهر هنا.",
    emptyChat: "لا توجد رسائل في الشات بعد.",
    completeProfile: "سجل الدخول وتحقق من هاتفك قبل المشاركة.",
    loadError: "تعذر تحميل المنتدى.",
    postCreated: "تم إنشاء المنشور.",
    commentCreated: "تمت إضافة التعليق.",
    messageCreated: "تم إرسال الرسالة.",
    communityRulesTitle: "عناية مجتمعية",
    communityRules: [
      "شارك معلومات مفيدة وتجنب نشر بيانات شخصية حساسة.",
      "احترم اختلاف التجارب ورد بهدوء.",
      "في الأمور القانونية العاجلة، اطلب توجيهاً مهنياً.",
    ],
    otherPages: "صفحات أخرى",
  },
  en: {
    eyebrow: "Community",
    title: "Migrant forum",
    intro:
      "A space where each person can keep a community profile, publish announcements or questions, receive comments, and chat with other migrants in Euskadi.",
    profileTitle: "My space",
    profileIntro: "Save a public name to post and see your own contributions.",
    nameLabel: "Display name",
    cityLabel: "Municipality or area",
    saveProfile: "Save space",
    profileSaved: "Space saved",
    loginTitle: "Sign in to the forum",
    loginIntro: "To publish, comment, or use chat you need a registered account.",
    passwordLabel: "Password",
    login: "Sign in",
    logout: "Log out",
    registerLink: "Create account",
    signedInAs: "Signed in as",
    phoneNotVerified: "Verify your phone to publish, comment, and use chat.",
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
    searchPlaceholder: "Search by topic, city, or content...",
    comments: "comments",
    addComment: "Comment",
    commentPlaceholder: "Write a helpful reply...",
    send: "Send",
    chatTitle: "Community chat",
    chatIntro: "Short messages to say hello, ask quick guidance, or connect.",
    chatPlaceholder: "Write a short message...",
    emptyPosts: "There are no posts with these filters yet.",
    emptyMine: "When you publish something, it will appear here.",
    emptyChat: "There are no chat messages yet.",
    completeProfile: "Sign in and verify your phone before participating.",
    loadError: "The forum could not be loaded.",
    postCreated: "Post created.",
    commentCreated: "Comment added.",
    messageCreated: "Message sent.",
    communityRulesTitle: "Community care",
    communityRules: [
      "Share useful information and avoid sensitive personal details.",
      "Respect different experiences and reply calmly.",
      "For urgent legal issues, seek professional guidance.",
    ],
    otherPages: "Other pages",
  },
  eu: {
    eyebrow: "Komunitatea",
    title: "Migratzaileen foroa",
    intro:
      "Pertsona bakoitzak komunitateko profila izan, iragarkiak edo galderak argitaratu, iruzkinak jaso eta Euskadiko beste migratzaileekin hitz egiteko espazioa.",
    profileTitle: "Nire espazioa",
    profileIntro: "Gorde izen publikoa argitaratzeko eta zure ekarpenak ikusteko.",
    nameLabel: "Bistaratzeko izena",
    cityLabel: "Udalerria edo eremua",
    saveProfile: "Gorde espazioa",
    profileSaved: "Espazioa gordeta",
    loginTitle: "Sartu foroan",
    loginIntro: "Argitaratzeko, iruzkintzeko edo txata erabiltzeko kontu erregistratua behar duzu.",
    passwordLabel: "Pasahitza",
    login: "Sartu",
    logout: "Irten",
    registerLink: "Sortu kontua",
    signedInAs: "Saioa hasita",
    phoneNotVerified: "Egiaztatu telefonoa argitaratzeko, iruzkintzeko eta txata erabiltzeko.",
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
    searchPlaceholder: "Bilatu gaiaren, hiriaren edo edukiaren arabera...",
    comments: "iruzkin",
    addComment: "Iruzkindu",
    commentPlaceholder: "Idatzi erantzun erabilgarria...",
    send: "Bidali",
    chatTitle: "Komunitateko txata",
    chatIntro: "Mezu laburrak agurtzeko, orientazio azkarra eskatzeko edo konektatzeko.",
    chatPlaceholder: "Idatzi mezu labur bat...",
    emptyPosts: "Oraindik ez dago argitalpenik iragazki hauekin.",
    emptyMine: "Zerbait argitaratzen duzunean, hemen agertuko da.",
    emptyChat: "Oraindik ez dago txateko mezurik.",
    completeProfile: "Hasi saioa eta egiaztatu telefonoa parte hartu aurretik.",
    loadError: "Ezin izan da foroa kargatu.",
    postCreated: "Argitalpena sortu da.",
    commentCreated: "Iruzkina gehitu da.",
    messageCreated: "Mezua bidali da.",
    communityRulesTitle: "Komunitate zaintza",
    communityRules: [
      "Partekatu informazio erabilgarria eta saihestu datu pertsonal sentikorrak.",
      "Errespetatu esperientzia desberdinak eta erantzun lasai.",
      "Premiazko gai juridikoetarako, bilatu orientazio profesionala.",
    ],
    otherPages: "Beste orriak",
  },
};

const quickLinks = [
  { labelKey: "f_health", to: "/servicios/salud", icon: "\uD83D\uDC97" },
  { labelKey: "f_housing", to: "/servicios/vivienda", icon: "\uD83C\uDFE0" },
  { labelKey: "f_municipalities", to: "/ayuntamientos", icon: "\uD83C\uDFDB\uFE0F" },
  { labelKey: "f_charities", to: "/servicios/asociaciones", icon: "\uD83E\uDD1D" },
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
  const copy = text[(locale as Locale) in text ? (locale as Locale) : "es"];
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    usersService.getCurrentUser()
  );
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [phoneCode, setPhoneCode] = useState("");
  const [activeView, setActiveView] = useState<"all" | "mine">("all");
  const [typeFilter, setTypeFilter] = useState<ForumPostType | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [chatDraft, setChatDraft] = useState("");
  const [postDraft, setPostDraft] = useState({
    type: "question" as ForumPostType,
    title: "",
    category: "",
    body: "",
  });

  const hasProfile = Boolean(currentUser?._id);
  const canParticipate = Boolean(
    currentUser && (currentUser.phoneVerified || currentUser.isVerified)
  );

  useEffect(() => {
    return usersService.onCurrentUserChange(() => {
      setCurrentUser(usersService.getCurrentUser());
    });
  }, []);

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
    const user = await usersService.login(loginData);
    setCurrentUser(user);
    setLoginData({ email: "", password: "" });
    setNotice(copy.profileSaved);
  };

  const logout = () => {
    usersService.logout();
    setCurrentUser(null);
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
    setPostDraft({ type: "question", title: "", category: "", body: "" });
    setActiveView("mine");
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
      current.map((post) => (post._id === updated._id ? updated : post))
    );
    setCommentDrafts((current) => ({ ...current, [postId]: "" }));
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

    setMessages((current) => [...current, created].slice(-80));
    setChatDraft("");
    setNotice(copy.messageCreated);
  };

  const verifyForumPhone = async () => {
    if (!currentUser) return;
    const user = await usersService.verifyPhone(currentUser._id, phoneCode);
    setCurrentUser(user);
    setPhoneCode("");
    setNotice(copy.phoneVerified);
  };

  const resendForumCode = async () => {
    if (!currentUser) return;
    await usersService.sendPhoneCode(currentUser._id);
    setNotice(copy.phoneCodeSent);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_78%,rgba(0,151,57,0.82)_0%,rgba(0,151,57,0.42)_24%,transparent_48%),linear-gradient(135deg,#2448ad_0%,#284fb8_46%,#173f89_100%)] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/70 px-5 py-2 text-sm font-black text-white">
              <span aria-hidden="true">{"\uD83D\uDCAC"}</span>
              {copy.eyebrow}
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-200 sm:text-2xl">
              {copy.intro}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={currentUser ? "#forum-content" : "/users/new"}
                className="rounded-lg bg-vitoria-green px-7 py-4 text-center text-lg font-black text-white no-underline shadow-lg shadow-black/20"
              >
                {currentUser ? copy.composerTitle : copy.registerLink}
              </Link>
              {!currentUser && (
                <Link
                  to="/users/login"
                  className="rounded-lg border border-white/70 px-7 py-4 text-center text-lg font-black text-white no-underline transition hover:bg-white hover:text-slate-950"
                >
                  {copy.login}
                </Link>
              )}
            </div>

            <div className="hidden">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm font-black text-slate-800 no-underline shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
                >
                  <span className="text-lg" aria-hidden="true">{link.icon}</span>
                  <span>{t(link.labelKey)}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/70 bg-white/10 backdrop-blur">
            <div className="hidden" />
            <img
              src="/images/registration-migrant-travel-hero.png"
              alt=""
              className="h-60 w-full object-cover sm:h-72"
              style={{ objectPosition: "center 35%" }}
            />
            <div className="grid gap-3 p-5">
              {copy.communityRules.map((rule, index) => (
                <div key={rule} className="rounded-lg bg-white/15 p-4">
                  <div className="mb-3 text-sm font-black text-green-200">
                    0{index + 1}
                  </div>
                  <p className="m-0 text-xl font-bold leading-relaxed text-white">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="forum-content" className="container py-4 py-lg-5">
        {notice && (
          <div className="alert alert-success d-flex justify-content-between gap-3">
            <span>{notice}</span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setNotice("")}
            />
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {copy.loadError}
          </div>
        )}

        <div className="row g-4">
          <aside className="col-12 col-xl-4">
            {currentUser ? (
              <div className="mb-4 rounded-3 border bg-white p-4 shadow-sm">
                <h2 className="h5 fw-bold mb-2">{copy.profileTitle}</h2>
                <p className="text-secondary small mb-3">{copy.signedInAs}</p>
                <div className="rounded-3 bg-light p-3 mb-3">
                  <div className="fw-semibold">
                    {currentUser.displayName || currentUser.fullName}
                  </div>
                  <div className="text-secondary small">{currentUser.email}</div>
                  {currentUser.municipality && (
                    <div className="text-secondary small">
                      {currentUser.municipality}
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="rounded-pill bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {currentUser.phoneVerified || currentUser.isVerified
                        ? copy.phoneVerified
                        : currentUser.status}
                    </span>
                  </div>
                </div>
                {!canParticipate && (
                  <div className="mb-3 rounded-3 border bg-light p-3">
                    <p className="text-secondary small mb-2">
                      {copy.phoneNotVerified}
                    </p>
                    <label className="form-label fw-semibold">
                      {copy.phoneCodeLabel}
                    </label>
                    <input
                      className="form-control mb-2"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={phoneCode}
                      onChange={(event) => setPhoneCode(event.target.value)}
                    />
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-success btn-sm rounded-pill flex-fill"
                        onClick={() => void verifyForumPhone()}
                      >
                        {copy.verifyPhone}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill flex-fill"
                        onClick={() => void resendForumCode()}
                      >
                        {copy.resendCode}
                      </button>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill fw-semibold w-100"
                  onClick={logout}
                >
                  {copy.logout}
                </button>
              </div>
            ) : (
              <form
                onSubmit={login}
                className="mb-4 rounded-3 border bg-white p-4 shadow-sm"
              >
                <h2 className="h5 fw-bold mb-2">{copy.loginTitle}</h2>
                <p className="text-secondary small mb-3">{copy.loginIntro}</p>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{t("email")}</label>
                  <input
                    type="email"
                    className="form-control"
                    value={loginData.email}
                    onChange={(event) =>
                      setLoginData((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    {copy.passwordLabel}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={loginData.password}
                    onChange={(event) =>
                      setLoginData((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <button className="btn btn-success rounded-pill fw-semibold w-100 mb-2">
                  {copy.login}
                </button>
                <Link
                  to="/users/new"
                  className="btn btn-outline-secondary rounded-pill fw-semibold w-100"
                >
                  {copy.registerLink}
                </Link>
              </form>
            )}

            <form
              onSubmit={createPost}
              className="rounded-3 border bg-white p-4 shadow-sm"
            >
              <h2 className="h5 fw-bold mb-3">{copy.composerTitle}</h2>

              <div className="mb-3">
                <label className="form-label fw-semibold">{copy.typeLabel}</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn flex-fill rounded-pill ${
                      postDraft.type === "question"
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() =>
                      setPostDraft((current) => ({ ...current, type: "question" }))
                    }
                  >
                    {"\u2753"} {copy.question}
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill rounded-pill ${
                      postDraft.type === "announcement"
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() =>
                      setPostDraft((current) => ({
                        ...current,
                        type: "announcement",
                      }))
                    }
                  >
                    {"\uD83D\uDCE3"} {copy.announcement}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {copy.postTitleLabel}
                </label>
                <input
                  className="form-control"
                  value={postDraft.title}
                  onChange={(event) =>
                    setPostDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  maxLength={160}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {copy.categoryLabel}
                </label>
                <input
                  className="form-control"
                  value={postDraft.category}
                  onChange={(event) =>
                    setPostDraft((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  maxLength={80}
                  placeholder={t("nav_services")}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">{copy.bodyLabel}</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={postDraft.body}
                  onChange={(event) =>
                    setPostDraft((current) => ({
                      ...current,
                      body: event.target.value,
                    }))
                  }
                  maxLength={4000}
                  required
                />
              </div>

              <button
                className="btn btn-success rounded-pill fw-semibold w-100"
                disabled={!canParticipate}
              >
                {copy.publish}
              </button>
              {!canParticipate && (
                <div className="text-secondary small mt-2 text-center">
                  {copy.completeProfile}
                </div>
              )}
            </form>
          </aside>

          <section className="col-12 col-xl-8">
            <div className="mb-4 rounded-3 border bg-white p-3 p-lg-4 shadow-sm">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-lg-5">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${
                        activeView === "all" ? "btn-success" : "btn-outline-secondary"
                      }`}
                      onClick={() => setActiveView("all")}
                    >
                      {copy.allPosts}
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        activeView === "mine" ? "btn-success" : "btn-outline-secondary"
                      }`}
                      onClick={() => setActiveView("mine")}
                    >
                      {copy.mySpace}
                    </button>
                  </div>
                </div>

                <div className="col-12 col-lg-3">
                  <select
                    className="form-select"
                    value={typeFilter}
                    onChange={(event) =>
                      setTypeFilter(event.target.value as ForumPostType | "all")
                    }
                  >
                    <option value="all">{copy.filterAll}</option>
                    <option value="question">{copy.question}</option>
                    <option value="announcement">{copy.announcement}</option>
                  </select>
                </div>

                <div className="col-12 col-lg-4">
                  <input
                    className="form-control"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={copy.searchPlaceholder}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-secondary">{t("loading")}</div>
            ) : visiblePosts.length === 0 ? (
              <div className="rounded-3 border bg-white p-4 text-secondary shadow-sm">
                {activeView === "mine" ? copy.emptyMine : copy.emptyPosts}
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {visiblePosts.map((post) => (
                  <article
                    key={post._id}
                    className="rounded-3 border bg-white p-4 shadow-sm"
                  >
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          <span
                            className={`rounded-pill px-3 py-1 text-sm font-semibold ${
                              post.type === "announcement"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {post.type === "announcement"
                              ? `\uD83D\uDCE3 ${copy.announcement}`
                              : `\u2753 ${copy.question}`}
                          </span>
                          {post.category && (
                            <span className="rounded-pill bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                              {post.category}
                            </span>
                          )}
                        </div>
                        <h2 className="h4 fw-bold mb-2">{post.title}</h2>
                        <div className="text-secondary small">
                          {post.authorName}
                          {post.authorCity ? ` · ${post.authorCity}` : ""} ·{" "}
                          {formatDate(post.createdAt, locale)}
                        </div>
                      </div>
                    </div>

                    <p className="text-secondary mb-3 whitespace-pre-line">
                      {post.body}
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm rounded-pill fw-semibold"
                      onClick={() =>
                        setExpandedPostId((current) =>
                          current === post._id ? null : post._id
                        )
                      }
                    >
                      {post.comments.length.toLocaleString(locale)} {copy.comments}
                    </button>

                    {expandedPostId === post._id && (
                      <div className="mt-3 rounded-3 border bg-light p-3">
                        <div className="d-flex flex-column gap-3 mb-3">
                          {post.comments.map((comment) => (
                            <div
                              key={comment._id || `${comment.authorName}-${comment.createdAt}`}
                              className="rounded-3 bg-white p-3"
                            >
                              <div className="small fw-semibold mb-1">
                                {comment.authorName}
                                {comment.authorCity ? ` · ${comment.authorCity}` : ""}
                              </div>
                              <div className="text-secondary small mb-2">
                                {formatDate(comment.createdAt, locale)}
                              </div>
                              <p className="mb-0 text-secondary">{comment.body}</p>
                            </div>
                          ))}
                        </div>

                        <div className="d-flex gap-2">
                          <input
                            className="form-control"
                            value={commentDrafts[post._id] || ""}
                            onChange={(event) =>
                              setCommentDrafts((current) => ({
                                ...current,
                                [post._id]: event.target.value,
                              }))
                            }
                            placeholder={copy.commentPlaceholder}
                            maxLength={1200}
                          />
                          <button
                            type="button"
                            className="btn btn-success rounded-pill px-4"
                            onClick={() => void addComment(post._id)}
                            disabled={!canParticipate}
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

        <section className="row g-4 mt-1">
          <div className="col-12 col-xl-8">
            <div className="rounded-3 border bg-white p-4 shadow-sm">
              <h2 className="h5 fw-bold mb-3">{copy.communityRulesTitle}</h2>
              <div className="row g-3">
                {copy.communityRules.map((rule, index) => (
                  <div key={rule} className="col-12 col-md-4">
                    <div className="h-100 rounded-3 border bg-light p-3">
                      <div className="small fw-bold text-success mb-2">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <p className="text-secondary mb-0">{rule}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="col-12 col-xl-4">
            <div className="rounded-3 border bg-white p-4 shadow-sm">
              <h2 className="h5 fw-bold mb-2">{copy.chatTitle}</h2>
              <p className="text-secondary small mb-3">{copy.chatIntro}</p>

              <div
                className="mb-3 d-flex flex-column gap-2 overflow-auto rounded-3 border bg-light p-3"
                style={{ maxHeight: 320 }}
              >
                {messages.length === 0 ? (
                  <div className="text-secondary small">{copy.emptyChat}</div>
                ) : (
                  messages.map((message) => (
                    <div key={message._id} className="rounded-3 bg-white p-3">
                      <div className="small fw-semibold">
                        {message.authorName}
                        {message.authorCity ? ` · ${message.authorCity}` : ""}
                      </div>
                      <p className="mb-1 text-secondary">{message.body}</p>
                      <div className="text-secondary small">
                        {formatDate(message.createdAt, locale)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="d-flex gap-2">
                <input
                  className="form-control"
                  value={chatDraft}
                  onChange={(event) => setChatDraft(event.target.value)}
                  placeholder={copy.chatPlaceholder}
                  maxLength={1000}
                />
                <button
                  className="btn btn-success rounded-pill px-4"
                  disabled={!canParticipate}
                >
                  {copy.send}
                </button>
              </form>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
