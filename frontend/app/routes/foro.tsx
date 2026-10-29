import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useAuth,
} from "../auth";

import {
  useI18n,
} from "../i18n";

import CommunityAccountNav from "../components/CommunityAccountNav";

import {
  forumService,
  type ForumMessage,
  type ForumPost,
  type ForumPostType,
} from "../services/forum.service";

import {
  needsService,
  type Need,
} from "../services/needs.service";

type Locale =
  | "eu"
  | "es"
  | "en"
  | "ar";

/* =========================================================
   Date
========================================================= */

function formatDate(
  value: string,
  locale: string
) {
  return new Intl.DateTimeFormat(
    locale,
    {
      day:
        "2-digit",

      month:
        "short",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  ).format(
    new Date(value)
  );
}

/* =========================================================
   Need localized label
========================================================= */

function localizedNeedLabel(
  need: Need,
  locale: Locale
) {
  return (
    need.labels?.[
      locale
    ] ||
    need.labels?.es ||
    need.code
  );
}

/* =========================================================
   Find populated Need
========================================================= */

function postNeeds(
  post: ForumPost
): Need[] {
  return post.needIds.filter(
    (
      item
    ): item is Need =>
      typeof item !==
      "string"
  );
}

/* =========================================================
   Forum
========================================================= */

export default function ForoMigrantesPage() {
  const {
    locale,
    t,
  } = useI18n();

  const {
    currentUser,
  } = useAuth();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const activeLocale =
    (
      [
        "eu",
        "es",
        "en",
        "ar",
      ] as string[]
    ).includes(locale)
      ? (locale as Locale)
      : "es";

  const isArabic =
    activeLocale ===
    "ar";

  /* =======================================================
     URL Need filter
  ======================================================= */

  const needId =
    searchParams.get(
      "needId"
    )?.trim() ||
    "";

  /* =======================================================
     Data
  ======================================================= */

  const [
    posts,
    setPosts,
  ] = useState<
    ForumPost[]
  >([]);

  const [
    messages,
    setMessages,
  ] = useState<
    ForumMessage[]
  >([]);

  const [
    needs,
    setNeeds,
  ] = useState<
    Need[]
  >([]);

  const [
    activeNeed,
    setActiveNeed,
  ] = useState<
    Need | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    error,
    setError,
  ] = useState(
    ""
  );

  /* =======================================================
     UI state
  ======================================================= */

  const [
    activeView,
    setActiveView,
  ] =
    useState<
      "all" |
      "mine"
    >(
      "all"
    );

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<
      ForumPostType |
      "all"
    >(
      "all"
    );

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  const [
    expandedPostId,
    setExpandedPostId,
  ] =
    useState<
      string | null
    >(null);

  const [
    commentDrafts,
    setCommentDrafts,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});

  const [
    chatDraft,
    setChatDraft,
  ] =
    useState(
      ""
    );

  const [
    showComposer,
    setShowComposer,
  ] =
    useState(
      false
    );

  const [
    showChat,
    setShowChat,
  ] =
    useState(
      false
    );

  const [
    postDraft,
    setPostDraft,
  ] =
    useState({
      type:
        "question" as ForumPostType,

      title:
        "",

      body:
        "",

      needId:
        "",
    });

  /* =======================================================
     Participation
  ======================================================= */

  const canParticipate =
    Boolean(
      currentUser
    );

  const canCreatePost =
    Boolean(
      currentUser &&
        postDraft.title.trim() &&
        postDraft.body.trim()
    );

  /* =======================================================
     Keep composer linked to URL Need
  ======================================================= */

  useEffect(() => {
    setPostDraft(
      (
        current
      ) => ({
        ...current,

        needId:
          needId ||
          "",
      })
    );
  }, [needId]);

  /* =======================================================
     Load Needs
  ======================================================= */

  useEffect(() => {
    let mounted =
      true;

    const loadNeeds =
      async () => {
        try {
          const data =
            await needsService.list();

          if (!mounted) {
            return;
          }

          const list =
            Array.isArray(
              data
            )
              ? data
              : [];

          setNeeds(
            list
          );

          if (
            needId
          ) {
            const match =
              list.find(
                (need) =>
                  need._id ===
                  needId
              );

            if (match) {
              setActiveNeed(
                match
              );

              return;
            }

            try {
              const loadedNeed =
                await needsService.getById(
                  needId
                );

              if (
                mounted
              ) {
                setActiveNeed(
                  loadedNeed
                );
              }
            } catch {
              if (
                mounted
              ) {
                setActiveNeed(
                  null
                );
              }
            }
          } else {
            setActiveNeed(
              null
            );
          }
        } catch (
          error
        ) {
          console.error(
            "Failed to load needs:",
            error
          );

          if (
            mounted
          ) {
            setNeeds(
              []
            );
          }
        }
      };

    void loadNeeds();

    return () => {
      mounted =
        false;
    };
  }, [needId]);

  /* =======================================================
     Load Forum
  ======================================================= */

  useEffect(() => {
    let mounted =
      true;

    const loadForum =
      async () => {
        setLoading(
          true
        );

        setError(
          ""
        );

        try {
          const [
            postsData,
            messagesData,
          ] =
            await Promise.all([
              forumService.listPosts(
                {
                  type:
                    typeFilter,

                  q:
                    search.trim() ||
                    undefined,

                  needId:
                    needId ||
                    undefined,
                }
              ),

              forumService.listMessages(),
            ]);

          if (!mounted) {
            return;
          }

          setPosts(
            Array.isArray(
              postsData
            )
              ? postsData
              : []
          );

          setMessages(
            Array.isArray(
              messagesData
            )
              ? messagesData
              : []
          );
        } catch (
          error: any
        ) {
          console.error(
            "Failed to load forum:",
            error
          );

          if (
            mounted
          ) {
            setError(
              String(
                error?.message ||
                  ""
              )
            );
          }
        } finally {
          if (
            mounted
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void loadForum();

    return () => {
      mounted =
        false;
    };
  }, [
    needId,
    typeFilter,
    search,
  ]);

  /* =======================================================
     Visible posts
  ======================================================= */

  const visiblePosts =
    useMemo(
      () => {
        if (
          activeView ===
          "mine"
        ) {
          return posts.filter(
            (
              post
            ) =>
              post.authorUserId ===
              currentUser?._id
          );
        }

        return posts;
      },
      [
        activeView,
        currentUser?._id,
        posts,
      ]
    );

  /* =======================================================
     Clear Need filter
  ======================================================= */

  const clearNeedFilter =
    () => {
      const next =
        new URLSearchParams(
          searchParams
        );

      next.delete(
        "needId"
      );

      setSearchParams(
        next
      );
    };

  /* =======================================================
     Create Post
  ======================================================= */

  const createPost =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      if (
        !currentUser
      ) {
        return;
      }

      const title =
        postDraft.title.trim();

      const body =
        postDraft.body.trim();

      if (
        !title ||
        !body
      ) {
        return;
      }

      try {
        const selectedNeedIds =
          postDraft.needId
            ? [
                postDraft.needId,
              ]
            : [];

        const created =
          await forumService.createPost(
            {
              userId:
                currentUser._id,

              type:
                postDraft.type,

              title,

              body,

              needIds:
                selectedNeedIds,
            }
          );

        /*
         * When the forum is filtered
         * by a Need, the created post
         * belongs to that same stream.
         */
        if (
          !needId ||
          selectedNeedIds.includes(
            needId
          )
        ) {
          setPosts(
            (
              current
            ) => [
              created,
              ...current,
            ]
          );
        }

        setPostDraft({
          type:
            "question",

          title:
            "",

          body:
            "",

          needId:
            needId ||
            "",
        });

        setShowComposer(
          false
        );

        setActiveView(
          "all"
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to create forum post:",
          error
        );
      }
    };

  /* =======================================================
     Add Comment
  ======================================================= */

  const addComment =
    async (
      postId:
        string
    ) => {
      if (
        !currentUser
      ) {
        return;
      }

      const body =
        commentDrafts[
          postId
        ]?.trim();

      if (!body) {
        return;
      }

      try {
        const updated =
          await forumService.addComment(
            postId,
            {
              userId:
                currentUser._id,

              body,
            }
          );

        setPosts(
          (
            current
          ) =>
            current.map(
              (
                post
              ) =>
                post._id ===
                updated._id
                  ? updated
                  : post
            )
        );

        setCommentDrafts(
          (
            current
          ) => ({
            ...current,

            [postId]:
              "",
          })
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to add comment:",
          error
        );
      }
    };

  /* =======================================================
     Community chat
  ======================================================= */

  const sendMessage =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      if (
        !currentUser
      ) {
        return;
      }

      const body =
        chatDraft.trim();

      if (!body) {
        return;
      }

      try {
        const created =
          await forumService.createMessage(
            {
              userId:
                currentUser._id,

              body,
            }
          );

        setMessages(
          (
            current
          ) =>
            [
              ...current,
              created,
            ].slice(
              -80
            )
        );

        setChatDraft(
          ""
        );
      } catch (
        error
      ) {
        console.error(
          "Failed to send community message:",
          error
        );
      }
    };

  /* =======================================================
     Render
  ======================================================= */

  return (
    <main
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
      className="min-h-screen bg-[#fafbfc] text-slate-950"
    >
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                {t(
                  "nav_forum"
                )}
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {activeNeed
                  ? localizedNeedLabel(
                      activeNeed,
                      activeLocale
                    )
                  : t(
                      "profile_community"
                    )}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                {activeNeed
                  ? t(
                      "need_detail_community_text"
                    )
                  : t(
                      "community_description"
                    )}
              </p>

              {/* =============================================
                  Active Need context
              ============================================= */}

              {activeNeed && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
                    <span>
                      ●
                    </span>

                    {localizedNeedLabel(
                      activeNeed,
                      activeLocale
                    )}
                  </span>

                  <Link
                    to={`/necesidades/${activeNeed._id}`}
                    className="text-sm font-bold text-slate-600 no-underline hover:text-emerald-700"
                  >
                    {t(
                      "back"
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={
                      clearNeedFilter
                    }
                    className="text-sm font-bold text-slate-500 transition hover:text-emerald-700"
                  >
                    {t(
                      "nav_forum"
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowChat(
                  true
                )
              }
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:self-auto"
            >
              <span className="text-emerald-600">
                ●
              </span>

              {t(
                "community_trust_title"
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {currentUser && (
          <CommunityAccountNav />
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {t(
              "no_data"
            )}
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          {/* =================================================
              CREATE POST ENTRY
          ================================================= */}

          <section>
            {currentUser ? (
              <button
                type="button"
                onClick={() =>
                  setShowComposer(
                    true
                  )
                }
                className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-start shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                {currentUser.profileImage ? (
                  <img
                    src={
                      currentUser.profileImage
                    }
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-black text-emerald-700">
                    {(
                      currentUser.displayName ||
                      currentUser.fullName ||
                      "U"
                    )
                      .charAt(
                        0
                      )
                      .toUpperCase()}
                  </div>
                )}

                <div className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-500">
                  {t(
                    "modalIntro"
                  )}
                </div>
              </button>
            ) : (
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 text-start shadow-sm">
                <p className="text-sm leading-6 text-slate-600">
                  {t(
                    "profile_community_desc"
                  )}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/login"
                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white no-underline"
                  >
                    {t(
                      "login_button"
                    )}
                  </Link>

                  <Link
                    to="/usuarios/nuevo"
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 no-underline"
                  >
                    {t(
                      "register_title"
                    )}
                  </Link>
                </div>
              </div>
            )}

            {/* ===============================================
                FILTER BAR
            =============================================== */}

            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <span
                    aria-hidden
                    className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    ⌕
                  </span>

                  <input
                    value={
                      search
                    }
                    onChange={(
                      event
                    ) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder={t(
                      "search"
                    )}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pe-4 ps-10 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setTypeFilter(
                        "all"
                      )
                    }
                    aria-label={t(
                      "type"
                    )}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-black transition ${
                      typeFilter ===
                      "all"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    *
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTypeFilter(
                        "question"
                      )
                    }
                    aria-label={`${t(
                      "type"
                    )} ?`}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-black transition ${
                      typeFilter ===
                      "question"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    ❓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setTypeFilter(
                        "announcement"
                      )
                    }
                    aria-label={`${t(
                      "type"
                    )} !`}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-black transition ${
                      typeFilter ===
                      "announcement"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    📢
                  </button>
                </div>
              </div>

              {currentUser && (
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveView(
                        "all"
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      activeView ===
                      "all"
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {t(
                      "profile_community"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveView(
                        "mine"
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      activeView ===
                      "mine"
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {t(
                      "profile_title"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ===============================================
                POSTS
            =============================================== */}

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  {t(
                    "loading"
                  )}
                </p>
              </div>
            ) : visiblePosts.length ===
              0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  ✦
                </div>

                <p className="mt-4 font-bold text-slate-700">
                  {t(
                    "no_data"
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visiblePosts.map(
                  (
                    post
                  ) => {
                    const relatedNeeds =
                      postNeeds(
                        post
                      );

                    return (
                      <article
                        key={
                          post._id
                        }
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md"
                      >
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700">
                              {(
                                post.authorName ||
                                "U"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                                    post.type ===
                                    "announcement"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-emerald-50 text-emerald-700"
                                  }`}
                                >
                                  {post.type ===
                                  "announcement"
                                    ? "📢"
                                    : "❓"}
                                </span>

                                {relatedNeeds.map(
                                  (
                                    need
                                  ) => (
                                    <Link
                                      key={
                                        need._id
                                      }
                                      to={`/foro?needId=${need._id}`}
                                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 no-underline"
                                    >
                                      {localizedNeedLabel(
                                        need,
                                        activeLocale
                                      )}
                                    </Link>
                                  )
                                )}
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-400">
                                <span className="font-bold text-slate-600">
                                  {
                                    post.authorName
                                  }
                                </span>

                                {post.authorCity && (
                                  <>
                                    <span>
                                      ·
                                    </span>

                                    <span>
                                      {
                                        post.authorCity
                                      }
                                    </span>
                                  </>
                                )}

                                <span>
                                  ·
                                </span>

                                <span>
                                  {formatDate(
                                    post.createdAt,
                                    activeLocale
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <h2 className="mt-4 text-lg font-black leading-snug text-slate-950 transition group-hover:text-emerald-700 sm:text-xl">
                            {
                              post.title
                            }
                          </h2>

                          <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-slate-700">
                            {
                              post.body
                            }
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 sm:px-5">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedPostId(
                                (
                                  current
                                ) =>
                                  current ===
                                  post._id
                                    ? null
                                    : post._id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <span>
                              💬
                            </span>

                            {
                              post.comments
                                .length
                            }
                          </button>

                          <span className="text-xs text-slate-400">
                            {post.type ===
                            "announcement"
                              ? "📢"
                              : "❓"}
                          </span>
                        </div>

                        {expandedPostId ===
                          post._id && (
                          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
                            <div className="space-y-3">
                              {post.comments
                                .length ===
                              0 ? (
                                <p className="text-sm text-slate-500">
                                  {t(
                                    "no_data"
                                  )}
                                </p>
                              ) : (
                                post.comments.map(
                                  (
                                    comment
                                  ) => (
                                    <div
                                      key={
                                        comment._id ||
                                        `${comment.authorName}-${comment.createdAt}`
                                      }
                                      className="flex items-start gap-2"
                                    >
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-black text-slate-600">
                                        {(
                                          comment.authorName ||
                                          "U"
                                        )
                                          .charAt(
                                            0
                                          )
                                          .toUpperCase()}
                                      </div>

                                      <div className="min-w-0 max-w-[90%]">
                                        <div className="rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                                          <p className="m-0 text-xs font-bold text-slate-800">
                                            {
                                              comment.authorName
                                            }

                                            {comment.authorCity
                                              ? ` · ${comment.authorCity}`
                                              : ""}
                                          </p>

                                          <p className="mb-0 mt-1 text-sm leading-5 text-slate-700">
                                            {
                                              comment.body
                                            }
                                          </p>
                                        </div>

                                        <p className="mt-1 px-2 text-[10px] text-slate-400">
                                          {formatDate(
                                            comment.createdAt,
                                            activeLocale
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )
                              )}
                            </div>

                            {currentUser ? (
                              <div className="mt-4 flex gap-2">
                                <input
                                  value={
                                    commentDrafts[
                                      post
                                        ._id
                                    ] ||
                                    ""
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setCommentDrafts(
                                      (
                                        current
                                      ) => ({
                                        ...current,

                                        [post._id]:
                                          event
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  placeholder={t(
                                    "message"
                                  )}
                                  maxLength={
                                    1200
                                  }
                                  className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    void addComment(
                                      post._id
                                    )
                                  }
                                  className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                                >
                                  {t(
                                    "send_message_btn"
                                  )}
                                </button>
                              </div>
                            ) : (
                              <Link
                                to="/login"
                                className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white no-underline"
                              >
                                {t(
                                  "login_button"
                                )}
                              </Link>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ===================================================
          CHAT MODAL
      =================================================== */}

      {showChat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowChat(
                false
              );
            }
          }}
        >
          <div className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  {t(
                    "community_trust_title"
                  )}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {t(
                    "community_trust_desc"
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowChat(
                    false
                  )
                }
                aria-label={t(
                  "cancel"
                )}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4">
              {messages.length ===
              0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  {t(
                    "no_data"
                  )}
                </div>
              ) : (
                messages.map(
                  (
                    message
                  ) => (
                    <div
                      key={
                        message._id
                      }
                      className="flex items-start gap-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-black text-slate-600 shadow-sm">
                        {(
                          message.authorName ||
                          "U"
                        )
                          .charAt(
                            0
                          )
                          .toUpperCase()}
                      </div>

                      <div className="max-w-[82%] rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {
                              message.authorName
                            }
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {formatDate(
                              message.createdAt,
                              activeLocale
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-5 text-slate-700">
                          {
                            message.body
                          }
                        </p>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {currentUser ? (
              <form
                onSubmit={
                  sendMessage
                }
                className="flex gap-2 border-t border-slate-100 bg-white p-4"
              >
                <input
                  value={
                    chatDraft
                  }
                  onChange={(
                    event
                  ) =>
                    setChatDraft(
                      event.target.value
                    )
                  }
                  placeholder={t(
                    "message"
                  )}
                  maxLength={
                    1000
                  }
                  className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />

                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  {t(
                    "send_message_btn"
                  )}
                </button>
              </form>
            ) : (
              <div className="border-t border-slate-100 bg-white p-4">
                <Link
                  to="/login"
                  className="inline-flex rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white no-underline"
                >
                  {t(
                    "login_button"
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          CREATE POST MODAL
      =================================================== */}

      {showComposer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowComposer(
                false
              );
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  {t(
                    "modalEyebrow"
                  )}
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  {t(
                    "home_quick_community"
                  )}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t(
                    "modalIntro"
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowComposer(
                    false
                  )
                }
                aria-label={t(
                  "cancel"
                )}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                createPost
              }
              className="mt-6"
            >
              {/* =============================================
                  TYPE
              ============================================= */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t(
                    "type"
                  )}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPostDraft(
                        (
                          current
                        ) => ({
                          ...current,

                          type:
                            "question",
                        })
                      )
                    }
                    aria-label={`${t(
                      "type"
                    )} ?`}
                    className={`rounded-xl border px-4 py-3 text-xl font-bold transition ${
                      postDraft.type ===
                      "question"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ❓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPostDraft(
                        (
                          current
                        ) => ({
                          ...current,

                          type:
                            "announcement",
                        })
                      )
                    }
                    aria-label={`${t(
                      "type"
                    )} !`}
                    className={`rounded-xl border px-4 py-3 text-xl font-bold transition ${
                      postDraft.type ===
                      "announcement"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📢
                  </button>
                </div>
              </div>

              {/* =============================================
                  NEED
              ============================================= */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t(
                    "needs_title"
                  )}
                </label>

                <select
                  value={
                    postDraft.needId
                  }
                  disabled={
                    Boolean(
                      needId
                    )
                  }
                  onChange={(
                    event
                  ) =>
                    setPostDraft(
                      (
                        current
                      ) => ({
                        ...current,

                        needId:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="">
                    —
                  </option>

                  {needs.map(
                    (
                      need
                    ) => (
                      <option
                        key={
                          need._id
                        }
                        value={
                          need._id
                        }
                      >
                        {localizedNeedLabel(
                          need,
                          activeLocale
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* =============================================
                  TITLE
              ============================================= */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t(
                    "subject"
                  )}
                </label>

                <input
                  value={
                    postDraft.title
                  }
                  onChange={(
                    event
                  ) =>
                    setPostDraft(
                      (
                        current
                      ) => ({
                        ...current,

                        title:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  maxLength={
                    160
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* =============================================
                  BODY
              ============================================= */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {t(
                    "message"
                  )}
                </label>

                <textarea
                  rows={
                    6
                  }
                  value={
                    postDraft.body
                  }
                  onChange={(
                    event
                  ) =>
                    setPostDraft(
                      (
                        current
                      ) => ({
                        ...current,

                        body:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  maxLength={
                    4000
                  }
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* =============================================
                  ACTIONS
              ============================================= */}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setShowComposer(
                      false
                    )
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  {t(
                    "cancel"
                  )}
                </button>

                <button
                  type="submit"
                  disabled={
                    !canCreatePost
                  }
                  className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t(
                    "send_message_btn"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}